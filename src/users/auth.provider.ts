/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { RegisterDto } from './dtos/register.dto';
import {
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthReturnType, JWTPayloadType } from 'src/utils/types';
@Injectable()
export class AuthProvider {

    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly jwtService: JwtService,
    ) {

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
}