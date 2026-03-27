/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { RegisterDto } from './dtos/register.dto';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthReturnType, JWTPayloadType } from 'src/utils/types';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from './dtos/update-user.dto';
/* eslint-disable prettier/prettier */
/**
 * Service for managing user operations including authentication and user CRUD
 */
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  /**
   * Retrieves all users from the database
   * @returns Promise resolving to an array of User entities
   */
  public getAllUsers(): Promise<User[]> {
    const user = this.userRepo.find();
    return user;
  }

  /**
   * Registers a new user in the system
   * @param registerDto - Object containing email, username, and password
   * @returns Promise resolving to AuthReturnType containing user and access token
   * @throws BadRequestException if user already exists
   */
  public async register(registerDto: RegisterDto): Promise<AuthReturnType> {
    const { email, username, password } = registerDto;
    const user = await this.userRepo.findOne({ where: { email } });
    if (user) {
      throw new BadRequestException('user is already exist');
    }
    const hashedPassword = await this.hashPassword(password);
    let newUser = this.userRepo.create({
      email,
      username,
      password: hashedPassword,
    });
    newUser = await this.userRepo.save(newUser);
    const payload: JWTPayloadType = {
      id: newUser.id,
      userType: newUser.userType,
    };
    const accessToken = await this.generateJWT(payload);

    return { user: newUser, accessToken };
  }

  /**
   * Authenticates a user and returns an access token
   * @param loginDto - Object containing email and password
   * @returns Promise resolving to AuthReturnType containing user and access token
   * @throws BadRequestException if user doesn't exist
   * @throws UnauthorizedException if password is invalid
   */
  public async login(loginDto: LoginDto): Promise<AuthReturnType> {
    const { email, password } = loginDto;
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('user is not exist');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('invalid email or pasword ');
    }
    const payload: JWTPayloadType = { id: user.id, userType: user.userType };
    const accessToken = await this.generateJWT(payload);

    return { user: user, accessToken };
  }
  /**
   * Retrieves the current authenticated user by ID
   * @param id - The user's unique identifier
   * @returns Promise resolving to the User entity
   * @throws NotFoundException if user doesn't exist
   */
  public async getCurrentUser(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }
  /**
   * Updates an existing user's information
   * @param id - The user's unique identifier
   * @param updateUserDto - Object containing optional username and password
   * @returns Promise resolving to the updated User entity
   * @throws NotFoundException if user doesn't exist
   */
  public async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const { password, username } = updateUserDto;
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('user not found');

    user.username = username ?? user.username;
    if (password) {
      user.password = await this.hashPassword(password);
    }
    return await this.userRepo.save(user);
  }
  /**
   * Deletes a user by ID with authorization check
   * @param id - The user's unique identifier
   * @param payload - JWT payload containing user ID and userType
   * @returns Promise resolving to success message object
   * @throws ForbiddenException if user is not authorized to delete
   */
  public async deleteUser(
    id: number,
    payload: JWTPayloadType,
  ): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (
      user?.id === payload?.id ||
      payload.userType === 'admin' ||
      payload.userType === 'ADMIN'
    ) {
      await this.userRepo.delete(id);
      return { message: 'user deleted successfully' };
    }
    throw new ForbiddenException('you are not allowed to delete this user');
  }
  public logout() {}

  /**
   * Generates a JWT token for the given payload
   * @param payload - Object containing user ID and userType
   * @returns Promise resolving to JWT token string
   */
  private async generateJWT(payload: JWTPayloadType): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }
  /**
   * Hashes a plain text password using bcrypt
   * @param password - Plain text password to hash
   * @returns Promise resolving to hashed password string
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
