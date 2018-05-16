import React, {Component} from 'react';
import moment from 'moment';
import styled from 'styled-components';
import {Row, Column} from 'components/layout';
import Tooltip from 'components/Tooltip';

const BOX_WIDTH = 10;
const BOX_SPACING = 2;

const PURPLE = {
  'x-light': '#D5C9EB', // 213,201,235
  light: '#C0AEE1', // 192,174,225
  base: '#b39ddb', // 179,157,219
  dark: '#A38FC8', // 163,143,200
  'x-dark': '#625678', // 98,86,120
};

const Week = Column.extend`
  height: ${7 * (BOX_WIDTH + BOX_SPACING)}px;
  width: ${({size}) => Math.ceil(size / 7) * (BOX_WIDTH + BOX_SPACING)}px;
  margin: 0 auto;
  flex-wrap: wrap;
`;
const LabelRow = Row.extend`
  height: ${BOX_WIDTH}px;
  margin-bottom: ${BOX_SPACING + 1}px;
  position: relative;
`;
const LabelColumn = Column.extend`
  margin-top: ${BOX_WIDTH + BOX_SPACING}px;
  position: relative;
  width: 25px;
`;
const Label = styled.div`
  font-size: ${BOX_WIDTH}px;
  height: ${BOX_WIDTH}px;
`;
const MonthLabel = Label.extend`
  position: absolute;
  left: ${({offset}) => offset * (BOX_WIDTH + BOX_SPACING)}px;
`;
const DayLabel = Label.extend`
  position: absolute;
  top: ${({offset}) => offset * (BOX_WIDTH + BOX_SPACING)}px;
`;
const Square = styled.div`
  background-color: ${({color}) => color};
  display: inline-block;
  width: ${BOX_WIDTH}px;
  height: ${BOX_WIDTH}px;
`;

export default class ActivityCalendar extends Component {
  getColor(day, max) {
    if (!day) {
      return '#ffffff';
    }

    if (!day.value) {
      return '#ececec';
    }

    const value = day.value / max;
    if (value < 0.1) {
      return PURPLE['x-light'];
    }
    if (value <= 0.25) {
      return PURPLE['light'];
    }
    if (value <= 0.45) {
      return PURPLE['base'];
    }
    if (value <= 0.7) {
      return PURPLE['dark'];
    }
    return PURPLE['x-dark'];
  }

  renderDay(day, i, max) {
    if (!day) {
      return <Square key={i} color="#ffffff" />;
    }

    const color = this.getColor(day, max);
    const text = `${day.date.format('MMM D, YYYY')}: ${day.value} messages`;
    return (
      <Tooltip key={i} text={text}>
        <Square color={color} />
      </Tooltip>
    );
  }

  renderMonthLabels(data, offsetStart) {
    const monthLabels = data
      .filter(({date}) => date.date() === 1)
      .map(({date}, i) => {
        const key = `month-${i}`;
        const shift = Math.floor(date.diff(offsetStart, 'days') / 7);
        if (shift === 0 || shift >= Math.floor(data.length / 7) - 1) {
          return null;
        }
        return (
          <MonthLabel key={key} offset={shift}>
            {date.format('MMM')}
          </MonthLabel>
        );
      });
    return <LabelRow>{monthLabels}</LabelRow>;
  }

  render() {
    const {start, values} = this.props;
    const offset = moment(start).day();
    const offsetStart = moment(start).subtract(offset, 'days');
    const data = values.map((x, i) => ({
      value: x,
      date: moment(start).add(i, 'days'),
    }));
    const squares = Array(offset)
      .fill(null)
      .concat(data)
      .concat(Array(6 - offset).fill(null));
    const max = Math.max(...values);
    return (
      <Row>
        <LabelColumn>
          <DayLabel offset={1}>Mon</DayLabel>
          <DayLabel offset={3}>Wed</DayLabel>
          <DayLabel offset={5}>Fri</DayLabel>
        </LabelColumn>
        <Column>
          {this.renderMonthLabels(data, offsetStart)}
          <Week spacing={2} size={data.length}>
            {squares.map((x, i) => this.renderDay(x, i, max))}
          </Week>
        </Column>
      </Row>
    );
  }
}
