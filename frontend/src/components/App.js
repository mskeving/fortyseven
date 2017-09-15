import React, { Component } from 'react';
import Header from 'components/Header';

import 'styles/App.css';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <div className="App--Main">
          Hi
        </div>
      </div>
    );
  }
}
