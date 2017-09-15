import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { authorizeUser, initializeAuthLib, AuthScriptLoader } from 'lib/auth';

class Login extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { ready: false };
  }

  componentWillReceiveProps({ isScriptLoadSucceed }) {
    if (isScriptLoadSucceed) {
      initializeAuthLib().then(
        () => this.setState({ ready: true })
      );
    }
  }

  login = () => {
    const { history } = this.props;
    authorizeUser().then(
      () => history.push('/')
    );
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
