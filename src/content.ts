export const lesson = {
  id: "ohms-law",
  title: "Ohm's law and DC circuit reasoning",
  why: "Voltage, current and resistance connect electrical energy sources to sensors, actuators and embedded hardware.",
  prerequisites: [
    "SI units",
    "algebra",
    "charge, voltage, current and resistance",
  ],
  objectives: [
    "Explain potential difference and current from first principles",
    "Select and rearrange V = IR",
    "Check units and diagnose an open or short circuit",
  ],
  model:
    "Voltage is energy transferred per unit charge. Current is charge flow rate. Resistance relates them for an ohmic component within its operating range.",
  theory:
    "For a component whose resistance is approximately constant, doubling the applied potential difference doubles current. Kirchhoff reasoning then conserves charge at nodes and energy around loops.",
  variables: [
    ["V", "potential difference", "volt (V)"],
    ["I", "current", "ampere (A)"],
    ["R", "resistance", "ohm (ohm)"],
  ],
  equation: "V = I R",
  assumptions: [
    "steady DC",
    "ohmic behaviour",
    "temperature approximately constant",
  ],
  limits:
    "Not valid as a constant-resistance model for diodes, saturated transistors or strongly self-heating loads.",
  example:
    "A 24 V source across 120 ohm gives I = V/R = 0.200 A. Power cross-check: P = VI = 4.80 W.",
  guided: "Find current through 330 ohm at 5.0 V, then verify power rating.",
  independent:
    "Choose a resistor for approximately 10 mA from 12 V and select a sensible standard value.",
  fault:
    "A nominal 24 V load reads 24 V across it but 0 A in series. Diagnose the open path before replacing the supply.",
  recall: [
    "State Ohm's law and define every variable.",
    "What observation suggests the constant-resistance assumption is failing?",
  ],
  interview:
    "Explain how you would distinguish an open circuit from a short circuit safely.",
  aloud:
    "Give a 90-second explanation using energy per charge, charge flow and one limitation.",
  review: [
    "Reconstruct V = IR without notes tomorrow.",
    "Solve an unfamiliar two-resistor problem after one week.",
  ],
  sources: [
    [
      "The Feynman Lectures on Physics, Vol II",
      "Caltech",
      "https://www.feynmanlectures.caltech.edu/II_09.html",
      "2026-08-27",
      "Circuit fundamentals",
    ],
    [
      "All About Circuits, DC textbook",
      "Tony R. Kuphaldt",
      "https://www.allaboutcircuits.com/textbook/direct-current/",
      "2026-08-27",
      "Open educational circuit examples",
    ],
  ],
};
