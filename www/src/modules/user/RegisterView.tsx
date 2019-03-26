import * as React from 'react';
import { useMutation } from 'react-apollo-hooks';
import { gql } from 'apollo-boost';

import './styles.css';

const REGISTER_USER = gql`
  mutation register($email: String!, $password: String!) {
    register(email: $email, password: $password)
  }
`;

export const RegisterView = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const handleEmailChange = (e: any) => setEmail(e.target.value);
  const handlePasswordChange = (e: any) => setPassword(e.target.value);
  const mutate = useMutation(REGISTER_USER, {
    variables: { email, password },
  });
  const handleSubmit = (e: any) => {
    e.preventDefault();
    mutate();
  };
  return (
    <form className="center-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input name="email" value={email} onChange={handleEmailChange} />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          name="password"
          value={password}
          onChange={handlePasswordChange}
          type="password"
        />
      </div>
      <div>
        <button>Register</button>
      </div>
    </form>
  );
};
