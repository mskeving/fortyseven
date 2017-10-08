import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { withRouter } from 'react-router-dom';
import { getAuth, logOut } from 'lib/auth';

class Header extends Component {
  constructor() {
    super();
    this.state = { menuOpen: false };
  }

  componentDidMount() {
    window.__reactRoot.addEventListener('click', (e) => this.onDocumentClick(e));
  }

  componentWillUnmount() {
    window.__reactRoot.removeEventListener('click', (e) => this.onDocumentClick(e));
  }

  onDocumentClick(e) {
    const menu = findDOMNode(this.refs.headerMenu);
    const link = findDOMNode(this.refs.headerLink);

    if (!menu) {
      return;
    }

    if (!menu.contains(e.target) && !link.contains(e.target)) {
      this.closeMenu();
    }
  }

  logOut = () => {
    const { history } = this.props;
    logOut();
    history.push('/login');
  }

  closeMenu() {
    this.setState({ menuOpen: false });
  }

  toggleMenu() {
    this.setState({ menuOpen: !this.state.menuOpen });
  }

  renderMenu() {
    const { menuOpen } = this.state;

    if (!menuOpen) {
      return;
    }

    return (
      <div className="Header--Menu" ref="headerMenu">
        <ul className="Header--Dropdown">
          <li onClick={this.logOut}>Sign out</li>
        </ul>
      </div>
    );
  }

  render() {
	const { email } = getAuth();
    return (
      <div className="Header">
        <a className="Header--Link" onClick={() => this.toggleMenu()} ref="headerLink">
          <span className="Header--Link--text">
            {email.split('@')[0]}
          </span>
          <span className="Header--Link--arrow" />
        </a>
        {this.renderMenu()}
      </div>
    );
  }
}

export default withRouter(Header);
