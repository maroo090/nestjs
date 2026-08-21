import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { RegisterDto } from './dtos/register.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthReturnType, JWTPayloadType } from '../utils/types';
import { MailService } from '../mail/mail.service';
import { randomBytes } from 'node:crypto';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDto } from './dtos/reset-password.dto';
@Injectable()
export class AuthProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly config: ConfigService,
  ) {}
  /**
   * Registers a new user in the system
   * @param registerDto - Object containing email, username, and password
   * @returns Promise resolving to AuthReturnType containing user and access token
   * @throws BadRequestException if user already exists
   */
  public async register(
    registerDto: RegisterDto,
  ): Promise<{ message: string }> {
    const { email, username, password } = registerDto;
    const user = await this.userRepo.findOne({ where: { email } });
    if (user) {
      throw new BadRequestException('user is already exist');
    }
    const hashedPassword = await this.hashPassword(password);
    const verificationToken = randomBytes(32).toString('hex');
    let newUser = this.userRepo.create({
      email,
      username,
      password: hashedPassword,
      verificationToken,
    });
    newUser = await this.userRepo.save(newUser);
    const link = this.generateLink(newUser.id, newUser.verificationToken!);
    await this.mailService.sendVerifyEmailTemplate(email, link);

    return {
      message:
        'Verification email has been sent to your email, please verify your email',
    };
  }

  /**
   * Authenticates a user and returns an access token
   * @param loginDto - Object containing email and password
   * @returns Promise resolving to AuthReturnType containing user and access token
   * @throws BadRequestException if user doesn't exist
   * @throws UnauthorizedException if password is invalid
   */
  public async login(loginDto: LoginDto): Promise<AuthReturnType> {
    try {
      const { email, password } = loginDto;
      const user = await this.userRepo.findOne({ where: { email } });
      if (!user) {
        throw new BadRequestException('Invalid email or password');
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('invalid email or pasword ');
      }
      if (!user.isAccountVerified) {
        if (!user.verificationToken) {
          user.verificationToken = randomBytes(32).toString('hex');
          await this.userRepo.save(user);
        }
        const link = this.generateLink(user.id, user.verificationToken);
        await this.mailService.sendVerifyEmailTemplate(user.email, link);
        return {
          message:
            'Verification email has been sent to your email, please verify your email',
        };
      }
      const payload: JWTPayloadType = { id: user.id, userType: user.userType };
      const accessToken = await this.generateJWT(payload);
      await this.mailService.sendLoginEmail(user.email, user.username);
      return { user: user, accessToken };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  public async sendResetPassword(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      return {
        message:
          'If that email exists in our system, we sent a password reset link.',
      };
    }
    user.resetPasswordToken = randomBytes(32).toString('hex');
    const result = await this.userRepo.save(user);
    const link = `http://localhost:3000/reset-password/${result.id}/${result.resetPasswordToken}`;
    await this.mailService.sendResetPasswordTemplate(email, link);

    return { message: 'Password reset link sent' };
  }

  public async resetPasswordVerify(id: number, token: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      return {
        message:
          'If that email exists in our system, we sent a password reset link.',
      };
    }
    if (user.resetPasswordToken === null || user.resetPasswordToken !== token) {
      throw new BadRequestException('Invalid link or token');
    }
    return { message: 'Password reset link verified' };
  }

  public async resetPasword(dto:ResetPasswordDto) {
    const { newPassword, userId, token } = dto;
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('Invalid userId');
    }
    if (user.resetPasswordToken===null || user.resetPasswordToken !== token) {
      throw new BadRequestException('Invalid link or token');
    }
    user.password = await this.hashPassword(newPassword);
    user.resetPasswordToken = null;
    await this.userRepo.save(user);
    return { message: 'Password reset successfully' };
  }

  /**
   * Hashes a plain text password using bcrypt
   * @param password - Plain text password to hash
   * @returns Promise resolving to hashed password string
   */
  public async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  /**
   * Generates a JWT token for the given payload
   * @param payload - Object containing user ID and userType
   * @returns Promise resolving to JWT token string
   */
  private async generateJWT(payload: JWTPayloadType): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  private generateLink(userId: number, token: string) {
    const link = `${this.config.get<string>('DOMAIN')}/api/users/verify-email/${userId}/${token}`;
    return link;
  }
}
