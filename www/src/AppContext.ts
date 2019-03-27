import React from 'react';

export interface IPlayer {
  player: { name: string; tag: string };
}

export type Action = {
  type: string;
  payload: any;
};

export type State = {
  player: IPlayer | null;
  error: string | null;
  loading: boolean;
};

export const AppContext = React.createContext<
  State | string | number | boolean
>({
  player: null,
  error: '',
  loading: false,
});

export const AppProvider = AppContext.Provider;
export const AppConsumer = AppContext.Consumer;
