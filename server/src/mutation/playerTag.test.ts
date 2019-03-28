import { playerTag } from './playerTag';
import { User } from '../entity/User';
import * as CrApi from '../crApi';

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
    expect(result).toBeNull();
  });
  it('returns undefined when invalid cr tag', async () => {
    const req = {
      session: {
        userId: 'userId',
      },
    };
    User.findOne = jest.fn().mockResolvedValueOnce(undefined);
    const result = await playerTag({}, { tag: 'asd' }, { req });
    expect(result).toBeNull();
    expect(User.findOne).toBeCalledTimes(1);
    expect(User.findOne).toBeCalledWith('userId');
  });
  it('returns updated user when valid cr tag', async () => {
    const req = {
      session: {
        userId: 'userId',
      },
    };
    const saveSpy = jest.fn();
    User.findOne = jest.fn().mockResolvedValueOnce({
      id: 'userId',
      email: 'john@doe.com',
      save: saveSpy,
    });
    const result = await playerTag({}, { tag: 'asd' }, { req });
    expect(CrApi.getPlayer).toBeCalledTimes(1);
    expect(CrApi.getPlayer).toBeCalledWith('asd');
    expect(User.findOne).toBeCalledTimes(1);
    expect(User.findOne).toBeCalledWith('userId');
    expect(saveSpy).toBeCalledTimes(1);
    expect(result!.id).toBe('userId');
    expect(result!.playerTag).toBe('asd');
  });
});
