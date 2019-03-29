import { playerTag } from './playerTag';
import { User } from '../entity/User';
import * as MockApi from '../crApi';
import { Player } from '../entity/Player';

jest.mock('../crApi', () => ({
  getPlayer: jest.fn().mockResolvedValueOnce({
    tag: 'asd',
    name: 'lion',
  }),
}));

describe('Mutation - playerTag', () => {
  it('returns undefined when no userid in session', async () => {
    const req = {
      session: {},
    };
    const result = await playerTag({}, { tag: 'asd' }, { req });
    expect(result.message).toBe('No user. Please login');
    //expect(result).toBe();
  });
  it('returns undefined when invalid cr tag', async () => {
    const req = {
      session: {
        userId: 'userId',
      },
    };
    User.findOne = jest.fn().mockResolvedValueOnce(undefined);
    const result = await playerTag({}, { tag: 'asd' }, { req });
    expect(result.message).toBe('Cant find user');
    expect(User.findOne).toBeCalledTimes(1);
    expect(User.findOne).toBeCalledWith('userId');
  });
  it('returns player with valid cr tag', async () => {
    const req = {
      session: {
        userId: 'userId',
      },
    };
    const saveSpy = jest.fn().mockResolvedValueOnce({});
    User.findOne = jest.fn().mockResolvedValueOnce({
      id: 'userId',
      email: 'john@doe.com',
    });
    Player.create = jest.fn().mockReturnValueOnce({
      save: saveSpy,
      id: 'id',
      name: 'lion',
      tag: 'asd',
    });
    const result = await playerTag({}, { tag: 'asd' }, { req });
    expect(User.findOne).toBeCalledTimes(1);
    expect(User.findOne).toBeCalledWith('userId');
    expect(MockApi.getPlayer).toBeCalledTimes(1);
    expect(MockApi.getPlayer).toBeCalledWith('asd');
    expect(Player.create).toBeCalledTimes(1);
    expect(saveSpy).toBeCalledTimes(1);
    expect(result!.tag).toBe('asd');
    expect(result!.name).toBe('lion');
  });
});
