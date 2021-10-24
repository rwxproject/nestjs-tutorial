import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    // fake service
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('can create instance auth service', async () => {
    expect(service).toBeDefined();
  });

  it('create new user with hashed and salted password', async () => {
    const user = await service.signup('user@email.com', 'user-password');
    expect(user.password).not.toEqual('user-password');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws and error if email in use', async (done) => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
    try {
      await service.signup('user@email.com', 'user-password');
    } catch (err) {
      done();
    }
  });
});
