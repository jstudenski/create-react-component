// place in parent component:
// import %Name% from './%Name%/%Name%';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import './%name%.css';

class %Name% extends Component {
  render() {
    return (
      <div>
        <div className="%name%" onClick={this.props.onIncrementCounter}>%name%</div>
        {this.props.ctr}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state);
  return {
    ctr: state.counter,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onIncrementCounter: () => dispatch({ type: 'INCREMENT' }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(%Name%);