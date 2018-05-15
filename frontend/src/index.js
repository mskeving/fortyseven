import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Redirect, Route, Switch} from 'react-router-dom';
import {ConnectedRouter} from 'react-router-redux';
import store, {history} from 'store';
import {isLoggedIn} from 'lib/auth';
import {loadMessageActivity} from 'modules/messages';
import {injectGlobal} from 'styled-components';
import App from 'components/App';
import Login from 'components/Login';
import NotFound from 'components/NotFound';
import registerServiceWorker from 'registerServiceWorker';

injectGlobal`
body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
}

html, body, #root {
  height: 100vh;
}

ul {
  margin: 0;
  padding: 0;
}

li {
  list-style-type: none;
}
`;

const AuthenticatedRoute = ({component: Component, ...rest}) => (
  <Route
    {...rest}
    render={props =>
      isLoggedIn() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{pathname: '/login', state: {from: props.location}}} />
      )
    }
  />
);

const PublicRoute = ({component: Component, ...rest}) => (
  <Route
    {...rest}
    render={props =>
      isLoggedIn() ? (
        <Redirect to={{pathname: '/', state: {from: props.location}}} />
      ) : (
        <Component {...props} />
      )
    }
  />
);

if (isLoggedIn()) {
  store.dispatch(loadMessageActivity());
}

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
  window.__reactRoot,
);

if (module.hot) {
  module.hot.accept('components/App', () => {
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
      window.__reactRoot,
    );
  });
}

registerServiceWorker();
