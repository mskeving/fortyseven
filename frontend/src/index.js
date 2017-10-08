import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import store, { history } from 'store';
import { isLoggedIn } from 'lib/auth';
import App from 'components/App';
import Login from 'components/Login';
import NotFound from 'components/NotFound';
import registerServiceWorker from 'registerServiceWorker';

import 'styles/reset.css';

const AuthenticatedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      isLoggedIn() ?
        (<Component {...props} />) :
        (<Redirect to={{ pathname: '/login', state: { from: props.location }}} />)
    )}
  />
);

const PublicRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      isLoggedIn() ?
        (<Redirect to={{ pathname: '/', state: { from: props.location }}} />) :
        (<Component {...props} />)
    )}
  />
);

window.__reactRoot = document.getElementById('root');

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <PublicRoute path="/login" component={Login} />
        <AuthenticatedRoute exact path="/" component={App} />
        <Route component={NotFound} />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  window.__reactRoot
);

registerServiceWorker();
