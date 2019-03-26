import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { LoginView } from './modules/user/LoginView';
import { RegisterView } from './modules/user/RegisterView';
import { MeView } from './modules/user/MeView';
import { CheckoutView } from './modules/user/CheckoutView';
import { PlayerView } from './modules/user/PlayerView';

export const Routes = () => {
  return (
    <BrowserRouter>
      <div className="view">
        <div className="centeredStuff">
          <Switch>
            <Route path="/login" component={LoginView} />
            <Route path="/register" component={RegisterView} />
            <Route path="/me" component={MeView} />
            <Route path="/checkout" component={CheckoutView} />
            <Route path="/player" component={PlayerView} />
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
};
