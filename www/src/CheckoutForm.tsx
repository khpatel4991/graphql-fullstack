import * as React from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import { useMutation } from 'react-apollo-hooks';
import { gql } from 'apollo-boost';

const STRIPE_CHARGE = gql`
  mutation stripeCharge($token: String!) {
    stripeCharge(token: $token)
  }
`;

function CheckoutForm(props: any) {
  const mutate = useMutation(STRIPE_CHARGE);
  const [loading, setLoading] = React.useState(false);
  async function getStripeToken() {
    const {
      token: { id },
    } = await props.stripe.createToken();
    return id;
  }
  const checkoutHandler = (event: any) => {
    event.preventDefault();
    setLoading(true);
    getStripeToken().then(id => {
      mutate({
        variables: {
          token: id,
        },
      });
      setLoading(false);
    });
  };
  return (
    <div className="checkout">
      <p>Would you like to complete the purchase?</p>
      <CardElement />
      {loading && <p>Loading...</p>}
      <button onClick={checkoutHandler}>Send</button>
    </div>
  );
}

export default injectStripe(CheckoutForm);
