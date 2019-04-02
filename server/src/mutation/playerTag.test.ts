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
  it('returns player with new valid cr tag', async () => {
    const req = {
      session: {
        userId: 'userId',
      },
    };
    const saveSpy = jest.fn().mockResolvedValueOnce({});
    Player.findOne = jest.fn().mockResolvedValueOnce(undefined);
    Player.create = jest.fn().mockReturnValueOnce({
      save: saveSpy,
      id: 'id',
      name: 'lion',
      tag: 'asd',
    });
    const result = await playerTag({}, { tag: 'asd' }, { req });
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
    Player.findOne = jest.fn().mockResolvedValueOnce({
      id: 'qwe',
      name: 'lion',
      tag: 'asd',
      reload: reloadSpy,
    });
    Player.update = jest.fn().mockResolvedValueOnce({});
    await playerTag({}, { tag: 'asd' }, { req });
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
