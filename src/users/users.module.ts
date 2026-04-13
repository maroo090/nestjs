/* eslint-disable prettier/prettier */
import { BadRequestException, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthProvider } from './auth.provider';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request } from 'express';
import { MailModule } from 'src/mail/mail.module';

/**
 * Users module that handles user authentication and management
 * Provides JWT-based authentication, user CRUD operations, and role-based authorization
 */
@Module({
  controllers: [UsersController],
  providers: [UsersService, AuthProvider],
  exports: [UsersService],
  imports: [
    MailModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          global: true,
          secret: config.get<string>('JWT_SECRET') ?? '',
          signOptions: { expiresIn: '1d' },
        };
      },
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './images/uploads/users',
        filename: (req: Request, file: Express.Multer.File, cb) => {
          const prefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const safeName = file.originalname.replace(/[{}]/g, '');
          const filename = `${prefix}-${safeName}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req: Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void
      ) => {
        if (file.mimetype.includes('image')) {
          cb(null, true);
        } else {
          cb(new BadRequestException('invalid file type'), false);
        }
      },
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
    })
  ],
})
export class UsersModule { }
