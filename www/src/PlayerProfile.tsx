import * as React from 'react';
import { AppContext, State } from './AppContext';

export const PlayerProfile = () => {
  const context = React.useContext<State | string | number | boolean>(
    AppContext
  );
  console.log(context);
  return <div />;
};
