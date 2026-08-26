import { Test } from '@nestjs/testing';
import { UsersService } from './user.service';
import { Auth, Repository } from 'typeorm';
import { User } from './users.entity';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthProvider } from './auth.provider';
import { RegisterDto } from './dtos/register.dto';
import { config } from 'process';

type GetUserByIdParams = {
  where?: { id: number };
};
const registerDto: RegisterDto = {
  email: 'test@gmail.com',
  username: 'test',
  password: 'test',
};
describe('user service', () => {
  let authProvider: AuthProvider;
  let userRepo: Repository<User>;
  let mailService: MailService;
  let configService: ConfigService;
  const REPOSITORY_TOKEN = getRepositoryToken(User);

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: REPOSITORY_TOKEN,
          useValue: {
            findOne: jest.fn((param: { where: { id?: number } }) => {
              if (param?.where?.id)
                return Promise.resolve(
                  userList.find((p) => p.id === param.where?.id),
                );
              // simulate no existing user
              return Promise.resolve(undefined);
            }),
            create: jest.fn((dto: RegisterDto) => {
              return dto;
            }),
            save: jest.fn((user) => Promise.resolve({ ...user, id: 999 })),
          },
        },
        AuthProvider,
        { provide: JwtService, useValue: {} },
        { provide: Repository, useValue: {} },
        {
          provide: MailService,
          useValue: {
            sendVerifyEmailTemplate: jest.fn(),
            sendLoginEmail: jest.fn(),
            sendResetPasswordTemplate: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'DOMAIN') return 'http://localhost:3000';
              return 'test';
            }),
          },
        },
      ],
    }).compile();
    authProvider = module.get<AuthProvider>(AuthProvider);
    userRepo = module.get<Repository<User>>(REPOSITORY_TOKEN);
    mailService = module.get<MailService>(MailService);
    configService = module.get<ConfigService>(ConfigService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should user service be defined', () => {
    expect(authProvider).toBeDefined();
  });

  describe('register()', () => {
    it('should call "findOne" method in users repository', async () => {
      await authProvider.register({
        email: 'newuser@gmail.com',
        username: 'newuser',
        password: 'test',
      });
      expect(userRepo.findOne).toHaveBeenCalled();
      expect(userRepo.findOne).toHaveBeenCalledTimes(1);
    });
    it('should call "create" method in users repository', async () => {
      await authProvider.register({
        email: 'newuser@gmail.com',
        username: 'newuser',
        password: 'test',
      });
      expect(userRepo.create).toHaveBeenCalled();
      expect(userRepo.create).toHaveBeenCalledTimes(1);
    });

    it('should call "save" method in users repository', async () => {
      await authProvider.register({
        email: 'newuser@gmail.com',
        username: 'newuser',
        password: 'test',
      });
      expect(userRepo.save).toHaveBeenCalled();
      expect(userRepo.save).toHaveBeenCalledTimes(1);
    });
    it('should call ""sendVerifyEmailTemplate" method in mail service', async () => {
      await authProvider.register(registerDto);
      expect(mailService.sendVerifyEmailTemplate).toHaveBeenCalled();
      expect(mailService.sendVerifyEmailTemplate).toHaveBeenCalledTimes(1);
    });
    it("should call 'get' method in config service", async () => {
      await authProvider.register(registerDto);
      expect(configService.get).toHaveBeenCalled();
      expect(configService.get).toHaveBeenCalledTimes(1);
    });
  });
});
