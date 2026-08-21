import { Test } from '@nestjs/testing';
import { UsersService } from './user.service';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthProvider } from './auth.provider';

describe('user service', () => {
  let userService: UsersService;
  let userRepo: Repository<User>;
  const REPOSITORY_TOKEN = getRepositoryToken(User);

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: REPOSITORY_TOKEN, useValue: {} },
        UsersService,
        { provide: JwtService, useValue: {} },
        { provide: Repository, useValue: {} },
        { provide: MailService, useValue: {} },
        { provide: ConfigService, useValue: {} },
        { provide: AuthProvider, useValue: {} },
      ],
    }).compile();
    userService = module.get<UsersService>(UsersService);
    userRepo = module.get<Repository<User>>(Repository);
  });
  it('should user service be defined', () => {
    expect(userService).toBeDefined();
  });
});
