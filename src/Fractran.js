import { asPrimes } from "./utils";
import { Sound } from "./Musicbox";

export class Fraction {
  constructor(numerator, denominator) {
    this.numerator = numerator;
    this.numeratorPrimes = asPrimes(numerator);

    this.denominator = denominator;
    this.denominatorPrimes = asPrimes(denominator);
  }

  // checks if the given number multiplied by this fraction will be a whole number
  divides(state) {
    for (let [factor, exponent] of Object.entries(this.denominatorPrimes)) {
      if (state[factor] == undefined || state[factor] < exponent) {
        return false;
      }
    }

    return true;
  }

  // returns the new state after multiplying by this fraction
  // assumes that it will be a whole number
  multiply(state) {
    for (let [factor, exponent] of Object.entries(this.denominatorPrimes)) {
      state[factor] -= exponent;
    }

    for (let [factor, exponent] of Object.entries(this.numeratorPrimes)) {
      if (state[factor] == undefined) {
        state[factor] = 1;
      } else {
        state[factor] += exponent;
      }
    }

    state = Object.fromEntries(
      Object.entries(state).filter(([_, v]) => v != 0)
    );

    return state;
  }
}

// fractionFromString converts a fraction like "5/11" into a corresponding Fraction object.
function fractionFromString(fraction) {
  let [numerator, denominator] = fraction.split("/").map(parseFloat);
  return new Fraction(numerator, denominator);
}

export class Program {
  constructor(fractions) {
    this.fractions = fractions;
  }
}

// programFromStrings converts an array of fraction strings into a program.
export function programFromStrings(program) {
  return new Program(program.map(fractionFromString));
}

export class FractranMachine {
  constructor(program, state) {
    this.program = program;
    this.state = state;
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  notifyObservers() {
    for (let observer of this.observers) {
      observer.notify(this.state);
    }
  }

  cleanState() {
    this.state = Object.fromEntries(
      Object.entries(this.state).filter(([_, v]) => v != 0)
    );
  }

  run() {
    let obj = this;

    (function loop() {
      setTimeout(() => {
        let hadChange = false;

        obj.cleanState();
        obj.notifyObservers();

        for (let fraction of obj.program.fractions) {
          if (fraction.divides(obj.state)) {
            obj.state = fraction.multiply(obj.state);

            hadChange = true;
            break;
          }
        }

        if (hadChange) {
          loop();
        }
      }, 10);
    })();

    this.notifyObservers();

    return this.state;
  }
}

export class ConsoleObserver {
  notify(state) {
    console.log(state);
  }
}

export class MusicObserver {
  constructor(musicbox) {
    this.musicbox = musicbox;
  }

  notify(state) {
    if (Object.keys(state).length == 0) {
      return;
    }

    this.musicbox.enqueue(state);
  }
}

export class FunctionObserver {
  constructor(func) {
    this.func = func;
  }

  notify(state) {
    this.func(state);
  }
}
