import { stripe } from '../stripe';
import { User } from '../entity/User';

export const createSubscription = async (
  _: any,
  { source }: any,
  { req }: any
) => {
  if (!req.session || !req.session.userId) {
    throw new Error('Not Authenticated.');
  }
  console.time(`Assign tag "${source} to ${req.session.userId}"`);
  const user = await User.findOneOrFail(req.session.userId);
  console.timeEnd(`Assign tag "${source} to ${req.session.userId}"`);
  const customer = await stripe.customers.create({
    email: user.email,
    source,
  });
  user.stripeId = customer.id;
  user.type = 'paid';
  await user.save();
  return user;
};
