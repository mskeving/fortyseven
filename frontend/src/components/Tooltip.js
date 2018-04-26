import React, { Component } from 'react';
import styled from 'styled-components';
import Arrow from 'components/Arrow';

const Container = styled.div`
  display: inline-flex;
  position: relative;
  flex-direction: row;
`;
const HoverContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  top: 0;
  left: 100%;
  z-index: 1000;
  margin-left: -2px;
`;
const HoverTip = styled.div`
  background-color: #000000;
  border: 1px solid #000000;
  color: #ffffff;
  font-size: 11px;
  opacity: 0.8;
  padding: 2px 5px;
  margin-top: -3px;
  white-space: nowrap;
`;

export default class Tooltip extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
  }

  onMouseOver = () => {
    this.setState({ visible: true });
  }

  onMouseOut = () => {
    this.setState({ visible: false });
  }

  renderTooltip() {
    const { text } = this.props;
    const { visible } = this.state;

    if (!visible) {
      return;
    }

    return (
      <HoverContainer>
        <Arrow direction="left" />
        <HoverTip>{text}</HoverTip>
      </HoverContainer>
    );
  }

  render() {
    const { children } = this.props;
    const target = React.Children.only(children);
    return (
      <Container>
        {React.cloneElement(target, {
          onMouseOver: this.onMouseOver,
          onMouseOut: this.onMouseOut,
        })}
        {this.renderTooltip()}
      </Container>
    );
  }
}
