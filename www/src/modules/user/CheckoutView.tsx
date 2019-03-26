import * as React from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';

import './styles.css';

import CheckoutForm from '../../CheckoutForm';

export const CheckoutView = () => {
  return (
    <StripeProvider apiKey={'pk_test_YZfIuHeEzfG78v6hnaLMN5WY00aghrRg5i'}>
      <div className="center-form">
        <Elements>
          <CheckoutForm />
        </Elements>
      </div>
    </StripeProvider>
  );
};
