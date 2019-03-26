import * as React from 'react';
import { useEventCallback } from 'rxjs-hooks';
import { of, from } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
  withLatestFrom,
  combineLatest,
} from 'rxjs/operators';

import { AppProvider } from './AppContext';

const cache = new Map();
const requestData = (url: string, mapFunc: Function, key: string) => {
  const start = performance.now();
  const xhr = new XMLHttpRequest();
  if (cache.has(key)) {
    return from(
      Promise.resolve([key, cache.get(key), performance.now() - start, true])
    );
  }
  return from(
    new Promise((resolve, reject) => {
      xhr.addEventListener('load', () => {
        resolve(xhr.response);
      });
      xhr.open('GET', url);
      xhr.send();
    })
  ).pipe(
    switchMap(_ => mapFunc(xhr.response)),
    map(data => [key, data, performance.now() - start], false),
    tap(_ => cache.set(key, _))
  );
};

const API_URL = 'http://localhost:8082/api/player';
const mapPosts = (response: any) => {
  const parsed = JSON.parse(response);
  return of(parsed ? parsed : null);
};

export const CachedTypeAhead = () => {
  const [changeHandler, [player, data, time]] = useEventCallback(
    (event$: any, inputs$: any, state$: any) =>
      event$.pipe(
        map((event: any) => event.target.value),
        combineLatest(inputs$),
        withLatestFrom(state$),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(([[q]]) =>
          requestData(
            `${API_URL}?playerTag=${encodeURIComponent(q)}`,
            mapPosts,
            q
          )
        )
      ),
    ['', {}, -1],
    []
  );
  return (
    <AppProvider value={data}>
      <div className="App">
        <label htmlFor="q">
          Tag:
          <input onChange={changeHandler} name="q" id="q" />
        </label>
        <p>
          {' '}
          <code>Time: {time}ms</code>
          {JSON.stringify(data)}
        </p>
      </div>
    </AppProvider>
  );
};
