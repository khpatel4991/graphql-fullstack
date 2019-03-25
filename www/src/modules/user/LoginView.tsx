import * as React from "react";
import { useMutation } from "react-apollo-hooks";
import { gql } from "apollo-boost";

const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
    }
  }
`;

export const LoginView = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const handleEmailChange = (e: any) => setEmail(e.target.value);
  const handlePasswordChange = (e: any) => setPassword(e.target.value);
  const mutate = useMutation(LOGIN_USER, {
    variables: { email, password }
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
        <button>Login</button>
      </div>
    </form>
  );
};
