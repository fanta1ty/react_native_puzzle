import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  View,
} from "react-native";
import PropTypes from "prop-types";
import React from "react";

import { isSolved, movableSquares, move } from "../utils/puzzle";
import PuzzlePropType from "../validators/PuzzlePropType";
import configureTransition from "../utils/configureTransition";
import Preview from "../components/Preview";
import Stats from "../components/Stats";
import Board from "../components/Board";
import Button from "../components/Button";

const State = {
  LoadingImage: "LoadingImage",
  WillTransitionIn: "WillTransitionIn",
  RequestTransitionOut: "RequestTransitionOut",
  WillTransitionOut: "WillTransitionOut",
};

export default class Game extends React.Component {
  static propTypes = {
    puzzle: PuzzlePropType.isRequired,
    image: Image.propTypes.source,
    onChange: PropTypes.func.isRequired,
    onQuit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    image: null,
  };

  constructor(props) {
    super(props);

    const { image } = props;

    this.state = {
      transitionState: image ? State.WillTransitionIn : State.LoadingImage,
      moves: 0,
      elapsed: 0,
      previousMove: null,
      image: null,
    };

    configureTransition();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { image } = nextProps;
    const { transitionState } = this.state;

    if (image && transitionState === State.LoadingImage) {
      configureTransition(() => {
        this.setState({
          transitionState: State.WillTransitionIn,
        });
      });
    }
  }

  handlePressSquare = (square) => {
    const { puzzle, onChange } = this.props;
    const { moves } = this.state;

    if (!movableSquares(puzzle).includes(square)) return;

    const updated = move(puzzle, square);

    this.setState({ moves: moves + 1, previousMove: square });

    onChange(updated);

    if (isSolved(updated)) {
      this.requestTransitionOut();
    }
  };

  handleBoardTransitionIn = () => {
    this.intervalId = setInterval(() => {
      const { elapsed } = this.state;
      this.setState({
        elapsed: elapsed + 1,
      });
    }, 1000);
  };

  requestTransitionOut = () => {
    clearInterval(this.intervalId);
    this.setState({
      transitionState: State.RequestTransitionOut,
    });
  };

  handlePressQuit = () => {
    Alert.alert(
      "Quit",
      "Do you wnat to quit and lose progress on this puzzle?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Quit",
          style: "destructive",
          onPress: this.requestTransitionOut,
        },
      ],
    );
  };

  handleBoardTransitionOut = async () => {
    const { onQuit } = this.props;

    await configureTransition(() => {
      this.setState({
        transitionState: State.WillTransitionOut,
      });
    });

    onQuit();
  };

  render() {
    const {
      puzzle,
      puzzle: { size },
      image,
    } = this.props;

    const { transitionState, moves, elapsed, previousMove } = this.state;

    return (
      transitionState !== State.WillTransitionOut && (
        <View style={styles.container}>
          {transitionState === State.LoadingImage && (
            <ActivityIndicator size={"large"} color={"rgba(255,255,255,0.5)"} />
          )}
          {transitionState !== State.LoadingImage && (
            <View style={styles.centered}>
              <View style={styles.header}>
                <Preview boardSize={size} image={image} />
                <Stats moves={moves} time={elapsed} />
              </View>
              <Board
                image={image}
                previousMove={previousMove}
                onTransitionIn={this.handleBoardTransitionIn}
                onMoveSquare={this.handlePressSquare}
                onTransitionOut={this.handleBoardTransitionOut}
                puzzle={puzzle}
                teardown={transitionState === State.RequestTransitionOut}
              />
              <Button title={"Quit"} onPress={this.handlePressQuit} />
            </View>
          )}
        </View>
      )
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 16,
    alignSelf: "stretch",
  },
});
