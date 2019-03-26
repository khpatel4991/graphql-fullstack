import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { LoginView } from './modules/user/LoginView';
import { RegisterView } from './modules/user/RegisterView';
import { MeView } from './modules/user/MeView';
import { CheckoutView } from './modules/user/CheckoutView';

export const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={LoginView} />
        <Route path="/register" component={RegisterView} root />
        <Route path="/me" component={MeView} />
        <Route path="/checkout" component={CheckoutView} />
      </Switch>
    </BrowserRouter>
  );
};
