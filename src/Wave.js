import React from "react";
import Sketch from "react-p5";
import * as Tone from "tone";
import { synth } from "./App";
// import "p5/lib/addons/p5.sound";

export class Wave extends React.Component {
  y = 0;
  direction = "^";
  mySound;
  waveform;

  preload = (p5) => {
    // p5.soundFormats("mp3", "ogg");
    // this.mySound = p5.loadSound(
    // "https://freesound.org/data/previews/612/612610_5674468-lq"
    // );
  };

  setup = (p5, parentRef) => {
    const cnv = p5
      .createCanvas(p5.windowWidth, p5.windowHeight)
      .parent(parentRef);
    // cnv.mousePressed(() => {
    // this.mySound.play();
    // });
    p5.background(220);
    // p5.text("tap here to play", 10, 20);
    this.waveform = new Tone.Waveform();
    synth.connect(this.waveform);
  };

  draw = (p5) => {
    // var wave = fft.waveform();
    let wave = this.waveform.getValue();

    // console.log(wave);

    p5.background(0);
    p5.stroke(255, 255, 255);
    p5.strokeWeight(2);
    p5.beginShape();
    p5.noFill();

    for (var i = 0; i < p5.width; i += 0.1) {
      var index = p5.floor(p5.map(i, 0, p5.width, 0, wave.length));
      var x = i;
      var y = wave[index] * 150 + p5.height / 2;

      p5.vertex(x, y);
    }
    p5.endShape();
  };

  render() {
    return (
      <Sketch preload={this.preload} setup={this.setup} draw={this.draw} />
    );
  }
}
