import * as React from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';

import './styles.css';

import CheckoutForm from '../../CheckoutForm';

export const CheckoutView = () => {
  return (
    <StripeProvider apiKey={process.env.REACT_APP_STRIPE_KEY!}>
      <Elements>
        <CheckoutForm />
      </Elements>
    </StripeProvider>
  );
};
