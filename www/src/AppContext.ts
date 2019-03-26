import React from 'react';

const AppContext = React.createContext<object>({});

export const AppProvider = AppContext.Provider;
export const AppConsumer = AppContext.Consumer;

export default AppContext;
