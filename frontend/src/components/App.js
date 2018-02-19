import React, { Component } from 'react';
import { Column } from 'components/layout';
import Header from 'components/Header';
import ActivityCalendar from 'components/ActivityCalendar';

const Container = Column.extend`
  min-height: 100%;
`;
const Page = Column.extend`
  flex: 1;
  margin: 30px;
`;

export default class App extends Component {
  render() {
	const values = Array(365).fill(0).map(() => Math.floor(Math.random() * 17));
    return (
      <Container>
        <Header />
        <Page>
          <ActivityCalendar start="20180131" values={values} />
        </Page>
      </Container>
    );
  }
}
