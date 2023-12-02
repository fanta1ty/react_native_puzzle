import PropTypes from "prop-types";
import React from "react";
import { PanResponder } from "react-native";

export default class Draggable extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    onTouchStart: PropTypes.func,
    onTouchMove: PropTypes.func,
    onTouchEnd: PropTypes.func,
    enabled: PropTypes.bool,
  };

  static defaultProps = {
    onTouchStart: () => {},
    onTouchMove: () => {},
    onTouchEnd: () => {},
    enabled: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      dragging: false,
    };

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder,
      onPanResponderGrant: this.handlePanResponderGrant,
      onPanResponderMove: this.handlePanResponderMove,
      onPanResponderRelease: this.handlePanResponderEnd,
      onPanResponderTerminate: this.handlePanResponderEnd,
    });
  }

  handleStartShouldSetPanResponder = () => {
    const { enabled } = this.props;
    return enabled;
  };

  handlePanResponderGrant = () => {
    const { onTouchStart } = this.props;
    this.setState({ dragging: true });
    onTouchStart();
  };

  handlePanResponderMove = (e, gestureState) => {
    const { onTouchMove } = this.props;

    const offset = {
      top: gestureState.dy,
      left: gestureState.dx,
    };

    onTouchMove(offset);
  };

  handlePanResponderEnd = (e, gestureState) => {
    const { onTouchMove, onTouchEnd } = this.props;

    const offset = {
      top: gestureState.dy,
      left: gestureState.dx,
    };

    this.setState({
      dragging: false,
    });

    onTouchMove(offset);
    onTouchEnd(offset);
  };
  render() {
    const { children } = this.props;
    const { dragging } = this.state;

    return children({
      handlers: this.panResponder.panHandlers,
      dragging,
    });
  }
}
