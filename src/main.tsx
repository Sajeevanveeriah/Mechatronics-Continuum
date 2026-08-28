import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { lessons, lessonById, type Lesson } from "./content";
import { load, save, seed } from "./storage";
import type { Progress } from "./types";
import { registerSW } from "virtual:pwa-register";
import "./style.css";

type Route = {
  page:
    | "today"
    | "pathway"
    | "lesson"
    | "practice"
    | "progress"
    | "notes"
    | "settings";
  id?: string;
};

function readRoute(): Route {
  const value =
    decodeURIComponent(location.hash.replace(/^#\/?/, "")) || "today";
  const [page, id] = value.split("/");
  if (page === "lesson")
    return { page, id: lessonById.has(id) ? id : lessons[0].id };
  if (
    ["today", "pathway", "practice", "progress", "notes", "settings"].includes(
      page,
    )
  )
    return { page: page as Route["page"] };
  return { page: "today" };
}

function navigate(path: string) {
  location.hash = `#/${path}`;
}

const nav = [
  {
    group: "Learn",
    items: [
      ["today", "Today"],
      ["pathway", "Pathway"],
      ["lesson/engineering-units", "Lessons"],
    ],
  },
  { group: "Practice", items: [["practice", "Recall & problems"]] },
  {
    group: "Track",
    items: [
      ["progress", "Progress"],
      ["notes", "Notes"],
      ["settings", "Settings"],
    ],
  },
];

function AppMark() {
  return (
    <span className="mark" aria-hidden="true">
      MC
    </span>
  );
}

export function App() {
  const [route, setRoute] = useState<Route>(readRoute);
  const [progress, setProgress] = useState<Progress>(seed);
  const [ready, setReady] = useState(false);
  const [menu, setMenu] = useState(false);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const onHash = () => setRoute(readRoute());
    addEventListener("hashchange", onHash);
    load().then((stored) => {
      setProgress(stored);
      setReady(true);
    });
    const unregister = registerSW({ onNeedRefresh: () => setUpdate(true) });
    return () => {
      removeEventListener("hashchange", onHash);
      unregister?.();
    };
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = progress.theme;
    if (ready) void save(progress);
  }, [progress, ready]);
  useEffect(() => setMenu(false), [route]);

  const completed = lessons.filter(
    (item) => progress.states[item.id] === "Demonstrated",
  ).length;
  const activePath =
    route.page === "lesson" ? "lesson/engineering-units" : route.page;

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <header className="mobile-header">
        <a className="brand compact" href="#/today">
          <AppMark />
          <span>
            Mechatronics
            <br />
            Continuum
          </span>
        </a>
        <button
          className="menu-button"
          onClick={() => setMenu(!menu)}
          aria-expanded={menu}
          aria-controls="primary-nav"
        >
          Menu
        </button>
      </header>
      <aside className={`sidebar ${menu ? "open" : ""}`}>
        <a className="brand" href="#/today">
          <AppMark />
          <span>
            Mechatronics
            <br />
            Continuum
          </span>
        </a>
        <nav id="primary-nav" aria-label="Primary">
          {nav.map((section) => (
            <div className="nav-group" key={section.group}>
              <p>{section.group}</p>
              {section.items.map(([path, label]) => (
                <a
                  key={path}
                  href={`#/${path}`}
                  aria-current={activePath === path ? "page" : undefined}
                >
                  {label}
                </a>
              ))}
            </div>
          ))}
        </nav>
        <div className="profile">
          <span className="avatar">S</span>
          <span>
            <strong>{progress.name || "Saj"}</strong>
            <small>
              {completed} of {lessons.length} complete
            </small>
          </span>
        </div>
      </aside>
      {menu && (
        <button
          className="scrim"
          aria-label="Close navigation"
          onClick={() => setMenu(false)}
        />
      )}
      <main id="main">
        <Screen
          route={route}
          progress={progress}
          setProgress={setProgress}
          completed={completed}
        />
      </main>
      {update && (
        <div className="toast" role="status">
          Update ready{" "}
          <button onClick={() => location.reload()}>Refresh</button>
          <button onClick={() => setUpdate(false)}>Later</button>
        </div>
      )}
    </div>
  );
}

function Screen({
  route,
  progress,
  setProgress,
  completed,
}: {
  route: Route;
  progress: Progress;
  setProgress: React.Dispatch<React.SetStateAction<Progress>>;
  completed: number;
}) {
  if (route.page === "pathway") return <Pathway progress={progress} />;
  if (route.page === "lesson")
    return (
      <LessonPage
        lesson={lessonById.get(route.id!)!}
        progress={progress}
        setProgress={setProgress}
      />
    );
  if (route.page === "practice") return <Practice progress={progress} />;
  if (route.page === "progress") return <ProgressPage progress={progress} />;
  if (route.page === "notes")
    return <NotesPage progress={progress} setProgress={setProgress} />;
  if (route.page === "settings")
    return <Settings progress={progress} setProgress={setProgress} />;
  return <Today progress={progress} completed={completed} />;
}

