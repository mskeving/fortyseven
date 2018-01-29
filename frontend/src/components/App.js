import React, { Component } from 'react';
import styled from 'styled-components';
import Header from 'components/Header';

const Container = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;
const Page = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default class App extends Component {
  render() {
    return (
      <Container>
        <Header />
        <Page>
          Hi
        </Page>
      </Container>
    );
  }
}
