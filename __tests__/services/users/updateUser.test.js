const { updateUser } = require('../../../services/users');
const { User } = require('../../../models').sequelize.models;
const bcrypt = require('bcrypt');
const UserFacingException = require('../../../utils/exceptions/userFacingExceptions/UserFacingException');

const ModelMock = require('../../../utils/mocks/ModelMock');
jest.mock('../../../models');

describe('users.updateUser', () => {
  beforeEach(() => jest.clearAllMocks());

  const userData = {
    id: '1e549143-f073-4dd2-b5f2-76bf9ff17f39',
  };

  test('it should update the user and return the updated user', async () => {
    expect.assertions(4);
    // expected output
    const MockModel = new ModelMock({
      id: '1e549143-f073-4dd2-b5f2-76bf9ff17f39',
      username: 'newUsername',
      password: '$2y$12$nTSjg7KXNxLrXbzP7rky5u31mEfvK2auzpsRFVg0AFt.tkdXY5exe',
      createdAt: '2021-05-26T09:42:47.788Z',
      updatedAt: '2021-05-26T09:42:47.788Z',
    });
    // mocking bcrypt
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    hashSpy.mockImplementation(() => '$2y$12$nTSjg7KXNxLrXbzP7rky5u31mEfvK2auzpsRFVg0AFt.tkdXY5exe');
    // mock User.update
    User.update.mockReturnValue([1]);
    // mock User.findOne
    User.findOne.mockReturnValue(MockModel);

    const data = await updateUser(userData.id, 'newUsername', 'newPassword');
    expect(data).toMatchObject(MockModel);
    expect(hashSpy).toBeCalled();
    expect(User.update).toBeCalled();
    expect(User.findOne).toBeCalled();
  });

  test('it should throw an error when no valid id passed as an argument', async () => {
    expect.assertions(2);
    // mock User.update
    User.update.mockReturnValue([0]);

    try {
      await updateUser('asgasg', 'newUsername', 'newPassword');
    } catch (error) {
      expect(error).toBeInstanceOf(UserFacingException);
    }
    expect(User.update).toBeCalled();
  });

});
