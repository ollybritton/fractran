import * as Tone from "tone";

export class Sound {
  constructor(pitches, duration) {
    this.pitches = pitches;
    this.duration = duration;
  }
}

export class Musicbox {
  constructor(synth, converter) {
    this.synth = synth;
    this.converter = converter;
    this.observers = [];
    this.queue = [];
    this.pitches = [];

    this.initTransport();
  }

  enqueue(state) {
    this.queue.push(state);
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  initTransport() {
    Tone.Transport.scheduleRepeat((time) => {
      if (this.queue.length == 0) {
        for (let pitch in this.pitches) {
          this.synth.triggerRelease(pitch, time);
        }

        return;
      }

      let state = this.queue.shift();
      state = Object.fromEntries(
        Object.entries(state).filter(([_, v]) => v != 0)
      );

      // TODO: investigate in the above why using an array here means that if e.g. a 2 was included on the last iteration
      // and now it has gone means that it gets replaced by a 0 on the next iteration.

      let sound = this.converter(state);

      for (let observer of this.observers) {
        observer.notify({
          sound: sound,
          state: state,
        });
      }

      Tone.Transport.bpm.value = 30 * sound.duration;

      for (let pitch in this.pitches) {
        if (!Object.keys(sound.pitches).includes(pitch)) {
          this.synth.triggerRelease(pitch, time);
        }
      }

      for (let pitch of Object.keys(sound.pitches)) {
        if (!Object.keys(this.pitches).includes(pitch)) {
          this.synth.triggerAttack(pitch, time);
        }
      }

      this.pitches = sound.pitches;
    }, "8n");
  }

  play() {
    Tone.Transport.start();
  }

  pause() {
    for (let pitch in this.pitches) {
      this.synth.triggerRelease(pitch);
    }

    Tone.Transport.stop();
  }
}
