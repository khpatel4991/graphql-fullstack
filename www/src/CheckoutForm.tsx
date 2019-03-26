import * as React from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import { useMutation } from 'react-apollo-hooks';
import { gql } from 'apollo-boost';

import './index.css';

const STRIPE_CHARGE = gql`
  mutation createSubscription($source: String!) {
    createSubscription(source: $source) {
      id
      email
      stripeId
    }
  }
`;

function CheckoutForm(props: any) {
  const mutate = useMutation(STRIPE_CHARGE);
  const [loading, setLoading] = React.useState(false);
  async function getStripeSource() {
    try {
      const {
        token: { id },
      } = await props.stripe.createToken();
      return id;
    } catch (e) {
      console.log(e.message);
      return null;
    }
  }
  const checkoutHandler = (event: any) => {
    event.preventDefault();
    setLoading(true);
    getStripeSource().then(source => {
      if (source !== null) {
        mutate({
          variables: {
            source,
          },
        });
        console.log(source);
      }
      setLoading(false);
    });
  };
  return (
    <div className="checkout">
      <CardElement />
      <div className="checkout-action">
        <p>Would you like to complete the purchase?</p>
        <button className="button" onClick={checkoutHandler}>
          <span>Yes</span>
        </button>
      </div>
      {loading && <p>Loading...</p>}
      <div id="card-errors" role="alert" />
    </div>
  );
}

export default injectStripe(CheckoutForm);
