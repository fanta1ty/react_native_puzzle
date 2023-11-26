import React from "react";
import {
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  UIManager,
} from "react-native";
import { getRandomImage } from "./utils/api";
import { createPuzzle } from "./utils/puzzle";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import Start from "./screens/Start";
import Game from "./screens/Game";

const BACKGROUND_COLORS = ["#1B1D34", "#2A2A38"];

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
export default class App extends React.Component {
  state = {
    size: 3,
    puzzle: null,
    image: null,
  };

  componentDidMount() {
    this.preloadNextImage();
  }

  async preloadNextImage() {
    const image = await getRandomImage();

    Image.prefetch(image.uri);

    this.setState({
      image,
    });
  }

  handleChangeSize = (size) => {
    this.setState({ size });
  };

  handleStartGame = () => {
    const { size } = this.state;
    this.setState({ puzzle: createPuzzle(size) });
  };

  handleGameChange = (puzzle) => {
    this.setState({ puzzle });
  };

  handleQuit = () => {
    this.setState({ puzzle: null, image: null });

    this.preloadNextImage();
  };

  render() {
    const { size, puzzle, image } = this.state;

    return (
      <LinearGradient style={styles.background} colors={BACKGROUND_COLORS}>
        <StatusBar barStyle={"light-content"} />
        <SafeAreaView style={styles.container}>
          {!puzzle && (
            <Start
              onChangeSize={this.handleChangeSize}
              onStartGame={this.handleStartGame}
              size={size}
            />
          )}
          {puzzle && (
            <Game
              image={image}
              onQuit={this.handleQuit}
              onChange={this.handleGameChange}
              puzzle={puzzle}
            />
          )}
        </SafeAreaView>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginTop:
      Platform.OS === "android" || parseInt(Platform.Version, 10) < 11
        ? Constants.statusBarHeight
        : 0,
  },
});
