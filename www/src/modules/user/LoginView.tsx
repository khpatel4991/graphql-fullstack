import * as React from 'react';
import { useMutation } from 'react-apollo-hooks';
import { gql } from 'apollo-boost';
import Label from 'reactstrap/lib/Label';
import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Input from 'reactstrap/lib/Input';
import Button from 'reactstrap/lib/Button';
import Col from 'reactstrap/lib/Col';
import Alert from 'reactstrap/lib/Alert';
import Row from 'reactstrap/lib/Row';

const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
    }
  }
`;

export const LoginView = () => {
  const [invalid, setInvalid] = React.useState(false);
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
      mutate().then((result: any) => {
        const login = 'data' in result && result.data.login !== null;
        if (login) {
          setInvalid(false);
          return window.location.replace('/player');
        }
        setInvalid(true);
      });
    } catch (e) {
      setInvalid(true);
    }
  };
  return (
    <>
      <Form onSubmit={handleSubmit}>
        {invalid && (
          <Row>
            <Col sm={2} />
            <Col sm={10}>
              <Alert color="danger">
                Incorrect Email/Password, Try again or{' '}
                <a href="#" className="alert-link">
                  Reset Password?
                </a>
              </Alert>
            </Col>
          </Row>
        )}
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
