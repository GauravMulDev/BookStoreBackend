// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// import { UnauthorizedException } from '@nestjs/common';

// describe('AuthController', () => {
//   let authController: AuthController;
//   let authService: AuthService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [AuthController],
//       providers: [
//         {
//           provide: AuthService,
//           useValue: {
//             validateUser: jest.fn(),
//             login: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     authController = module.get<AuthController>(AuthController);
//     authService = module.get<AuthService>(AuthService);
//   });

//   it('should be defined', () => {
//     expect(authController).toBeDefined();
//   });

//   describe('login', () => {
//     it('should throw UnauthorizedException if credentials are invalid', async () => {
//       authService.validateUser.mockResolvedValueOnce(null);
//       await expect(
//         authController.login({ username: 'test', password: 'wrong' })
//       ).rejects.toThrow(UnauthorizedException);
//     });

//     it('should return a result from authService.login if credentials are valid', async () => {
//       const result = { token: 'someToken' };
//       authService.validateUser.mockResolvedValueOnce({});
//       authService.login.mockResolvedValueOnce(result);
//       expect(await authController.login({ username: 'test', password: 'password' })).toBe(result);
//     });
//   });
// });
