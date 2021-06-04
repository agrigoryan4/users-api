const { getUserPassword } = require('../../../services/users');
const { User } = require('../../../models').sequelize.models;

const ModelMock = require('../../../utils/mocks/ModelMock');
jest.mock('../../../models');

describe('users.getUserPassword', () => {
  beforeEach(() => jest.clearAllMocks());

  const userData = {
    id: '7908eedb-c31b-4efd-b8ca-9eda4f00246b',
    username: 'someRandomUser',
    password: '$2b$12$WyncMFhhkNTpefno5oC6WucviyHIARWVpZWbZRYQ/26yODtTk7mW2',
    createdAt: '2021-06-02T07:05:18.766Z',
    updatedAt: '2021-06-02T07:05:18.766Z'
  };
  const findOneMockReturnValue = new ModelMock({
    password: '$2b$12$WyncMFhhkNTpefno5oC6WucviyHIARWVpZWbZRYQ/26yODtTk7mW2',
  });
  const expectedOutput = '$2b$12$WyncMFhhkNTpefno5oC6WucviyHIARWVpZWbZRYQ/26yODtTk7mW2';

  test('should return user password when id is given as a first argument', async () => {
    expect.assertions(2);
    // mocking findOne
    User.findOne.mockReturnValue(findOneMockReturnValue);
    
    const data = await getUserPassword(userData.id);
    expect(data).toEqual(expectedOutput);
    expect(User.findOne).toBeCalledTimes(1);
  });

  test('should return user password when given username as a second argument', async () => {
    expect.assertions(2);
    // mocking findOne
    User.findOne.mockReturnValue(findOneMockReturnValue);
    
    const data = await getUserPassword(null, userData.username);
    expect(data).toEqual(expectedOutput);
    expect(User.findOne).toBeCalledTimes(1);
  });

  test('should return null when no arguments are specified', async () => {
    expect.assertions(1);

    const data = await getUserPassword(null, undefined);
    expect(data).toBe(null);
  });

  test('should return null when no user is found', async () => {
    expect.assertions(2);
    // mocking findOne
    User.findOne.mockReturnValue({ });

    const data = await getUserPassword('fasgg13g1');
    expect(data).toBe(null);
    expect(User.findOne).toBeCalledTimes(1);
  });

});
