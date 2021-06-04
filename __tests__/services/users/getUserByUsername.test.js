const { getUserByUsername } = require('../../../services/users');
const { User } = require('../../../models').sequelize.models;

const ModelMock = require('../../../utils/mocks/ModelMock');
jest.mock('../../../models');

describe('users.getUserByUsername', () => {
  beforeEach(() => jest.clearAllMocks());

  const expectedOutput = new ModelMock({
    id: 'd3253fc8-526d-4549-9150-a6a10e4860fa',
    username: 'someUser',
    createdAt: '2021-05-25T13:39:11.350Z',
    updatedAt: '2021-05-25T13:39:11.350Z',
  });

  test('it should return the user given its username', async () => {
    expect.assertions(2);
    // mock findOne
    User.findOne.mockReturnValue(expectedOutput);

    const data = await getUserByUsername('someUser');
    expect(data).toMatchObject(expectedOutput);
    expect(User.findOne).toBeCalledTimes(1);
  });

  test('it should return null when not getting a valid username', async () => {
    expect.assertions(2);
    // mock findOne
    User.findOne.mockReturnValue(null);

    const data = await getUserByUsername('aggqgqgw1');
    expect(data).toBe(null);
    expect(User.findOne).toBeCalledTimes(1);
  });

});
