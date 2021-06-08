const AuthService = require('../../../services/auth');
const UsersService = require('../../../services/users');
const bcrypt = require('bcrypt');
const {
  UnauthorizedException,
} = require('../../../utils/exceptions/userFacingExceptions');

const ModelMock = require('../../../utils/mocks/ModelMock');

describe('auth.authenticate', () => {
  beforeEach(() => jest.clearAllMocks());

  const mockUser = new ModelMock({
    id: '7908eedb-c31b-4efd-b8ca-9eda4f00246b',
    username: 'someRandomUser',
    createdAt: '2021-06-02T07:05:18.766Z',
    updatedAt: '2021-06-02T07:05:18.766Z',
  });
  test('should return the user when passing correct username and password', async () => {
    expect.assertions(1);
    // mocking getUserByUsername
    const getUserByUsernameSpy = jest.spyOn(UsersService, 'getUserByUsername');
    getUserByUsernameSpy.mockImplementation(() => {
      return mockUser;
    });
    // mocking getUserPassword
    const getUserPasswordSpy = jest.spyOn(UsersService, 'getUserPassword');
    getUserPasswordSpy.mockImplementation(() => {
      return '$2y$12$eUZqDarGrfFv7V3ix.MQfeW/Eu112iZXAjzP4ammH4r3RBiUGO3Z2';
    });
    // mocking bcrypt
    const compareSpy = jest.spyOn(bcrypt, 'compare');
    compareSpy.mockImplementation(() => true);

    const data = await AuthService.authenticate({
      username: 'someRandomUser',
      password: 'someRandomPassword',
    });
    expect(data).toMatchObject(mockUser);
  });

  test('should throw an error, when not getting a valid username', async () => {
    expect.assertions(2);
    // mocking getUserByUsername
    const getUserByUsernameSpy = jest.spyOn(UsersService, 'getUserByUsername');
    getUserByUsernameSpy.mockImplementation(() => {
      return null;
    });

    try {
      await AuthService.authenticate({
        username: 'wrongUsername',
        password: 'rightPassword',
      });
    } catch(error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
    expect(getUserByUsernameSpy).toBeCalledWith('wrongUsername');
  });

  test('should throw an error, when not getting a correct password', async () => {
    expect.assertions(1);
    // mocking getUserByUsername
    const getUserByUsernameSpy = jest.spyOn(UsersService, 'getUserByUsername');
    getUserByUsernameSpy.mockImplementation(() => {
      return mockUser;
    });
    // mocking getUserPassword
    const getUserPasswordSpy = jest.spyOn(UsersService, 'getUserPassword');
    getUserPasswordSpy.mockImplementation(() => {
      return '$2y$12$eUZqDarGrfFv7V3ix.MQfeW/Eu112iZXAjzP4ammH4r3RBiUGO3Z2';
    });
    // mocking bcrypt
    const compareSpy = jest.spyOn(bcrypt, 'compare');
    compareSpy.mockImplementation(() => false);

    try {
      await AuthService.authenticate({
        username: 'rightUsername',
        password: 'wrongPassword',
      });
    } catch(error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
  });

});
