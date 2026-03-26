/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { RegisterDto } from './dtos/register.dtos';
import {
    BadRequestException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthReturnType, JWTPayloadType } from 'src/utils/types';
import { ConfigService } from '@nestjs/config';
/* eslint-disable prettier/prettier */
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }
    public getAllUsers(): Promise<User[]> {
        const user = this.userRepo.find();
        return user;
    }

    public async register(registerDto: RegisterDto): Promise<AuthReturnType> {
        const { email, username, password } = registerDto
        const user = await this.userRepo.findOne({ where: { email } })
        if (user) {
            throw new BadRequestException('user is already exist')
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        let newUser = this.userRepo.create({
            email,
            username,
            password: hashedPassword
        })
        newUser = await this.userRepo.save(newUser)
        const payload: JWTPayloadType = { id: newUser.id, userType: newUser.userType };
        const accessToken = await this.generateJWT(payload);

        return { user: newUser, accessToken }
    }

    public async login(loginDto: LoginDto): Promise<AuthReturnType> {
        const { email, password } = loginDto
        const user = await this.userRepo.findOne({ where: { email } })
        if (!user) {
            throw new BadRequestException('user is not exist')
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('invalid email or pasword ')
        }
        const payload: JWTPayloadType = { id: user.id, userType: user.userType };
        const accessToken = await this.generateJWT(payload);

        return { user: user, accessToken }
    }
    public async getCurrentUser(id: number) {
        const user = await this.userRepo.findOne({ where: { id } })
        if (!user) throw new NotFoundException('user not found')
        return user;
    }
    public logout() {

    }

    private async generateJWT(payload: JWTPayloadType) {
        return await this.jwtService.signAsync(payload)
    }
}
