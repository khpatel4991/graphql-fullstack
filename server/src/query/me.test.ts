import { me } from './me';
import { User } from '../entity/User';

describe('Me', () => {
  it('returns undefined if no session', async () => {
    const req = {
      session: {},
    };
    const ans = await me({}, {}, { req });
    expect(ans).toBeUndefined();
  });
  it('returns undefined if session userId is invalid', async () => {
    User.findOne = jest.fn().mockResolvedValueOnce(null);
    const req = {
      session: {
        userId: 'hello',
      },
    };
    const ans = await me({}, {}, { req });
    expect(User.findOne).toBeCalledTimes(1);
    expect(User.findOne).toBeCalledWith(req.session.userId);
    expect(ans).toBeUndefined();
  });
  it('returns user when session userId is valid', async () => {
    User.findOne = jest.fn().mockResolvedValueOnce({
      id: 12,
      email: 'john@doe.com',
    });
    const req = {
      session: {
        userId: 'hello',
      },
    };
    const ans = await me({}, {}, { req });
    expect(User.findOne).toBeCalledTimes(1);
    expect(User.findOne).toBeCalledWith(req.session.userId);
    expect(ans.id).toBe(12);
    expect(ans.email).toBe('john@doe.com');
  });
});
