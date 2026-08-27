import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { curriculum, completedSubjects } from "./curriculum";
import { lesson } from "./content";
import {
  exportProgress,
  importProgress,
  load,
  save,
  schedule,
  seed,
} from "./storage";
import type { MistakeType, Progress } from "./types";
import "./style.css";
import "katex/dist/katex.min.css";
import katex from "katex";
import { registerSW } from "virtual:pwa-register";
const screens = [
  "Today",
  "Onboarding",
  "Diagnostics",
  "Curriculum",
  "Domains",
  "Lesson",
  "Simulator lab",
  "Problem workspace",
  "Recall queue",
  "Interview room",
  "Mistake notebook",
  "Reference",
  "Capstones",
  "Mastery",
  "Notes",
  "Data",
  "Settings",
];
const mistakes: MistakeType[] = [
  "concept gap",
  "recall-latency problem",
  "incorrect formula or method selection",
  "algebra or calculus error",
  "unit or dimensional error",
  "sign, direction or coordinate error",
  "assumption or boundary-condition error",
  "implementation or debugging error",
  "communication error",
  "careless transcription",
];
function useHash() {
  const get = () => decodeURIComponent(location.hash.slice(2) || "Today");
  const [x, setX] = useState(get);
  useEffect(() => {
    const h = () => setX(get());
    addEventListener("hashchange", h);
    return () => removeEventListener("hashchange", h);
  }, []);
  return x;
}
export function App() {
  const route = useHash();
  const [p, setP] = useState<Progress>(seed);
  const [menu, setMenu] = useState(false);
  const [update, setUpdate] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  useEffect(() => {
    load().then((stored) => {
      setP(stored);
      setStorageReady(true);
    });
    return registerSW({
      onNeedRefresh() {
        setUpdate(true);
      },
    });
  }, []);
  useEffect(() => setMenu(false), [route]);
  useEffect(() => {
    if (!menu) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    addEventListener("keydown", close);
    return () => removeEventListener("keydown", close);
  }, [menu]);
  useEffect(() => {
    document.documentElement.dataset.theme = p.theme;
    if (storageReady) void save(p);
  }, [p, storageReady]);
  const go = (s: string) => {
    location.hash = "/" + encodeURIComponent(s);
  };
  return (
    <div className="app">
      <header>
        <button
          className="menu"
          aria-expanded={menu}
          aria-controls="nav"
          onClick={() => setMenu(!menu)}
        >
          Menu
        </button>
        <div>
          <strong>Mechatronics-Continuum</strong>
          <span> Saj's engineering workbench</span>
        </div>
      </header>
      <nav id="nav" className={menu ? "open" : ""} aria-label="Primary">
        {screens.map((s) => (
          <a
            href={"#/" + encodeURIComponent(s)}
            aria-current={route === s ? "page" : undefined}
            key={s}
          >
            {s}
          </a>
        ))}
      </nav>
      {menu && (
        <button
          className="scrim"
          aria-label="Close navigation"
          onClick={() => setMenu(false)}
        />
      )}
      <main id="main">
        <p className="identity">
          Robotics, Mechatronics, AI/ML &amp; End-To-End Automation Engineer
        </p>
        <Screen route={route} p={p} setP={setP} go={go} />
      </main>
      {update && (
        <aside className="notice" role="status">
          A safe update is ready.{" "}
          <button onClick={() => location.reload()}>Refresh</button>{" "}
          <button onClick={() => setUpdate(false)}>Later</button>
        </aside>
      )}
    </div>
  );
}
function Screen({
  route,
  p,
  setP,
  go,
}: {
  route: string;
  p: Progress;
  setP: (p: Progress) => void;
  go: (s: string) => void;
}) {
  switch (route) {
    case "Onboarding":
      return (
        <>
          <h1>Onboarding and goals</h1>
          <label>
            Name
            <input
              value={p.name}
              onChange={(e) => setP({ ...p, name: e.target.value })}
            />
          </label>
          <label>
            Learning goal
            <textarea
              value={p.goal}
              onChange={(e) => setP({ ...p, goal: e.target.value })}
            />
          </label>
          <button onClick={() => go("Diagnostics")}>
            Save and begin diagnostic
          </button>
        </>
      );
    case "Diagnostics":
      return <Diagnostic p={p} setP={setP} />;
    case "Curriculum":
    case "Domains":
      return <Curriculum />;
    case "Lesson":
      return <Lesson p={p} setP={setP} />;
    case "Simulator lab":
      return <Simulator />;
    case "Interview room":
      return <Interview />;
    case "Mistake notebook":
      return <Notebook p={p} setP={setP} />;
    case "Reference":
      return <Reference />;
    case "Capstones":
      return <Capstones />;
    case "Mastery":
      return <Mastery p={p} />;
    case "Notes":
      return <Notes p={p} setP={setP} />;
    case "Data":
      return <Data p={p} setP={setP} />;
    case "Settings":
      return <Settings p={p} setP={setP} />;
    case "Recall queue":
      return <Recall p={p} setP={setP} />;
    case "Problem workspace":
      return <Workspace />;
    default:
      return <Today p={p} setP={setP} go={go} />;
  }
}
function Today({
  p,
  setP,
  go,
}: {
  p: Progress;
  setP: (p: Progress) => void;
  go: (s: string) => void;
}) {
  const d = p.session?.duration ?? 25;
  return (
    <>
      <h1>Today's study queue</h1>
      <p>
        Priority: overdue retrieval, prerequisite repair, recurring mistakes,
        pathway work, then exploration.
      </p>
      <div className="queue">
        <button onClick={() => go("Recall queue")}>
          1. Due retrieval - Ohm's law
        </button>
        <button onClick={() => go("Mistake notebook")}>
          2. Weak-area repair - {p.mistakes[0]?.type ?? "diagnostic pending"}
        </button>
        <button onClick={() => go("Lesson")}>
          3. New concept - DC circuit reasoning
        </button>
        <button onClick={() => go("Problem workspace")}>
          4. Applied problem
        </button>
        <button onClick={() => go("Interview room")}>5. Verbal practice</button>
      </div>
      <fieldset>
        <legend>Session duration</legend>
        {[25, 50, 90].map((x) => (
          <button
            className={d === x ? "selected" : ""}
            onClick={() =>
              setP({ ...p, session: { duration: x, paused: false, index: 0 } })
            }
            key={x}
          >
            {x} minutes
          </button>
        ))}
        <label>
          Custom minutes
          <input
            type="number"
            min="10"
            max="180"
            step="5"
            value={d}
            onChange={(e) =>
              setP({
                ...p,
                session: { duration: +e.target.value, paused: false, index: 0 },
              })
            }
          />
        </label>
      </fieldset>
      {p.session && (
        <p>
          <button
            onClick={() =>
              setP({
                ...p,
                session: { ...p.session!, paused: !p.session!.paused },
              })
            }
          >
            {p.session.paused ? "Resume" : "Pause"}
          </button>{" "}
          <button
            onClick={() => {
              const reason = prompt("Reason for skipping?");
              if (reason)
                setP({
                  ...p,
                  session: { ...p.session!, index: p.session!.index + 1 },
                });
            }}
          >
            Skip with reason
          </button>{" "}
          <button
            onClick={() =>
              confirm("Reset this session?") && setP({ ...p, session: null })
            }
          >
            Reset session
          </button>
        </p>
      )}
    </>
  );
}
function Diagnostic({ p, setP }: { p: Progress; setP: (p: Progress) => void }) {
  const [q, setQ] = useState("");
  return (
    <>
      <h1>Diagnostic centre</h1>
      <p>
        Without notes: rearrange V = IR to calculate current for 12 V and 240
        ohm. Include the unit.
      </p>
      <label>
        Your answer
        <input value={q} onChange={(e) => setQ(e.target.value)} />
      </label>
      <button
        onClick={() =>
          setP({
            ...p,
            states: {
              ...p.states,
              "ohms-law": /0\.05\s*A/i.test(q) ? "Practising" : "Needs-repair",
            },
          })
        }
      >
        Check diagnostic
      </button>
      <p role="status">
        State: {p.states["ohms-law"] ?? "Not-started"}. A pass challenges out of
        initial instruction, but later review evidence is still required.
      </p>
    </>
  );
}
function Curriculum() {
  return (
    <>
      <h1>Curriculum dependency map</h1>
      <p>
        Dependencies flow from Level 0 to Level 14. The graph is acyclic; each
        level requires the preceding level's core diagnostic.
      </p>
      {curriculum.map((l) => (
        <details key={l.id} open={l.id < 2}>
          <summary>
            Level {l.id} - {l.title} ({l.subjects.length} subjects)
          </summary>
          <ul>
            {l.subjects.map((s) => (
              <li key={s}>
                <span
                  className={completedSubjects.has(s) ? "ready" : "planned"}
                >
                  {completedSubjects.has(s) ? "Authored" : "Unavailable"}
                </span>{" "}
                {s}
              </li>
            ))}
          </ul>
        </details>
      ))}
    </>
  );
}
function Lesson({ p, setP }: { p: Progress; setP: (p: Progress) => void }) {
  const bookmarked = p.bookmarks.includes(lesson.id);
  return (
    <>
      <h1>{lesson.title}</h1>
      <p className="lede">{lesson.why}</p>
      <button
        onClick={() =>
          setP({
            ...p,
            bookmarks: bookmarked
              ? p.bookmarks.filter((x) => x !== lesson.id)
              : [...p.bookmarks, lesson.id],
          })
        }
      >
        {bookmarked ? "Remove bookmark" : "Bookmark lesson"}
      </button>
      <h2>Prerequisites</h2>
      <ul>
        {lesson.prerequisites.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
      <h2>Objectives</h2>
      <ul>
        {lesson.objectives.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
      <h2>Mental model and theory</h2>
      <p>{lesson.model}</p>
      <p>{lesson.theory}</p>
      <h2>Variables, equation and SI units</h2>
      <div
        className="equation"
        aria-label="V equals I multiplied by R"
        dangerouslySetInnerHTML={{
          __html: katex.renderToString("V=IR", { throwOnError: false }),
        }}
      />
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Meaning</th>
            <th>SI unit</th>
          </tr>
        </thead>
        <tbody>
          {lesson.variables.map((v) => (
            <tr key={v[0]}>
              {v.map((x) => (
                <td key={x}>{x}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Assumptions and domain limits</h2>
      <ul>
        {lesson.assumptions.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
      <p>{lesson.limits}</p>
      <h2>Verified worked example</h2>
      <p>{lesson.example}</p>
      <Simulator />
      <h2>Practice and fault finding</h2>
      <p>
        <b>Guided:</b> {lesson.guided}
      </p>
      <p>
        <b>Independent:</b> {lesson.independent}
      </p>
      <p>
        <b>Fault:</b> {lesson.fault}
      </p>
      <h2>Retrieval and interview</h2>
      <ul>
        {lesson.recall.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
      <p>{lesson.interview}</p>
      <p>
        <b>Explain aloud:</b> {lesson.aloud}
      </p>
      <button
        onClick={() =>
          setP({ ...p, states: { ...p.states, [lesson.id]: "Practising" } })
        }
      >
        Record practice attempt
      </button>
      <p>
        Demonstrated remains locked until later retrieval, unfamiliar solution,
        units, assumptions, fault diagnosis and verbal evidence are recorded.
      </p>
      <h2>Spaced review</h2>
      <ul>
        {lesson.review.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
      <h2>Sources</h2>
      <ul>
        {lesson.sources.map((s) => (
          <li key={s[0]}>
            <a href={s[2]}>{s[0]}</a> - {s[1]}; accessed {s[3]}; supports {s[4]}
            .
          </li>
        ))}
      </ul>
    </>
  );
}
function Simulator() {
  const [v, setV] = useState(24),
    [r, setR] = useState(120);
  const i = v / r,
    p = v * i,
    w = Math.min(560, i * 1200);
  return (
    <section aria-labelledby="sim">
      <h1 id="sim">DC circuit simulator</h1>
      <p>
        Assumes a steady, ohmic load at constant temperature. Domain: 0-48 V and
        1-1000 ohm.
      </p>
      <label>
        Voltage V (0-48 V, step 1)
        <input
          type="range"
          min="0"
          max="48"
          step="1"
          value={v}
          onChange={(e) => setV(+e.target.value)}
        />
        <input
          type="number"
          min="0"
          max="48"
          step="1"
          value={v}
          onChange={(e) => setV(Math.max(0, Math.min(48, +e.target.value)))}
        />
      </label>
      <label>
        Resistance R (1-1000 ohm, step 1)
        <input
          type="range"
          min="1"
          max="1000"
          step="1"
          value={r}
          onChange={(e) => setR(+e.target.value)}
        />
        <input
          type="number"
          min="1"
          max="1000"
          value={r}
          onChange={(e) => setR(Math.max(1, Math.min(1000, +e.target.value)))}
        />
      </label>
      <p className="result" aria-live="polite">
        I = V/R = {v} V / {r} ohm = {i.toFixed(3)} A; P = VI = {p.toFixed(2)} W.
      </p>
      <svg
        viewBox="0 0 600 150"
        role="img"
        aria-labelledby="plot-title plot-desc"
      >
        <title id="plot-title">Current bar</title>
        <desc id="plot-desc">
          Current is {i.toFixed(3)} ampere at {v} volts and {r} ohm.
        </desc>
        <line x1="20" y1="100" x2="580" y2="100" />
        <rect x="20" y="55" width={w} height="45" />
        <text x="20" y="130">
          0 A
        </text>
        <text x="520" y="130">
          0.47 A
        </text>
      </svg>
      <button
        onClick={() => {
          setV(24);
          setR(120);
        }}
      >
        Reset simulator
      </button>
    </section>
  );
}
function Interview() {
  const modes = [
    "30-second definition",
    "90-second explanation",
    "whiteboard derivation",
    "calculation under time pressure",
    "fault diagnosis",
    "design trade-off",
    "what happens if? variation",
    "cross-disciplinary integration",
    "mock technical interview",
    "replay of previous mistakes",
  ];
  const [mode, setMode] = useState(modes[0]),
    [seconds, setSeconds] = useState(30),
    [running, setRunning] = useState(false),
    [attempt, setAttempt] = useState("");
  useEffect(() => {
    if (!running || seconds <= 0) return;
    const t = setTimeout(() => setSeconds((x) => x - 1), 1000);
    return () => clearTimeout(t);
  }, [running, seconds]);
  return (
    <>
      <h1>Interview room</h1>
      <label>
        Mode
        <select
          value={mode}
          onChange={(e) => {
            setMode(e.target.value);
            setSeconds(e.target.value.startsWith("90") ? 90 : 30);
          }}
        >
          {modes.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      <p className="timer" aria-live="polite">
        {seconds} seconds
      </p>
      <button onClick={() => setRunning(!running)}>
        {running ? "Pause" : "Start"}
      </button>{" "}
      <button
        onClick={() => {
          setRunning(false);
          setSeconds(mode.startsWith("90") ? 90 : 30);
        }}
      >
        Reset
      </button>
      <p>
        Prompt: Explain Ohm's law, then diagnose why measured current could be
        lower than predicted.
      </p>
      <label>
        Your outline
        <textarea
          value={attempt}
          onChange={(e) => setAttempt(e.target.value)}
        />
      </label>
      {attempt.trim() ? (
        <details>
          <summary>Reveal answer framework</summary>
          <ol>
            <li>Define the concept.</li>
            <li>State the governing principle or equation.</li>
            <li>Explain variables and assumptions.</li>
            <li>Give an engineering example.</li>
            <li>Identify a limitation or failure mode.</li>
            <li>State how the answer would be verified.</li>
          </ol>
        </details>
      ) : (
        <button onClick={() => setAttempt("[Explicitly skipped]")}>
          Skip and reveal
        </button>
      )}
    </>
  );
}
function Notebook({ p, setP }: { p: Progress; setP: (p: Progress) => void }) {
  const [type, setType] = useState<MistakeType>("concept gap"),
    [note, setNote] = useState("");
  return (
    <>
      <h1>Mistake notebook</h1>
      <p>
        Classify the cause, not merely the wrong answer. The queue targets
        varied repair activities.
      </p>
      <label>
        Classification
        <select
          value={type}
          onChange={(e) => setType(e.target.value as MistakeType)}
        >
          {mistakes.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      <label>
        Observation and repair plan
        <textarea value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
      <button
        onClick={() => {
          if (note.trim()) {
            setP({
              ...p,
              mistakes: [
                ...p.mistakes,
                {
                  id: crypto.randomUUID(),
                  lesson: "ohms-law",
                  type,
                  note,
                  created: new Date().toISOString(),
                },
              ],
            });
            setNote("");
          }
        }}
      >
        Record mistake
      </button>
      {p.mistakes.length ? (
        <ul>
          {p.mistakes.map((m) => (
            <li key={m.id}>
              <b>{m.type}</b>: {m.note}
            </li>
          ))}
        </ul>
      ) : (
        <p>
          No mistakes recorded. This is evidence-neutral, not a claim of
          perfection.
        </p>
      )}
    </>
  );
}
function Recall({ p, setP }: { p: Progress; setP: (p: Progress) => void }) {
  const [shown, setShown] = useState(false);
  return (
    <>
      <h1>Recall queue</h1>
      <p>
        Without notes, state Ohm's law, variables, SI units, assumptions and one
        failure mode.
      </p>
      <button onClick={() => setShown(true)}>
        {shown ? "Answer shown" : "I attempted - reveal"}
      </button>
      {shown && (
        <p>
          V = IR. V is volts, I amperes, R ohms. Constant resistance assumes
          approximately constant temperature and ohmic behaviour.
        </p>
      )}
      {shown && (
        <fieldset>
          <legend>Rate retrieval</legend>
          {(["Again", "Difficult", "Correct", "Easy"] as const).map((r) => (
            <button
              key={r}
              onClick={() => {
                const s = schedule(
                  new Date(),
                  p.reviews.find((x) => x.lesson === "ohms-law")?.interval ?? 1,
                  r,
                  p.mistakes.length,
                );
                setP({
                  ...p,
                  reviews: [
                    ...p.reviews.filter((x) => x.lesson !== "ohms-law"),
                    { lesson: "ohms-law", due: s.due, interval: s.days },
                  ],
                  states: {
                    ...p.states,
                    "ohms-law": r === "Again" ? "Needs-repair" : "Review-due",
                  },
                });
              }}
            >
              {r}
            </button>
          ))}
        </fieldset>
      )}
    </>
  );
}
function Workspace() {
  const [x, setX] = useState("");
  return (
    <>
      <h1>Problem-solving workspace</h1>
      <p>
        A 5.0 V controller output must drive a 20 mA indicator. Calculate
        resistance, state assumptions, select a nearby standard value and
        predict power.
      </p>
      <label>
        Working and units
        <textarea value={x} onChange={(e) => setX(e.target.value)} />
      </label>
      <details>
        <summary>Check method</summary>
        <p>
          R = 5.0 V / 0.020 A = 250 ohm. The LED forward voltage must actually
          be subtracted, so this first result exposes a missing device
          assumption.
        </p>
      </details>
    </>
  );
}
function Reference() {
  return (
    <>
      <h1>Formula, unit and symbol reference</h1>
      <table>
        <thead>
          <tr>
            <th>Relationship</th>
            <th>Symbols</th>
            <th>SI check</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>V = IR</td>
            <td>potential difference, current, resistance</td>
            <td>V = A ohm</td>
          </tr>
          <tr>
            <td>P = VI</td>
            <td>power, voltage, current</td>
            <td>W = V A</td>
          </tr>
          <tr>
            <td>F = ma</td>
            <td>force, mass, acceleration</td>
            <td>N = kg m s^-2</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
function Capstones() {
  const caps = curriculum[14].subjects;
  return (
    <>
      <h1>Capstone workspace</h1>
      <p>All capstones are Planned until Saj supplies verified evidence.</p>
      {caps.map((c) => (
        <details key={c}>
          <summary>Planned - {c}</summary>
          <ul>
            {[
              "Requirements",
              "Assumptions",
              "Interfaces",
              "Equations and SI units",
              "Design decisions",
              "Implementation activities",
              "Failure modes",
              "Acceptance tests",
              "Verification evidence",
              "Technical interview defence questions",
            ].map((x) => (
              <li key={x}>{x}: evidence required</li>
            ))}
          </ul>
        </details>
      ))}
    </>
  );
}
function Mastery({ p }: { p: Progress }) {
  return (
    <>
      <h1>Mastery and weak-area dashboard</h1>
      <p>
        Measured state is separate from confidence. No state changes because a
        page was read.
      </p>
      <table>
        <thead>
          <tr>
            <th>Lesson</th>
            <th>Measured state</th>
            <th>Evidence</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ohm's law</td>
            <td>{p.states["ohms-law"] ?? "Not-started"}</td>
            <td>
              {p.reviews.length} scheduled review(s), {p.mistakes.length}{" "}
              recorded mistake(s)
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
function Notes({ p, setP }: { p: Progress; setP: (p: Progress) => void }) {
  return (
    <>
      <h1>Notes and bookmarks</h1>
      <label>
        Ohm's law note
        <textarea
          value={p.notes["ohms-law"] ?? ""}
          onChange={(e) =>
            setP({ ...p, notes: { ...p.notes, "ohms-law": e.target.value } })
          }
        />
      </label>
      <p>Bookmarks: {p.bookmarks.length ? p.bookmarks.join(", ") : "none"}</p>
    </>
  );
}
function Data({ p, setP }: { p: Progress; setP: (p: Progress) => void }) {
  const [raw, setRaw] = useState("");
  const [preview, setPreview] = useState<Progress | null>(null);
  const [error, setError] = useState("");
  function download() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([exportProgress(p)], { type: "application/json" }),
    );
    a.download = "Mechatronics-Continuum-progress.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }
  function validate() {
    try {
      setPreview(importProgress(raw));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid import");
    }
  }
  return (
    <>
      <h1>Progress export and import</h1>
      <p>
        Progress stays in IndexedDB on this device. Browsers may clear local
        data; export a backup periodically. No analytics or telemetry is used.
      </p>
      <button onClick={download}>Export complete JSON backup</button>
      <label>
        Paste backup JSON
        <textarea value={raw} onChange={(e) => setRaw(e.target.value)} />
      </label>
      <button onClick={validate}>Validate and preview</button>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {preview && (
        <section>
          <h2>Import preview</h2>
          <p>
            Learner: {preview.name}; notes: {Object.keys(preview.notes).length};
            mistakes: {preview.mistakes.length}
          </p>
          <button
            onClick={() =>
              setP({
                ...p,
                notes: { ...p.notes, ...preview.notes },
                bookmarks: [...new Set([...p.bookmarks, ...preview.bookmarks])],
              })
            }
          >
            Merge
          </button>{" "}
          <button
            onClick={() =>
              confirm(
                "Replace all local progress with this validated backup?",
              ) && setP(preview)
            }
          >
            Replace
          </button>
        </section>
      )}
    </>
  );
}
function Settings({ p, setP }: { p: Progress; setP: (p: Progress) => void }) {
  return (
    <>
      <h1>Settings and accessibility</h1>
      <fieldset>
        <legend>Colour theme</legend>
        {(["system", "light", "dark"] as const).map((t) => (
          <label key={t}>
            <input
              type="radio"
              checked={p.theme === t}
              onChange={() => setP({ ...p, theme: t })}
            />
            {t}
          </label>
        ))}
      </fieldset>
      <p>
        Motion is reduced automatically when requested by the operating system.
        Controls remain keyboard operable and status is never conveyed by colour
        alone.
      </p>
      <button
        className="danger"
        onClick={() =>
          confirm("Reset all local learning data? Export first if needed.") &&
          setP(seed)
        }
      >
        Reset local data
      </button>
    </>
  );
}
const root = document.getElementById("root");
if (root)
  createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
