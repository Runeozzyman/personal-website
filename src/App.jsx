import { useEffect, useRef, useState } from "react";
import { profile, programs, projects, skillGroups } from "./content.js";
import { PixelIcon } from "./PixelIcon.jsx";
import { Wallpaper } from "./Wallpaper.jsx";

const compactQuery = "(max-width: 720px)";
const coarseQuery = "(pointer: coarse)";

function useMedia(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

function useClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 10000);
    return () => window.clearInterval(id);
  }, []);

  return now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function useCalgaryTemperature() {
  const [temperature, setTemperature] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=51.0447&longitude=-114.0719&current=temperature_2m"
        );
        if (!response.ok) return;
        const data = await response.json();
        const value = data?.current?.temperature_2m;
        if (!cancelled && Number.isFinite(value)) setTemperature(Math.round(value));
      } catch {
        // Keep the city label visible when the forecast cannot be reached.
      }
    }

    load();
    const id = window.setInterval(load, 15 * 60 * 1000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  return temperature;
}

function WindowBody({ id }) {
  if (id === "about") {
    return (
      <div className="sheet">
        <h2>{profile.name}</h2>
        <p className="role">{profile.role}</p>
        <p className="bio">{profile.bio}</p>
        <dl className="facts">
          <dt>Location</dt>
          <dd>
            {profile.location}
            <p className="note">{profile.relocation}</p>
          </dd>
          <dt>Focus</dt>
          <dd>{profile.focus}</dd>
        </dl>
      </div>
    );
  }

  if (id === "skills") {
    return (
      <div className="groups">
        {skillGroups.map((group) => (
          <section className="group" key={group.label}>
            <h3>{group.label}</h3>
            <ul className="chips">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    );
  }

  if (id === "work") {
    return (
      <div className="projects">
        {projects.map((project) => (
          <article className="project" key={project.name}>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <a className="xp-button" href={project.href} target="_blank" rel="noreferrer">
              Open on GitHub
            </a>
          </article>
        ))}
      </div>
    );
  }

  if (id === "contact") {
    return (
      <div className="contact-list">
        <p className="contact-row">
          <span>Email</span>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </p>
        <p className="contact-row">
          <span>GitHub</span>
          <a href={profile.github} target="_blank" rel="noreferrer">
            {profile.githubName}
          </a>
        </p>
        <p className="contact-row">
          <span>LinkedIn</span>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            {profile.linkedinName}
          </a>
        </p>
      </div>
    );
  }

  return <p className="empty">Recycle Bin is empty.</p>;
}

function LoginScreen({ phase, onLogOn }) {
  const welcoming = phase !== "login";

  return (
    <div className={phase === "leaving" ? "login leaving" : "login"} role="dialog" aria-label="Log on">
      {welcoming ? (
        <div className="welcome-panel">
          <p className="welcome-kicker">welcome</p>
          <p className="welcome-name">{profile.name}</p>
          <div className="loading-blocks" aria-hidden="true">
            {Array.from({ length: 8 }, (_, index) => (
              <span key={index} style={{ animationDelay: `${index * 120}ms` }} />
            ))}
          </div>
        </div>
      ) : (
        <div className="login-card">
          <p className="login-kicker">welcome</p>
          <form
            className="account"
            onSubmit={(event) => {
              event.preventDefault();
              onLogOn();
            }}
          >
            <span className="portrait">
              <span className="portrait-frame">
                {profile.photo ? (
                  <img className="portrait-photo" src={profile.photo} alt="" />
                ) : (
                  <PixelIcon id="user" />
                )}
              </span>
              <span className="portrait-caption">Photo</span>
            </span>
            <span className="account-copy">
              <span className="account-name">{profile.name}</span>
              <span className="account-summary">{profile.loginSummary}</span>
              <span className="password-line">
                <label className="password-label" htmlFor="logon-password">
                  Password
                </label>
                <input
                  id="logon-password"
                  className="password-input"
                  type="text"
                  value="********"
                  readOnly
                  autoComplete="off"
                  spellCheck={false}
                />
                <button type="submit" className="logon-button" autoFocus>
                  <svg className="logon-arrow" viewBox="0 0 7 7" aria-hidden="true">
                    <g fill="currentColor" shapeRendering="crispEdges">
                      <rect x="0" y="3" width="4" height="1" />
                      <rect x="3" y="2" width="1" height="3" />
                      <rect x="4" y="1" width="1" height="5" />
                      <rect x="5" y="2" width="1" height="3" />
                      <rect x="6" y="3" width="1" height="1" />
                    </g>
                  </svg>
                  log on
                </button>
              </span>
            </span>
          </form>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const compact = useMedia(compactQuery);
  const coarse = useMedia(coarseQuery);
  const clock = useClock();
  const temperature = useCalgaryTemperature();
  const zRef = useRef(1);
  const windowsRef = useRef({});
  const positionsRef = useRef({});
  const dragRef = useRef(null);
  const iconDragRef = useRef(null);
  const suppressClick = useRef(false);
  const [windows, setWindows] = useState({});
  const [positions, setPositions] = useState(() =>
    Object.fromEntries(programs.map((program, index) => [program.id, { x: 12, y: 12 + index * 96 }]))
  );
  const [activeId, setActiveId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [startOpen, setStartOpen] = useState(false);
  const [loggingOff, setLoggingOff] = useState(false);
  const [boot, setBoot] = useState("login");
  const bootTimer = useRef([]);

  useEffect(() => {
    windowsRef.current = windows;
  }, [windows]);

  useEffect(() => {
    positionsRef.current = positions;
  }, [positions]);

  useEffect(() => {
    function onKey(event) {
      if (event.key === "Escape") setStartOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      bootTimer.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  function focusWindow(id) {
    const z = ++zRef.current;
    setWindows((current) => ({ ...current, [id]: { ...current[id], z } }));
    setActiveId(id);
  }

  function openProgram(id) {
    const z = ++zRef.current;
    setStartOpen(false);
    setSelectedId(id);
    setWindows((current) => {
      const existing = current[id];
      if (existing?.open) {
        return { ...current, [id]: { ...existing, minimized: false, z } };
      }
      const openCount = Object.values(current).filter((item) => item.open).length;
      return {
        ...current,
        [id]: {
          open: true,
          minimized: false,
          maximized: compact,
          x: 86 + (openCount % 5) * 28,
          y: 28 + (openCount % 5) * 28,
          z,
        },
      };
    });
    setActiveId(id);
  }

  function closeWindow(id) {
    const next = { ...windowsRef.current, [id]: { ...windowsRef.current[id], open: false } };
    const top = Object.entries(next)
      .filter(([, item]) => item.open && !item.minimized)
      .sort((a, b) => b[1].z - a[1].z)[0];
    setWindows(next);
    setActiveId(top?.[0] ?? null);
  }

  function minimizeWindow(id) {
    setWindows((current) => ({ ...current, [id]: { ...current[id], minimized: true } }));
    setActiveId((current) => (current === id ? null : current));
  }

  function toggleMaximize(id) {
    setWindows((current) => ({
      ...current,
      [id]: { ...current[id], maximized: !current[id].maximized },
    }));
    focusWindow(id);
  }

  function onTaskClick(id) {
    const item = windowsRef.current[id];
    if (item && !item.minimized && activeId === id) {
      minimizeWindow(id);
      return;
    }
    openProgram(id);
  }

  function clearBootTimers() {
    bootTimer.current.forEach((id) => window.clearTimeout(id));
    bootTimer.current = [];
  }

  function logOn() {
    if (boot !== "login") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setBoot("done");
      return;
    }
    setBoot("welcome");
    const welcome = window.setTimeout(() => {
      setBoot("leaving");
      const leave = window.setTimeout(() => setBoot("done"), 420);
      bootTimer.current.push(leave);
    }, 1300);
    bootTimer.current.push(welcome);
  }

  function logOff() {
    clearBootTimers();
    setStartOpen(false);
    setLoggingOff(true);
    window.setTimeout(() => {
      setWindows({});
      setActiveId(null);
      setLoggingOff(false);
      setBoot("login");
    }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 700);
  }

  function onTitlePointerDown(event, id) {
    if (event.button !== 0 || event.target.closest(".title-buttons")) return;
    focusWindow(id);
    const item = windowsRef.current[id];
    if (!item || item.maximized) return;
    dragRef.current = {
      id,
      dx: event.clientX - item.x,
      dy: event.clientY - item.y,
    };
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Drag still tracks while the pointer stays on the title bar.
    }
  }

  function onTitlePointerMove(event) {
    const drag = dragRef.current;
    if (!drag) return;
    const x = Math.max(0, Math.min(window.innerWidth - 120, event.clientX - drag.dx));
    const y = Math.max(0, Math.min(window.innerHeight - 90, event.clientY - drag.dy));
    setWindows((current) => ({ ...current, [drag.id]: { ...current[drag.id], x, y } }));
  }

  function onTitlePointerUp() {
    dragRef.current = null;
  }

  function onIconPointerDown(event, id) {
    if (event.button !== 0 || compact) return;
    event.stopPropagation();
    setSelectedId(id);
    setStartOpen(false);
    const pos = positionsRef.current[id];
    iconDragRef.current = {
      id,
      dx: event.clientX - pos.x,
      dy: event.clientY - pos.y,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onIconPointerMove(event) {
    const drag = iconDragRef.current;
    if (!drag) return;
    if (Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 6) return;
    drag.moved = true;
    const x = Math.max(0, Math.min(window.innerWidth - 96, event.clientX - drag.dx));
    const y = Math.max(0, Math.min(window.innerHeight - 130, event.clientY - drag.dy));
    setPositions((current) => ({ ...current, [drag.id]: { x, y } }));
  }

  function onIconPointerUp() {
    if (iconDragRef.current?.moved) suppressClick.current = true;
    iconDragRef.current = null;
  }

  function onIconClick(event, id) {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    if (coarse || event.detail === 0) {
      openProgram(id);
      return;
    }
    setSelectedId(id);
    setStartOpen(false);
  }

  function onDesktopPointerDown(event) {
    if (event.target !== event.currentTarget) return;
    setSelectedId(null);
    setStartOpen(false);
  }

  const openWindows = programs.filter((program) => windows[program.id]?.open);

  return (
    <div className="desktop" onPointerDown={onDesktopPointerDown}>
      <h1 className="sr-only">{profile.name}</h1>
      <Wallpaper />
      <p className="hint">Double-click an icon</p>
      <div className="icon-layer">
        {programs.map((program) => {
          const pos = positions[program.id];
          return (
            <button
              key={program.id}
              type="button"
              className={selectedId === program.id ? "icon selected" : "icon"}
              style={compact ? undefined : { left: pos.x, top: pos.y }}
              onPointerDown={(event) => onIconPointerDown(event, program.id)}
              onPointerMove={onIconPointerMove}
              onPointerUp={onIconPointerUp}
              onClick={(event) => onIconClick(event, program.id)}
              onDoubleClick={() => {
                if (!coarse) openProgram(program.id);
              }}
            >
              <PixelIcon id={program.id} />
              <span className="icon-label">{program.name}</span>
            </button>
          );
        })}
      </div>

      {programs.map((program) => {
        const item = windows[program.id];
        if (!item?.open || item.minimized) return null;
        const active = activeId === program.id;
        return (
          <section
            key={program.id}
            className={
              item.maximized
                ? `window maximized${active ? "" : " inactive"}`
                : `window${active ? "" : " inactive"}`
            }
            style={item.maximized ? { zIndex: item.z } : { left: item.x, top: item.y, zIndex: item.z }}
            role="dialog"
            aria-labelledby={`${program.id}-title`}
            onPointerDown={() => focusWindow(program.id)}
          >
            <div
              className="titlebar"
              onPointerDown={(event) => onTitlePointerDown(event, program.id)}
              onPointerMove={onTitlePointerMove}
              onPointerUp={onTitlePointerUp}
            >
              <PixelIcon id={program.id} small />
              <span className="title-text" id={`${program.id}-title`}>
                {program.name}
              </span>
              <div className="title-buttons">
                <button type="button" aria-label={`Minimize ${program.name}`} onClick={() => minimizeWindow(program.id)}>
                  _
                </button>
                <button type="button" aria-label={`Maximize ${program.name}`} onClick={() => toggleMaximize(program.id)}>
                  □
                </button>
                <button type="button" className="close" aria-label={`Close ${program.name}`} onClick={() => closeWindow(program.id)}>
                  ×
                </button>
              </div>
            </div>
            <div className="window-body">
              <WindowBody id={program.id} />
            </div>
            <footer className="status">{program.status}</footer>
          </section>
        );
      })}

      {startOpen && (
        <div className="start-menu" onPointerDown={(event) => event.stopPropagation()}>
          <div className="start-header">
            <PixelIcon id="user" small />
            <div>
              <p className="who">{profile.name}</p>
              <p className="job">{profile.role}</p>
            </div>
          </div>
          <div className="menu-list">
            {programs
              .filter((program) => program.id !== "bin")
              .map((program) => (
                <button key={program.id} type="button" className="menu-item" onClick={() => openProgram(program.id)}>
                  <PixelIcon id={program.id} small />
                  {program.name}
                </button>
              ))}
            <button type="button" className="menu-item logoff" onClick={logOff}>
              Log Off
            </button>
          </div>
        </div>
      )}

      <footer className="taskbar" onPointerDown={(event) => event.stopPropagation()}>
        <button
          type="button"
          className={startOpen ? "start open" : "start"}
          aria-expanded={startOpen}
          onClick={() => setStartOpen((open) => !open)}
        >
          <span className="start-mark" aria-hidden="true" />
          start
        </button>
        <div className="tasks">
          {openWindows.map((program) => (
            <button
              key={program.id}
              type="button"
              className={activeId === program.id && !windows[program.id].minimized ? "task-button active" : "task-button"}
              onClick={() => onTaskClick(program.id)}
            >
              <PixelIcon id={program.id} small />
              <span>{program.name}</span>
            </button>
          ))}
        </div>
        <div
          className="place"
          aria-label={temperature == null ? "Calgary, AB" : `Calgary, AB, ${temperature} degrees Celsius`}
        >
          <span>Calgary, AB</span>
          {temperature != null && <span>{temperature}°C</span>}
        </div>
        <div className="clock">{clock}</div>
      </footer>

      {loggingOff && <div className="logoff-screen">Logging off...</div>}
      {boot !== "done" && <LoginScreen phase={boot} onLogOn={logOn} />}
    </div>
  );
}
