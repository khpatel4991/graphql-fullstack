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
import { Form, FormGroup, Label, Input, Container } from 'reactstrap';

import { AppProvider } from './AppContext';

const cache = new Map();
const requestData = (url: string, mapFunc: Function, key: string) => {
  const start = performance.now();
  const xhr = new XMLHttpRequest();
  if (cache.has(key)) {
    return from(
      Promise.resolve([
        key,
        cache.get(key).player,
        performance.now() - start,
        true,
      ])
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
    map(data => [key, data, performance.now() - start, false]),
    tap(([_, data]) => cache.set(key, data))
  );
};

const API_URL = 'http://localhost:8082/api/player';
const mapPosts = (response: any) => {
  const parsed = JSON.parse(response);
  return of(parsed ? parsed : null);
};

export const CachedTypeAhead = ({ dataUpdater = (_: any) => {} }) => {
  const [changeHandler, [player, data, time, cached]] = useEventCallback(
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
        ),
        tap(dataUpdater)
      ),
    ['', { player: null, loading: false, error: '' }, -1, false],
    []
  );
  return (
    <AppProvider value={data}>
      <Container>
        <Form>
          <FormGroup>
            <Label for="q">Tag: </Label>
            <Input
              type="text"
              name="q"
              id="q"
              onChange={changeHandler}
              placeholder="#ABCDEF"
            />
          </FormGroup>
        </Form>
      </Container>
    </AppProvider>
  );
};
