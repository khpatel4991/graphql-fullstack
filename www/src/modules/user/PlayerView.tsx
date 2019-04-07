import * as React from 'react';
import { useQuery } from 'react-apollo-hooks';
import { gql } from 'apollo-boost';
import { CachedTypeAhead } from '../../CachedTypeAhead';
import { Alert } from 'reactstrap';

import './styles.css';

export const PlayerView = () => {
  const q = gql`
    {
      Player(tag: "#GR2YL92L") {
        tag
        name
        trophies
      }
    }
  `;
  const { data, error, loading } = useQuery(q);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <Alert color="danger">Error! {error.message}</Alert>;
  }

  if (!data.Player) {
    data.Player = {
      tag: 'unknown',
      name: 'Guest',
      trophies: 'Anything you wish',
    };
  }
  return (
    <div className="player-view-container">
      <h2>Let's add your Clash Royale Player Tag: ${data.Player.tag}</h2>
      <CachedTypeAhead />
    </div>
  );
};
