const { getAllUsers } = require('../../../services/users');
const { User } = require('../../../models').sequelize.models;

const ModelMock = require('../../../utils/mocks/ModelMock');
jest.mock('../../../models');


describe('users.getAllUsers', () => {
  beforeEach(() => jest.clearAllMocks());
  
  test('should return all users without their passwords', async () => {
    expect.assertions(2);
    // mock findAll
    const findAllMockReturnValue = [];
    findAllMockReturnValue.push(new ModelMock({
      id: '7908eedb-c31b-4efd-b8ca-9eda4f00246b',
      username: 'someUser2',
      createdAt: "2021-06-02T07:05:18.766Z",
      updatedAt: "2021-06-02T07:05:18.766Z",
    }));
    findAllMockReturnValue.push(new ModelMock({
      id: '7908eedb-c31b-4efd-b8ca-9eda4f00246b',
      username: 'someUser1',
      createdAt: "2021-06-02T07:05:18.766Z",
      updatedAt: "2021-06-02T07:05:18.766Z",
    }));
    User.findAll.mockReturnValue(findAllMockReturnValue);
    
    const data = await getAllUsers();
    expect(data).toMatchObject(findAllMockReturnValue);
    expect(User.findAll).toHaveBeenCalled();
  });

  test('should return empty array when no users have been found', async () => {
    expect.assertions(2);
    // mock findAll
    User.findAll.mockReturnValue([]);

    const data = await getAllUsers();
    expect(data).toMatchObject([]);
    expect(User.findAll).toHaveBeenCalled();
  });

});
