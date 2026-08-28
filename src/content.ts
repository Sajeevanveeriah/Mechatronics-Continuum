export interface Lesson {
  id: string;
  title: string;
  domain: string;
  duration: number;
  summary: string;
  objectives: string[];
  prerequisites: string[];
  concept: string;
  equation: string;
  example: string;
  practice: string;
  check: {
    prompt: string;
    options: string[];
    answer: number;
    explanation: string;
  };
  interview: string;
}

const lessonData: Array<
  Omit<Lesson, "objectives" | "prerequisites"> & {
    objectives?: string[];
    prerequisites?: string[];
  }
> = [
  {
    id: "engineering-units",
    title: "Engineering units and dimensions",
    domain: "Foundation",
    duration: 25,
    summary:
      "Use SI units as an error-checking system, not merely as labels attached to numbers.",
    concept:
      "A quantity needs a value and a unit. Dimensional checks expose impossible equations before they become hardware mistakes.",
    equation: "P = E / t",
    example: "3.6 kJ used in 2.0 min is 3600 J / 120 s = 30 W.",
    practice: "Convert 2.4 mA to amperes and 0.75 MJ to joules.",
    check: {
      prompt: "Which value equals 4.7 kΩ?",
      options: ["47 Ω", "470 Ω", "4,700 Ω", "47,000 Ω"],
      answer: 2,
      explanation: "kilo means 10³, so 4.7 kΩ = 4,700 Ω.",
    },
    interview:
      "How can dimensional analysis catch an engineering mistake before testing hardware?",
  },
  {
    id: "engineering-notation",
    title: "Engineering notation and estimation",
    domain: "Foundation",
    duration: 25,
    summary:
      "Move confidently between powers of ten, prefixes and order-of-magnitude estimates.",
    concept:
      "Engineering notation uses exponents divisible by three. Estimate the expected scale before detailed calculation.",
    equation: "2.2 × 10⁻⁶ F = 2.2 µF",
    example: "0.000047 A = 47 × 10⁻⁶ A = 47 µA.",
    practice: "Express 6,800,000 Hz using an engineering prefix.",
    check: {
      prompt: "What is 0.0033 V?",
      options: ["3.3 µV", "3.3 mV", "33 mV", "330 mV"],
      answer: 1,
      explanation: "0.0033 V = 3.3 × 10⁻³ V = 3.3 mV.",
    },
    interview: "Why should an estimate come before a detailed calculation?",
  },
  {
    id: "algebra-for-engineers",
    title: "Algebra for engineers",
    domain: "Mathematics",
    duration: 35,
    summary:
      "Rearrange engineering equations while preserving signs, units and physical meaning.",
    concept:
      "Apply the same valid operation to both sides. Rearrange symbolically, then substitute numbers with units.",
    equation: "P = V I  ⇒  I = P / V",
    example: "A 48 W load at 24 V draws I = 48 / 24 = 2.0 A.",
    practice:
      "Rearrange τ = F r to find r, then calculate r for 18 N·m and 60 N.",
    check: {
      prompt: "Rearrange v = u + at to find a.",
      options: ["(v − u) / t", "v − ut", "t / (v − u)", "(v + u) / t"],
      answer: 0,
      explanation: "Subtract u, then divide by t.",
    },
    interview: "How do you prevent sign and transcription errors?",
  },
  {
    id: "graphs-and-rate",
    title: "Graphs, slope and rate of change",
    domain: "Mathematics",
    duration: 35,
    summary:
      "Read axes, slope, intercepts and valid operating regions in engineering graphs.",
    concept:
      "Slope is change in the vertical quantity divided by change in the horizontal quantity. Its units carry physical meaning.",
    equation: "m = Δy / Δx",
    example: "Velocity rising from 2 m/s to 8 m/s in 3 s has slope 2 m/s².",
    practice:
      "Find the resistance of an I-V line passing through 12 V and 0.050 A.",
    check: {
      prompt: "Slope units on a velocity-time graph?",
      options: ["m", "s", "m/s", "m/s²"],
      answer: 3,
      explanation: "Change in velocity divided by time gives m/s².",
    },
    interview: "What is the risk of extrapolating beyond measured data?",
  },
  {
    id: "voltage-current-resistance",
    title: "Voltage, current and resistance",
    domain: "Electrical fundamentals",
    duration: 35,
    summary: "Build a physical model of potential, charge flow and opposition.",
    concept:
      "Voltage is energy per charge. Current is charge flow rate. Resistance relates voltage and current for an ohmic component.",
    equation: "V = E / Q,  I = Q / t",
    example: "Transferring 18 J to 3 C gives 6 V.",
    practice: "Calculate charge when 0.40 A flows for 15 s.",
    check: {
      prompt: "One ampere equals:",
      options: ["1 J/C", "1 C/s", "1 W/s", "1 V/Ω²"],
      answer: 1,
      explanation: "Current is charge flow rate, so 1 A = 1 C/s.",
    },
    interview: "Explain voltage and current without a water analogy.",
  },
  {
    id: "ohms-law",
    title: "Ohm’s law and circuit reasoning",
    domain: "Electrical fundamentals",
    duration: 35,
    summary:
      "Solve for voltage, current and resistance and recognise the model’s limits.",
    concept:
      "For an ohmic component at approximately constant temperature, current is proportional to voltage and inversely proportional to resistance.",
    equation: "V = I R",
    example: "12 V across 240 Ω gives 0.050 A and 0.60 W.",
    practice: "Choose a resistor for approximately 10 mA from 12 V.",
    check: {
      prompt: "330 Ω across 9 V: what current flows?",
      options: ["0.018 A", "0.027 A", "0.030 A", "0.036 A"],
      answer: 1,
      explanation: "I = 9 / 330 = 0.0273 A.",
    },
    interview:
      "How would you distinguish an open circuit from a short circuit safely?",
  },
  {
    id: "series-circuits",
    title: "Series circuits",
    domain: "Electrical fundamentals",
    duration: 35,
    summary:
      "Reason about a single current path, voltage division and equivalent resistance.",
    concept:
      "The same current flows through every series component. Voltage drops sum to the source voltage.",
    equation: "Rₜ = R₁ + R₂ + …",
    example: "1 kΩ and 2 kΩ across 12 V draw 4 mA, with drops of 4 V and 8 V.",
    practice: "Analyse 220 Ω and 330 Ω in series across 5.5 V.",
    check: {
      prompt: "100 Ω, 220 Ω and 330 Ω in series total:",
      options: ["73.3 Ω", "330 Ω", "550 Ω", "650 Ω"],
      answer: 3,
      explanation: "Series resistances add to 650 Ω.",
    },
    interview: "Why does opening one series component stop current everywhere?",
  },
  {
    id: "parallel-circuits",
    title: "Parallel circuits",
    domain: "Electrical fundamentals",
    duration: 40,
    summary:
      "Reason about shared voltage, current division and equivalent resistance.",
    concept:
      "Branches across the same nodes share voltage. Source current is the sum of branch currents.",
    equation: "1/Rₜ = 1/R₁ + 1/R₂ + …",
    example: "Two 200 Ω resistors in parallel give 100 Ω.",
    practice: "Find total current for 1 kΩ and 2 kΩ branches across 12 V.",
    check: {
      prompt: "Two identical resistors in parallel equal:",
      options: ["2R", "R", "R/2", "0"],
      answer: 2,
      explanation: "Two identical resistors in parallel give R/2.",
    },
    interview: "Why does adding a parallel branch reduce total resistance?",
  },
  {
    id: "kirchhoffs-laws",
    title: "Kirchhoff’s laws",
    domain: "Electrical fundamentals",
    duration: 45,
    summary:
      "Use conservation of charge and energy to analyse circuit networks.",
    concept:
      "Current entering a node equals current leaving. Voltage rises and drops around a closed loop sum to zero.",
    equation: "ΣI = 0,  ΣV = 0",
    example:
      "0.80 A entering, with 0.25 A and 0.35 A leaving, leaves 0.20 A for the third branch.",
    practice: "Write a loop equation for 12 V with 100 Ω and 220 Ω in series.",
    check: {
      prompt: "2.0 A enters; 0.7 A leaves one branch. Other branch?",
      options: ["0.7 A", "1.0 A", "1.3 A", "2.7 A"],
      answer: 2,
      explanation: "2.0 = 0.7 + 1.3 A.",
    },
    interview: "Relate Kirchhoff’s laws to conservation principles.",
  },
  {
    id: "electrical-power",
    title: "Electrical power and energy",
    domain: "Electrical fundamentals",
    duration: 35,
    summary: "Calculate power, energy use and component ratings with margin.",
    concept:
      "Power is energy per time. Ratings require thermal and reliability margin beyond the calculated dissipation.",
    equation: "P = V I = I²R = V²/R",
    example: "24 V at 0.50 A is 12 W; over 3 h that is 36 Wh.",
    practice: "Find dissipation of 470 Ω carrying 20 mA.",
    check: {
      prompt: "10 Ω carrying 2 A dissipates:",
      options: ["5 W", "20 W", "40 W", "80 W"],
      answer: 2,
      explanation: "P = I²R = 4 × 10 = 40 W.",
    },
    interview: "Why avoid continuous operation at an absolute maximum rating?",
  },
  {
    id: "measurement-and-multimeters",
    title: "Measurement and multimeters",
    domain: "Practical engineering",
    duration: 40,
    summary:
      "Measure voltage, current and resistance safely and interpret uncertainty.",
    concept:
      "Voltmeters connect in parallel and have high resistance. Ammeters connect in series and have low resistance.",
    equation: "measured value = reading ± uncertainty",
    example:
      "Record range, resolution, accuracy and conditions with every critical measurement.",
    practice:
      "Describe the safe sequence for measuring current in a low-voltage load.",
    check: {
      prompt: "A voltmeter connects:",
      options: [
        "In series",
        "In parallel",
        "Across the current fuse",
        "Only unpowered",
      ],
      answer: 1,
      explanation: "It measures potential difference between two nodes.",
    },
    interview: "What is the most dangerous common current-measurement mistake?",
  },
  {
    id: "foundation-challenge",
    title: "Foundation integration challenge",
    domain: "Assessment",
    duration: 60,
    summary:
      "Combine calculations, measurement planning and communication in one evidence task.",
    concept:
      "Design a two-branch 12 V indicator circuit. Submit a labelled circuit, SI calculations, checks, measurement plan and spoken explanation.",
    equation: "Iₜ = ΣIbranch,  Psource = V Iₜ",
    example:
      "Evidence is complete only when calculations, checks and explanation agree.",
    practice:
      "Complete the design and record any mistake category that required repair.",
    check: {
      prompt: "Best evidence of mastery?",
      options: [
        "Reading",
        "Copying",
        "Solving, checking and explaining",
        "Memorising names",
      ],
      answer: 2,
      explanation: "Mastery requires demonstrated application and explanation.",
    },
    interview:
      "Present one decision, assumption, safety consideration and trade-off.",
  },
];

export const lessons: Lesson[] = lessonData.map((item, index) => ({
  ...item,
  objectives: item.objectives ?? [
    "Explain the core model",
    "Apply it with SI units",
    "Check and communicate the result",
  ],
  prerequisites:
    item.prerequisites ??
    (index ? [lessonData[index - 1].title] : ["Arithmetic"]),
}));
export const lesson = lessons.find((item) => item.id === "ohms-law")!;
export const lessonById = new Map(lessons.map((item) => [item.id, item]));
