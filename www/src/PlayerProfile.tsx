import * as React from 'react';
import { AppContext, IAppContext } from './AppContext';

export const PlayerProfile = () => {
  const context = React.useContext<IAppContext | string | number | boolean>(
    AppContext
  );
  console.log(context);
  return <div />;
};