function Today({
  progress,
  completed,
}: {
  progress: Progress;
  completed: number;
}) {
  const next =
    lessons.find((item) => progress.states[item.id] !== "Demonstrated") ??
    lessons.at(-1)!;
  const percentage = Math.round((completed / lessons.length) * 100);
  return (
    <div className="page page-wide">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Your engineering workbench</p>
          <h1>Good to see you, {progress.name || "Saj"}.</h1>
          <p>Build reliable recall one checked lesson at a time.</p>
        </div>
        <span className="date-chip">Foundation pathway</span>
      </div>
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Continue learning</p>
          <h2>{next.title}</h2>
          <p>{next.summary}</p>
          <div className="hero-meta">
            <span>{next.duration} min</span>
            <span>{next.domain}</span>
          </div>
          <button
            className="primary"
            onClick={() => navigate(`lesson/${next.id}`)}
          >
            Continue lesson
          </button>
        </div>
        <div
          className="progress-dial"
          style={
            { "--progress": `${percentage * 3.6}deg` } as React.CSSProperties
          }
        >
          <strong>{percentage}%</strong>
          <span>foundation</span>
        </div>
      </section>
      <div className="dashboard-grid">
        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Learning path</p>
              <h2>Your next lessons</h2>
            </div>
            <a href="#/pathway">View pathway</a>
          </div>
          <ol className="next-list">
            {lessons
              .slice(
                Math.max(0, lessons.indexOf(next)),
                Math.max(0, lessons.indexOf(next)) + 4,
              )
              .map((item, index) => (
                <li key={item.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <a href={`#/lesson/${item.id}`}>{item.title}</a>
                    <small>
                      {item.duration} min · {item.domain}
                    </small>
                  </div>
                </li>
              ))}
          </ol>
        </section>
        <aside className="panel stats">
          <p className="eyebrow">This pathway</p>
          <h2>{completed} lessons complete</h2>
          <progress max={lessons.length} value={completed}>
            {percentage}%
          </progress>
          <dl>
            <div>
              <dt>Available</dt>
              <dd>{lessons.length}</dd>
            </div>
            <div>
              <dt>Remaining</dt>
              <dd>{lessons.length - completed}</dd>
            </div>
            <div>
              <dt>Notes</dt>
              <dd>{Object.values(progress.notes).filter(Boolean).length}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

function Pathway({ progress }: { progress: Progress }) {
  return (
    <div className="page page-wide">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Foundation pathway</p>
          <h1>Build the base. Then integrate.</h1>
          <p>
            Twelve authored lessons move from units and algebra to circuit
            analysis and practical measurement.
          </p>
        </div>
      </div>
      <div className="pathway-list">
        {lessons.map((item, index) => {
          const done = progress.states[item.id] === "Demonstrated";
          return (
            <a
              href={`#/lesson/${item.id}`}
              className="pathway-item"
              key={item.id}
            >
              <span className={done ? "step done" : "step"}>
                {done ? "✓" : index + 1}
              </span>
              <div>
                <small>
                  {item.domain} · {item.duration} min
                </small>
                <h2>{item.title}</h2>
                <p>{item.summary}</p>
              </div>
              <span className="arrow">→</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

function LessonPage({
  lesson,
  progress,
  setProgress,
}: {
  lesson: Lesson;
  progress: Progress;
  setProgress: React.Dispatch<React.SetStateAction<Progress>>;
}) {
  const index = lessons.indexOf(lesson);
  const previous = lessons[index - 1];
  const next = lessons[index + 1];
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const done = progress.states[lesson.id] === "Demonstrated";
  const complete = () => {
    setProgress((current) => ({
      ...current,
      states: { ...current.states, [lesson.id]: "Demonstrated" },
    }));
    if (next) navigate(`lesson/${next.id}`);
    else navigate("progress");
  };
  return (
    <div className="lesson-page">
      <article className="lesson-content">
        <div className="breadcrumbs">
          <a href="#/pathway">Foundation</a>
          <span>/</span>
          <span>{lesson.domain}</span>
          <span>/</span>
          <span>
            Lesson {index + 1} of {lessons.length}
          </span>
        </div>
        <p className="eyebrow">{lesson.domain}</p>
        <h1>{lesson.title}</h1>
        <p className="lead">{lesson.summary}</p>
        <div
          className="lesson-progress"
          aria-label={`Lesson ${index + 1} of ${lessons.length}`}
        >
          <div className="progress-track">
            <span
              style={{ width: `${((index + 1) / lessons.length) * 100}%` }}
            />
          </div>
          <span>{Math.round(((index + 1) / lessons.length) * 100)}%</span>
        </div>
        <section className="objective">
          <strong>Learning objectives</strong>
          <ul>
            {lesson.objectives.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section id="concept">
          <p className="section-number">01 · Core model</p>
          <h2>Understand the relationship</h2>
          <p>{lesson.concept}</p>
          <div className="equation">{lesson.equation}</div>
        </section>
        <section id="example">
          <p className="section-number">02 · Worked example</p>
          <h2>Follow a checked method</h2>
          <div className="callout">
            <strong>Method and unit check</strong>
            <p>{lesson.example}</p>
          </div>
        </section>
        {lesson.id === "ohms-law" && <OhmsLab />}
        <section id="practice">
          <p className="section-number">03 · Deliberate practice</p>
          <h2>Apply it yourself</h2>
          <div className="practice-box">
            <p>{lesson.practice}</p>
            <p>
              <strong>Acceptance check:</strong> show the symbolic equation,
              substitute SI values, state the result with units, then perform a
              magnitude check.
            </p>
          </div>
        </section>
        <section id="check" className="knowledge-check">
          <p className="section-number">04 · Knowledge check</p>
          <h2>Check your understanding</h2>
          <p>{lesson.check.prompt}</p>
          <div className="answers">
            {lesson.check.options.map((option, i) => (
              <label
                key={option}
                className={choice === i ? "selected-answer" : ""}
              >
                <input
                  type="radio"
                  name={`check-${lesson.id}`}
                  checked={choice === i}
                  onChange={() => {
                    setChoice(i);
                    setChecked(false);
                  }}
                />
                <span>{String.fromCharCode(65 + i)}</span>
                {option}
              </label>
            ))}
          </div>
          <button disabled={choice === null} onClick={() => setChecked(true)}>
            Check answer
          </button>
          {checked && (
            <p
              className={
                choice === lesson.check.answer
                  ? "feedback correct"
                  : "feedback incorrect"
              }
              role="status"
            >
              <strong>
                {choice === lesson.check.answer ? "Correct." : "Not yet."}
              </strong>{" "}
              {lesson.check.explanation}
            </p>
          )}
        </section>
        <section id="interview">
          <p className="section-number">05 · Interview recall</p>
          <h2>Explain it aloud</h2>
          <blockquote>{lesson.interview}</blockquote>
          <p>
            Target: a clear 90-second answer with the physical model, one
            equation, units and one limitation.
          </p>
        </section>
      </article>
      <aside className="lesson-rail">
        <div>
          <p className="eyebrow">
            Lesson {index + 1} of {lessons.length}
          </p>
          <strong>{lesson.duration} min</strong>
        </div>
        <hr />
        <h2>In this lesson</h2>
        <a href="#concept">Core model</a>
        <a href="#example">Worked example</a>
        <a href="#practice">Practice</a>
        <a href="#check">Knowledge check</a>
        <a href="#interview">Interview recall</a>
        <hr />
        <h2>Prerequisites</h2>
        {lesson.prerequisites.map((item) => (
          <p className="prerequisite" key={item}>
            ✓ {item}
          </p>
        ))}
        <hr />
        <a href="#/notes">Open lesson notes →</a>
      </aside>
      <nav className="lesson-footer" aria-label="Lesson navigation">
        {previous ? (
          <a className="previous" href={`#/lesson/${previous.id}`}>
            <small>Previous</small>
            {previous.title}
          </a>
        ) : (
          <a className="previous" href="#/pathway">
            <small>Back to</small>All lessons
          </a>
        )}
        <span>
          {index + 1} of {lessons.length}
        </span>
        <button className="primary continue" onClick={complete}>
          {done ? "Continue" : "Complete & continue"}
          <small>{next?.title ?? "View progress"}</small>
        </button>
      </nav>
    </div>
  );
}

function OhmsLab() {
  const [voltage, setVoltage] = useState(12);
  const [resistance, setResistance] = useState(240);
  const current = resistance > 0 ? voltage / resistance : 0;
  return (
    <section id="lab">
      <p className="section-number">Interactive lab</p>
      <h2>Test the relationship</h2>
      <div className="lab">
        <div className="lab-controls">
          <label>
            Voltage V (V)
            <input
              type="number"
              min="0"
              max="48"
              step="0.5"
              value={voltage}
              onChange={(e) => setVoltage(Number(e.target.value))}
            />
          </label>
          <label>
            Resistance R (Ω)
            <input
              type="number"
              min="1"
              max="2000"
              step="1"
              value={resistance}
              onChange={(e) => setResistance(Number(e.target.value))}
            />
          </label>
          <div className="result">
            <span>Current</span>
            <strong>{current.toFixed(3)} A</strong>
            <small>
              I = V / R = {voltage} / {resistance}
            </small>
          </div>
          <button
            onClick={() => {
              setVoltage(12);
              setResistance(240);
            }}
          >
            Reset simulator
          </button>
        </div>
        <div className="chart">
          <p>I-V relationship (R = {resistance} Ω)</p>
          <svg
            viewBox="0 0 460 260"
            role="img"
            aria-label={`Linear current voltage chart at ${resistance} ohms. Current at ${voltage} volts is ${current.toFixed(3)} amperes.`}
          >
            <line x1="50" y1="220" x2="430" y2="220" />
            <line x1="50" y1="20" x2="50" y2="220" />
            <line className="plot" x1="50" y1="220" x2="430" y2="35" />
            <circle
              cx={50 + (voltage / 48) * 380}
              cy={220 - (voltage / 48) * 185}
              r="7"
            />
            <text x="220" y="252">
              Voltage (V)
            </text>
            <text x="8" y="28">
              I (A)
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}

function Practice({ progress }: { progress: Progress }) {
  const due = lessons.filter(
    (item) => progress.states[item.id] === "Demonstrated",
  );
  return (
    <div className="page">
      <p className="eyebrow">Retrieval practice</p>
      <h1>Recall and problems</h1>
      <p className="lead">
        Practice without notes first. Repair the exact gap after attempting an
        answer.
      </p>
      <div className="panel">
        <h2>
          {due.length
            ? "Ready for recall"
            : "Complete a lesson to build your queue"}
        </h2>
        {due.map((item) => (
          <div className="recall-row" key={item.id}>
            <div>
              <strong>{item.title}</strong>
              <p>{item.interview}</p>
            </div>
            <a href={`#/lesson/${item.id}#interview`}>Practise</a>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressPage({ progress }: { progress: Progress }) {
  const completed = lessons.filter(
    (item) => progress.states[item.id] === "Demonstrated",
  );
  return (
    <div className="page">
      <p className="eyebrow">Mastery evidence</p>
      <h1>Your progress</h1>
      <p className="lead">
        {completed.length} of {lessons.length} foundation lessons demonstrated.
      </p>
      <div className="panel">
        <progress max={lessons.length} value={completed.length} />
        <div className="mastery-list">
          {lessons.map((item) => (
            <div key={item.id}>
              <span
                className={
                  progress.states[item.id] === "Demonstrated"
                    ? "status complete"
                    : "status"
                }
              >
                {progress.states[item.id] === "Demonstrated"
                  ? "Complete"
                  : "Not started"}
              </span>
              <a href={`#/lesson/${item.id}`}>{item.title}</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotesPage({
  progress,
  setProgress,
}: {
  progress: Progress;
  setProgress: React.Dispatch<React.SetStateAction<Progress>>;
}) {
  const [id, setId] = useState(lessons[0].id);
  return (
    <div className="page">
      <p className="eyebrow">Personal knowledge base</p>
      <h1>Lesson notes</h1>
      <label>
        Lesson
        <select value={id} onChange={(e) => setId(e.target.value)}>
          {lessons.map((item) => (
            <option value={item.id} key={item.id}>
              {item.title}
            </option>
          ))}
        </select>
      </label>
      <label>
        Your notes
        <textarea
          value={progress.notes[id] ?? ""}
          onChange={(e) =>
            setProgress((current) => ({
              ...current,
              notes: { ...current.notes, [id]: e.target.value },
            }))
          }
          placeholder="Record the model in your own words, a mistake to avoid, and one interview explanation."
        />
      </label>
      <p className="save-state">Saved automatically on this device.</p>
    </div>
  );
}

function Settings({
  progress,
  setProgress,
}: {
  progress: Progress;
  setProgress: React.Dispatch<React.SetStateAction<Progress>>;
}) {
  return (
    <div className="page">
      <p className="eyebrow">Preferences</p>
      <h1>Settings</h1>
      <div className="panel form-stack">
        <label>
          Name
          <input
            value={progress.name}
            onChange={(e) =>
              setProgress((current) => ({ ...current, name: e.target.value }))
            }
          />
        </label>
        <fieldset>
          <legend>Theme</legend>
          {(["system", "light", "dark"] as const).map((theme) => (
            <label className="radio-row" key={theme}>
              <input
                type="radio"
                name="theme"
                aria-label={theme}
                checked={progress.theme === theme}
                onChange={() =>
                  setProgress((current) => ({ ...current, theme }))
                }
              />
              {theme[0].toUpperCase() + theme.slice(1)}
            </label>
          ))}
        </fieldset>
      </div>
    </div>
  );
}

if (document.getElementById("root"))
  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
