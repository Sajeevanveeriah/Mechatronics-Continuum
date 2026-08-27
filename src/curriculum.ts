export interface Level {
  id: number;
  title: string;
  subjects: string[];
}
const rows: [string, string][] = [
  [
    "Orientation and diagnostic baseline",
    "SI base and derived units|prefixes and scientific notation|significant figures|dimensional analysis|engineering estimation|rearranging equations|calculator fluency|interpreting graphs|measurement uncertainty|diagnostics for every major discipline|personal weak-area map",
  ],
  [
    "Mathematical foundations",
    "arithmetic, fractions, ratios and percentages|algebra|equations and inequalities|geometry|coordinate systems|trigonometry|vectors|complex numbers and phasors|functions and graphs|logarithms and exponentials|differential calculus|integral calculus|multivariable calculus|ordinary differential equations|linear algebra|matrices|eigenvalues and eigenvectors|probability|statistics|numerical methods|Laplace transforms|Fourier transforms|optimisation",
  ],
  [
    "Engineering science",
    "force, mass, energy, work and power|linear and angular momentum|Newtonian mechanics|rotational mechanics|work-energy methods|oscillation and resonance|waves|electromagnetism foundations|heat transfer|thermodynamics|fluid fundamentals|uncertainty and error propagation|order-of-magnitude checking",
  ],
  [
    "Mechanical engineering",
    "statics|dynamics|free-body diagrams|stress and strain|materials|beams|shafts|torsion|deflection|fatigue and failure|mechanisms|bearings|gears|belts|chains|couplings|vibrations|thermofluids|manufacturing processes|CAD design principles|technical drawings|fits and tolerances|GD&T|design for manufacture and assembly|mechanical fault diagnosis",
  ],
  [
    "Electrical engineering",
    "charge, voltage, current and resistance|Ohm's law|Kirchhoff's laws|series and parallel networks|Thevenin and Norton equivalents|capacitance|inductance|transient response|AC circuits|phasors|resonance|real, reactive and apparent power|single-phase power|three-phase power|transformers|power factor|protection and earthing concepts|DC motors|induction motors|synchronous motors|BLDC motors|generators|motor selection|variable-speed drives|batteries|charging|energy systems|safe low-voltage practical exercises",
  ],
  [
    "Electronics",
    "semiconductor fundamentals|diodes|rectifiers|BJTs|MOSFETs|operational amplifiers|analogue filters|signal conditioning|grounding and shielding|noise|oscillators|Boolean algebra|digital logic|flip-flops|counters|state machines|ADCs|DACs|power electronics|DC-DC conversion|motor drivers|schematic design|PCB layout|EMC|ESD|electronic fault-finding",
  ],
  [
    "Programming and software engineering",
    "computational thinking|Python|C|C++|TypeScript|variables and types|control flow|functions|modularity|data structures|algorithms|object-oriented design|memory|pointers|resource management|error handling|files and data processing|Git|Linux and command-line work|debugging|unit testing|integration testing|system testing|concurrency|asynchronous programming|software architecture|APIs|databases|secure engineering fundamentals",
  ],
  [
    "Embedded and real-time systems",
    "MCU architecture|GPIO|interrupts|timers|PWM|ADC|DAC|DMA|UART|I2C|SPI|CAN|LIN|memory and boot processes|sensor acquisition|actuator control|RTOS concepts|scheduling|race conditions|timing|watchdogs|fault recovery|low-power operation|STM32 pathway|ESP32 pathway|embedded testing|firmware architecture",
  ],
  [
    "Instrumentation, signals and communications",
    "sensors and transducers|calibration|accuracy|precision|repeatability|sampling|aliasing|filtering|frequency-domain analysis|sensor fusion|industrial signal standards|4-20 mA|HART|Modbus RTU|Modbus TCP|CAN|MQTT|OPC UA|LoRaWAN|industrial Ethernet concepts|telemetry|data acquisition|measurement fault diagnosis",
  ],
  [
    "Control systems",
    "physical-system modelling|differential-equation models|transfer functions|block diagrams|first-order response|second-order response|poles and zeros|stability|root locus|frequency response|Bode plots|Nyquist concepts|PID|tuning|anti-windup|feedforward|cascade control|discrete-time control|state-space models|controllability|observability|state estimation|Kalman filtering|system identification|robust-control introduction|model-predictive-control introduction",
  ],
  [
    "Industrial automation",
    "relay logic|PLC architecture|IEC 61131-3 concepts|ladder logic|Structured Text|sequential control|state machines|interlocks|permissives|alarms|fault handling|HMI design|SCADA|historians|VSD integration|servo integration|industrial networks|machine sequencing|process control|commissioning|functional-safety concepts|FMEA|automation cybersecurity",
  ],
  [
    "Robotics",
    "frames|coordinate transformations|homogeneous transformation matrices|forward kinematics|inverse kinematics|Jacobians|robot dynamics|trajectory generation|motion control|manipulators|mobile robot kinematics|odometry|IMU integration|localisation|mapping|SLAM|path planning|obstacle avoidance|computer vision|ROS 2|DDS|Gazebo|Nav2|robot safety|robotic-system debugging",
  ],
  [
    "AI/ML for mechatronics",
    "data preparation|regression|classification|feature engineering|model evaluation|overfitting|data leakage|time-series modelling|anomaly detection|predictive maintenance|computer vision|neural-network fundamentals|edge inference|sensor-data ML|reinforcement-learning foundations|model deployment|monitoring|drift|reproducibility|AI safety and failure analysis",
  ],
  [
    "Systems and professional engineering",
    "requirements engineering|system boundaries|interfaces|architecture|requirements traceability|verification|validation|V-model development|risk assessment|FMEA|FTA|HAZOP concepts|reliability|maintainability|configuration management|engineering change control|technical reports|design reviews|cost and trade-off analysis|ethics|safety|sustainability|technical interview communication",
  ],
  [
    "Integrated capstones",
    "Units and vector engineering calculator|Beam and shaft sizing study|Sensor signal-conditioning circuit|DC motor model and PID controller|Embedded environmental sensor node|Motor-drive and encoder control system|PLC-controlled automated cell|Mobile robot localisation and navigation model|Machine-vision inspection system|Predictive-maintenance pipeline|Complete mechatronic product design",
  ],
];
export const curriculum: Level[] = rows.map(([title, subjects], id) => ({
  id,
  title,
  subjects: subjects.split("|"),
}));
export const completedSubjects = new Set([
  "SI base and derived units",
  "prefixes and scientific notation",
  "significant figures",
  "dimensional analysis",
  "engineering estimation",
  "rearranging equations",
  "interpreting graphs",
  "measurement uncertainty",
  "arithmetic, fractions, ratios and percentages",
  "algebra",
  "equations and inequalities",
  "geometry",
  "trigonometry",
  "vectors",
  "differential calculus",
  "integral calculus",
  "Newtonian mechanics",
  "free-body diagrams",
  "charge, voltage, current and resistance",
  "Ohm's law",
  "Kirchhoff's laws",
  "series and parallel networks",
  "semiconductor fundamentals",
  "diodes",
  "Python",
  "C",
  "C++",
  "sensors and transducers",
  "actuator control",
  "physical-system modelling",
  "first-order response",
  "PID",
]);
export const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
export const prerequisites = (level: number) =>
  level === 0 ? [] : [`Level ${level - 1} core diagnostic`];
