import { playerTag } from './playerTag';
import { User } from '../entity/User';
import * as MockApi from '../crApi';
import { Player } from '../entity/Player';

jest.mock('../crApi', () => ({
  getPlayer: jest
    .fn()
    .mockResolvedValueOnce({
      tag: 'asd',
      name: 'lion',
    })
    .mockResolvedValueOnce({
      tag: 'asd',
      name: 'new-lion',
    }),
}));

describe('Mutation - playerTag', () => {
  afterEach(() => {
    jest.clearAllMocks();
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
  it('returns player with new valid cr tag', async () => {
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
    Player.findOne = jest.fn().mockResolvedValueOnce(undefined);
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
    expect(Player.findOne).toBeCalledTimes(1);
    expect(Player.findOne).toBeCalledWith({ where: { tag: 'asd' } });
    expect(Player.create).toBeCalledTimes(1);
    expect(Player.create).toBeCalledWith({
      tag: 'asd',
      name: 'lion',
    });
    expect(saveSpy).toBeCalledTimes(1);
    expect(result!.tag).toBe('asd');
    expect(result!.name).toBe('lion');
  });
  it('returns player with existing valid cr tag', async () => {
    const req = {
      session: {
        userId: 'userId',
      },
    };
    const reloadSpy = jest.fn().mockResolvedValueOnce({});
    User.findOne = jest.fn().mockResolvedValueOnce({
      id: 'userId',
      email: 'john@doe.com',
    });
    Player.findOne = jest.fn().mockResolvedValueOnce({
      id: 'qwe',
      name: 'lion',
      tag: 'asd',
      reload: reloadSpy,
    });
    Player.update = jest.fn().mockResolvedValueOnce({});
    await playerTag({}, { tag: 'asd' }, { req });
    expect(User.findOne).toBeCalledTimes(1);
    expect(User.findOne).toBeCalledWith('userId');
    expect(MockApi.getPlayer).toBeCalledTimes(1);
    expect(MockApi.getPlayer).toBeCalledWith('asd');
    expect(Player.findOne).toBeCalledTimes(1);
    expect(Player.findOne).toBeCalledWith({ where: { tag: 'asd' } });
    expect(Player.update).toBeCalledTimes(1);
    expect(Player.update).toBeCalledWith('qwe', {
      tag: 'asd',
      name: 'new-lion',
    });
    expect(reloadSpy).toBeCalledTimes(1);
  });
});
