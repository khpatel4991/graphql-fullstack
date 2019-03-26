import * as React from 'react';
import { useQuery } from 'react-apollo-hooks';
import { gql } from 'apollo-boost';
import { CachedTypeAhead } from '../../CachedTypeAhead';
import { Alert } from 'reactstrap';

const ME = gql`
  {
    me {
      id
      email
      playerTag
    }
  }
`;

export const PlayerView = () => {
  const { data, error, loading } = useQuery(ME);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <Alert color="danger">Error! {error.message}</Alert>;
  }

  if (data.me === null) {
    data.me = { email: 'john@doe.com' };
  }
  if (data.me.playerTag) {
    return <p>Lets get your profile from tag: {data.me.playerTag}</p>;
  }
  return (
    <div>
      <h3>Don't know your player tag. Everything after # in game settings</h3>
      <CachedTypeAhead />
      <div>
        <Alert color="success">
          <h4 className="alert-heading">Well done!</h4>
          <p>
            Aww yeah, you successfully read this important alert message. This
            example text is going to run a bit longer so that you can see how
            spacing within an alert works with this kind of content.
          </p>
          <hr />
          <p className="mb-0">
            Whenever you need to, be sure to use margin utilities to keep things
            nice and tidy.
          </p>
        </Alert>
      </div>
    </div>
  );
};
