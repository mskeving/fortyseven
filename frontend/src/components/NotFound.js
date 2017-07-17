import React, { Component } from 'react';
import cx from 'classnames';

class NotFound extends Component {
  render() {
    const { className } = this.props;
    return (
      <div className={cx('NotFound', className)}>
        404 <span className="desc">Not Found</span>
      </div>
    );
  }
}

export default NotFound;
