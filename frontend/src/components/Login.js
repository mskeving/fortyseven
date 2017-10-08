import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { authorizeUser, initializeAuthLib, AuthScriptLoader } from 'lib/auth';

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
      <div className="Login--container">
        <div className="Login">
          <div className="Button" onClick={this.login}>
            Login
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(AuthScriptLoader(Login));
