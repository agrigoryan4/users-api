const { deleteUserById } = require('../../../services/users');
const { User } = require('../../../models').sequelize.models;
const UserFacingException = require('../../../utils/exceptions/userFacingExceptions/UserFacingException');

jest.mock('../../../models');

describe('users.getDeleteUserById', () => {
  beforeEach(() => jest.clearAllMocks());

  test('it should remove the user given its id', async () => {
    expect.assertions(1);
    // mock destroy
    User.destroy.mockReturnValue(1);

    await deleteUserById('1e549143-f073-4dd2-b5f2-76bf9ff17f39');
    expect(User.destroy).toBeCalled();
  });

  test('it should throw an error when invalid id provided', async () => {
    expect.assertions(2);
    // mock destroy
    User.destroy.mockReturnValue(0);

    try {
      await deleteUserById('aaaa');
    } catch(error) {
      expect(error).toBeInstanceOf(UserFacingException);
    }
    expect(User.destroy).toBeCalled();
  });

});
