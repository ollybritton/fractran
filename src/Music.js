// Convert state into a Sound object.

import { primePosition, sigmoid } from "./utils";
import { Sound } from "./Musicbox";

export function convertHarmonics(state) {
  return new Sound(
    Object.fromEntries(
      Object.entries(state).map((entry) => {
        return [55 * (1 + primePosition(entry[0])), sigmoid(entry[1])];
      })
    ),
    Math.pow(Object.keys(state).length, 1)
  );
}
