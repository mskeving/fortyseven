import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {Column} from 'components/layout';
import Header from 'components/Header';
import ActivityCalendar from 'components/ActivityCalendar';

const Container = Column.extend`
  min-height: 100%;
`;
const Page = Column.extend`
  flex: 1;
  margin: 30px;
`;

class App extends Component {
  renderActivity() {
    const {activity} = this.props;

    if (!activity || !Object.keys(activity).length) {
      return null;
    }

    // const start = moment().format('YYYYMMDD');
    const days = [...Array(365).keys()]
      .map(x =>
        moment()
          .subtract(x, 'days')
          .format('YYYYMMDD'),
      )
      .reverse();
    const start = days[0];
    const values = days.map(x => activity[x] || 0);
    return <ActivityCalendar start={start} values={values} />;
  }

  render() {
    return (
      <Container>
        <Header />
        <Page>{this.renderActivity()}</Page>
      </Container>
    );
  }
}

const stateToProps = ({messages}) => ({
  activity: messages.activity,
});
export default connect(stateToProps)(App);
