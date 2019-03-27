import React from 'react';

export interface IPlayer {
  player: { name: string; tag: string };
}
export interface IAppContext {
  player: IPlayer | null;
  error: string;
  loading: boolean;
}

export const AppContext = React.createContext<
  IAppContext | string | number | boolean
>({
  player: null,
  error: '',
  loading: false,
});

export const AppProvider = AppContext.Provider;
export const AppConsumer = AppContext.Consumer;
