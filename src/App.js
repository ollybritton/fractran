import "./App.css";
import * as Tone from "tone";
import { Musicbox } from "./Musicbox";
import {
  ConsoleObserver,
  FractranMachine,
  FunctionObserver,
  MusicObserver,
  programFromStrings,
} from "./Fractran";
import React from "react";
import { convertHarmonics } from "./Music";
import { Wave } from "./Wave";

export const synth = new Tone.PolySynth().toDestination();
const musicbox = new Musicbox(synth, convertHarmonics);

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      text: "Click to toggle",
    };

    this.updateText.bind(this);
  }

  updateText(state) {
    this.setState({ text: JSON.stringify(state) });
  }

  handleClick() {
    if (this.state.playing) {
      this.pause();
    } else {
      this.play();
    }
  }

  pause() {
    musicbox.pause();
    this.setState({ playing: false });
  }

  play() {
    Tone.start();
    this.setState({ playing: true });

    musicbox.play();

    let fractions = programFromStrings([
      "17/91",
      "78/85",
      "19/51",
      "23/38",
      "29/33",
      "77/29",
      "95/23",
      "77/19",
      "1/17",
      "11/13",
      "13/11",
      "15/14",
      "15/2",
      "55/1",
    ]);

    window.fractran = new FractranMachine(fractions, { 2: 1 });
    window.fractran.addObserver(new MusicObserver(musicbox));

    musicbox.addObserver(
      new FunctionObserver((e) => {
        this.updateText(e.state);
      })
    );

    window.fractran.run();
  }

  render() {
    return (
      <div className="App" onClick={() => this.handleClick()}>
        <div id="#state">
          <h1 class="state">{this.state.text}</h1>
        </div>
        <Wave />
      </div>
    );
  }
}

export default App;
