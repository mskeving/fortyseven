import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from './components/App';
import Links from './components/Links';
import NotFound from './components/NotFound';

const Routes = (props) => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/links" component={Links} />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
