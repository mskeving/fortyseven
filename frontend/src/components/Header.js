import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { withRouter } from 'react-router-dom';
import { getAuth, logOut } from 'lib/auth';
import styled from 'styled-components';

const Container = styled.div`
  background-color: #432C51;
  height: 50px;
  box-shadow: 0 1px 1px #aaaaaa;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  color: #ffffff;
`;
const Link = styled.a`
  margin: 0 30px;
  padding: 5px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  border-bottom: 2px solid transparent;
  &:hover {
    border-bottom: 2px solid #fff;
  }
`;
const Arrow = styled.span`
  margin-left: 5px;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #fff;
`;
const Menu = styled.div`
  position: absolute;
  top: 51px;
  right: 20px;
  z-index: 10000;
`;
const Dropdown = styled.ul`
  border: 1px solid #d5dce0;
  border-top: none;
  border-radius: 0 0 3px 3px;
  box-shadow: 0 5px 10px 0 rgba(0,0,0,0.1);
  background-color: #fff;
  min-width: 250px;
  color: #000;
`;
const MenuItem = styled.li`
  padding: 20px 30px;
  cursor: pointer;
  &:hover {
    background-color: #eee;
  }
`;

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
      <Menu innerRef="headerMenu">
        <Dropdown>
          <MenuItem onClick={this.logOut}>Sign out</MenuItem>
        </Dropdown>
      </Menu>
    );
  }

  render() {
	const { email } = getAuth();
    return (
      <Container>
        <Link onClick={() => this.toggleMenu()} innerRef="headerLink">
          {email.split('@')[0]}
          <Arrow />
        </Link>
        {this.renderMenu()}
      </Container>
    );
  }
}

export default withRouter(Header);
