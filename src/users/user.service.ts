/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { RegisterDto } from './dtos/register.dto';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from './dtos/login.dto';
import { AuthReturnType, JWTPayloadType } from 'src/utils/types';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthProvider } from './auth.provider';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';/* eslint-disable prettier/prettier */
/**
 * Service for managing user operations including authentication and user CRUD
 */
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly authProvider: AuthProvider,
  ) { }
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
   */
  public async register(registerDto: RegisterDto): Promise<AuthReturnType> {
    return this.authProvider.register(registerDto);
  }

  /**
   * Authenticates a user and returns an access token
   * @param loginDto - Object containing email and password
   * @returns Promise resolving to AuthReturnType containing user and access token
   */
  public async login(loginDto: LoginDto): Promise<AuthReturnType> {
    return this.authProvider.login(loginDto);
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
      user.password = await this.authProvider.hashPassword(password);
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
  public async setProfileImage(userId: number, newProfileImage: string) {
    const user = await this.getCurrentUser(userId);
    if (user.profileImage == null) {
      user.profileImage = newProfileImage;
    } else {
      await this.removeProfileImage(userId);
      user.profileImage = newProfileImage;
    }
    user.profileImage = newProfileImage;
    return await this.userRepo.save(user);
  }

  public async removeProfileImage(userId: number) {
    const user = await this.getCurrentUser(userId);
    if (!user.profileImage) {
      throw new BadRequestException('no image found');
    }
    const imagePath = join(
      process.cwd(),
      `images/uploads/users/${user.profileImage}`,
    );
    if (existsSync(imagePath)) {
      unlinkSync(imagePath);
    }
    user.profileImage = null;
    const image = await this.userRepo.save(user);
    return {
      message: "image deleted successfully",
      image
    }
  }
  public logout() { }
}
