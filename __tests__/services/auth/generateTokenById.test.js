const AuthService = require('../../../services/auth');
const jwt = require('jsonwebtoken');

describe('auth.generateTokenById', () => {
  beforeEach(() => jest.clearAllMocks());

  const expectedOutput = '$2y$12$eUZqDarGrfFv7V3ix.MQfeW/Eu112iZXAjzP4ammH4r3RBiUGO3Z2';

  test('should return a token when passing the user id', async () => {
    expect.assertions(2);
    // sign mock
    const signSpy = jest.spyOn(jwt, 'sign');
    signSpy.mockImplementation(() => expectedOutput);

    const data = await AuthService.generateTokenById('7908eedb-c31b-4efd-b8ca-9eda4f00246b');
    expect(data).toBe(expectedOutput);
    expect(signSpy).toBeCalled();
  });

});
