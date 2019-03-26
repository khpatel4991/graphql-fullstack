import * as React from 'react';
import { useMutation } from 'react-apollo-hooks';
import { gql } from 'apollo-boost';
import Label from 'reactstrap/lib/Label';
import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Input from 'reactstrap/lib/Input';
import Button from 'reactstrap/lib/Button';
import Col from 'reactstrap/lib/Col';

const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
    }
  }
`;

export const LoginView = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const handleEmailChange = (e: any) => setEmail(e.target.value);
  const handlePasswordChange = (e: any) => setPassword(e.target.value);
  const mutate = useMutation(LOGIN_USER, {
    variables: { email, password },
  });
  const handleSubmit = (e: any) => {
    try {
      e.preventDefault();
      mutate();
      window.location.replace('/player');
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <>
      <Form onSubmit={handleSubmit}>
        <FormGroup row>
          <Label for="email" sm={2}>
            Email
          </Label>
          <Col sm={10}>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="john@doe.com"
              value={email}
              onChange={handleEmailChange}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="password" sm={2}>
            Password
          </Label>
          <Col sm={10}>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="secret password"
              value={password}
              onChange={handlePasswordChange}
            />
          </Col>
        </FormGroup>
        <FormGroup check row>
          <Col sm={{ size: 10, offset: 2 }}>
            <Button color="primary">Log In</Button>
          </Col>
        </FormGroup>
      </Form>
    </>
  );
};
