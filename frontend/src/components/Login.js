import React, { Component } from 'react';

class Login extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { ready: false };
  }

  componentWillReceiveProps({ isScriptLoadSucceed }) {
    if (isScriptLoadSucceed) {
      initializeAuthLib();
    }
  }

  render() {
    return (
      <div className="Login">
        <div className="Button" onClick={authorizeUser}>
          Login
        </div>
      </div>
    );
  }
}

export default AuthScriptLoader(Login);
