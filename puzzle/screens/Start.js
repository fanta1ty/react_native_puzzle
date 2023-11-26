import { StyleSheet } from "react-native";
import PropTypes from "prop-types";
import React from "react";

const State = {
  Launching: "Launching",
  WillTransitionIn: "WillTransitionIn",
  WillTransitionOut: "WillTransitionOut",
};

const BOARD_SIZES = [3, 4, 5, 6];

export default class Start extends React.Component {
  static propTypes = {
    onChangeSize: PropTypes.func.isRequired,
    onStartGame: PropTypes.func.isRequired,
    size: PropTypes.number.isRequired,
  };

  state = {
    transitionState: State.Launching,
  };

  render() {
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 20,
  },
  logo: {
    alignSelf: "stretch",
    paddingHorizontal: 40,
  },
});
