const AuthService = require('../../../services/auth');
const {
  UnauthorizedException,
} = require('../../../utils/exceptions/userFacingExceptions');

const ModelMock = require('../../../utils/mocks/ModelMock');

describe('auth.login', () => {
  beforeEach(() => jest.clearAllMocks());

  const mockUser = new ModelMock({
    id: '7908eedb-c31b-4efd-b8ca-9eda4f00246b',
    username: 'someRandomUser',
    createdAt: '2021-06-02T07:05:18.766Z',
    updatedAt: '2021-06-02T07:05:18.766Z',
  });
  const mockJwtToken = '$2y$12$eUZqDarGrfFv7V3ix.MQfeW/Eu112iZXAjzP4ammH4r3RBiUGO3Z2';

  test('should return the token when passed correct username and password', async () => {
    expect.assertions(3);
    // authenticate mock
    const authenticateSpy = jest.spyOn(AuthService, 'authenticate');
    authenticateSpy.mockImplementation(() => mockUser);
    // generateTokenById mock
    const generateTokenByIdMock = jest.spyOn(AuthService, 'generateTokenById');
    generateTokenByIdMock.mockImplementation((id) => mockJwtToken);

    const data = await AuthService.login({
      username: 'someRandomUser',
      password: 'someRandomPassword',
    });
    expect(data).toBe(mockJwtToken);
    expect(authenticateSpy).toBeCalledWith({
      username: 'someRandomUser',
      password: 'someRandomPassword',
    });
    expect(generateTokenByIdMock).toBeCalledWith('7908eedb-c31b-4efd-b8ca-9eda4f00246b');
  });

  test('should throw, when passed incorrect username or password', async () => {
    expect.assertions(2);
    // authenticate mock
    const authenticateSpy = jest.spyOn(AuthService, 'authenticate');
    authenticateSpy.mockImplementation(() => {
      throw new UnauthorizedException();
    });

    try {
      await AuthService.login({});
    } catch(error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
    expect(authenticateSpy).toBeCalled();
  });

});
