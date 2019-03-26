import * as React from 'react';
import { useQuery } from 'react-apollo-hooks';
import { gql } from 'apollo-boost';

const ME = gql`
  {
    me {
      id
      email
    }
  }
`;

export const MeView = () => {
  const { data, error, loading } = useQuery(ME);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error! {error.message}</div>;
  }
  return <p>{JSON.stringify(data)}</p>;
};
