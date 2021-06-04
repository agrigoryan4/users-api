const { createUser } = require('../../../services/users');
const { User } = require('../../../models').sequelize.models;
const bcrypt = require('bcrypt');

jest.mock('../../../models');

describe('users.createUser', () => {
  beforeEach(() => jest.clearAllMocks());

  test('should return the new user when provided both username and password', async () => {
    expect.assertions(8);
    // mocking bcrypt
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    hashSpy.mockImplementation(() => '$2b$12$WyncMFhhkNTpefno5oC6WucviyHIARWVpZWbZRYQ/26yODtTk7mW2');
    // mocking User.build()
    const buildMockReturnValue = {
      dataValues: {
        id: '7908eedb-c31b-4efd-b8ca-9eda4f00246b',
        username: 'someRandomUser',
        password: '$2b$12$WyncMFhhkNTpefno5oC6WucviyHIARWVpZWbZRYQ/26yODtTk7mW2',
        createdAt: "2021-06-02T07:05:18.766Z",
        updatedAt: "2021-06-02T07:05:18.766Z",
      },
      save: jest.fn().mockReturnValue(true),
    };
    User.build.mockReturnValue(buildMockReturnValue);
    // mocking User.findOne()
    const findOneMockReturnValue = {
      id: '7908eedb-c31b-4efd-b8ca-9eda4f00246b',
      username: 'someRandomUser',
      createdAt: "2021-06-02T07:05:18.766Z",
      updatedAt: "2021-06-02T07:05:18.766Z",
    };
    User.findOne.mockReturnValue(findOneMockReturnValue);
    // input and output
    const input = ['someRandomUser', 'someRandomPassword'];
    const output = {
      username: 'someRandomUser',
    };

    const data = await createUser(...input);
    expect(data).toMatchObject(output);
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('createdAt');
    expect(data).toHaveProperty('updatedAt');
    expect(hashSpy).toHaveBeenCalledWith('someRandomPassword', 12);
    expect(User.build).toHaveBeenCalled();
    expect(buildMockReturnValue.save).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalled();
  });

});
