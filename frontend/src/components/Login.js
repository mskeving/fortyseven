import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { authorizeUser, initializeAuthLib, AuthScriptLoader } from 'lib/auth';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #432C51;
`;
const LoginBox = styled.div`
  background-color: #ffffff;
  width: 400px;
  border-radius: 5px;
  box-shadow: 1px 1px 2px #666666;
  padding: 50px;
  display: flex;
  flex-direction: column;
`;
const Button = styled.div`
  padding: 10px 20px;
  background-color: #FA5B75;
  border-radius: 5px;
  text-align: center;
  color: #ffffff;
  cursor: pointer;
  opacity: 0.85;
  &:hover {
    opacity: 1;
  }
`;

class Login extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { ready: false };
  }

  async componentWillReceiveProps({ isScriptLoadSucceed }) {
    if (isScriptLoadSucceed) {
      await initializeAuthLib();
      this.setState({ ready: true })
    }
  }

  login = async () => {
    const { history } = this.props;
    await authorizeUser();
    history.push('/');
  }

  render() {
    return (
      <Container>
        <LoginBox>
          <Button onClick={this.login}>
            Login
          </Button>
        </LoginBox>
      </Container>
    );
  }
}

export default withRouter(AuthScriptLoader(Login));
