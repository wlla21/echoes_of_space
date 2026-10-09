import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { TextureLoader } from "three";
import "./App.css";

type Body = {
  id: string;
  name: string;
  eyebrow: string;
  subtitle: string;
  description: string;
  diameter: string;
  distance: string;
  period: string;
  texture: string;
  radius: number;
  orbit: number;
  orbitSpeed: number;
  tint: string;
  action: string;
};

const bodies: Body[] = [
  {
    id: "mercury",
    name: "MERCURY",
    eyebrow: "SOLAR SYSTEM / PLANET 01",
    subtitle: "The Swiftest World",
    description:
      "A small, cratered world racing around the Sun, where ancient surfaces meet extreme temperatures.",
    diameter: "4,879 km",
    distance: "57.9 million km",
    period: "88 days",
    texture: "/textures/mercury.jpg",
    radius: 0.27,
    orbit: 4.9,
    orbitSpeed: 0.22,
    tint: "#c9bcb1",
    action: "EXPLORE PLANET",
  },
  {
    id: "earth",
    name: "EARTH",
    eyebrow: "SOLAR SYSTEM / PLANET 03",
    subtitle: "Our Pale Blue Home",
    description:
      "Our home planet, filled with oceans, continents, and the only known life in the universe.",
    diameter: "12,742 km",
    distance: "149.6 million km",
    period: "365.25 days",
    texture: "/textures/earth.jpg",
    radius: 0.48,
    orbit: 8.2,
    orbitSpeed: 0.11,
    tint: "#69c9e8",
    action: "EXPLORE PLANET",
  },
  {
    id: "mars",
    name: "MARS",
    eyebrow: "SOLAR SYSTEM / PLANET 04",
    subtitle: "The Red Frontier",
    description:
      "A rust-colored desert world with towering volcanoes, ancient river valleys, and robotic explorers.",
    diameter: "6,779 km",
    distance: "227.9 million km",
    period: "687 days",
    texture: "/textures/mars.jpg",
    radius: 0.37,
    orbit: 11.4,
    orbitSpeed: 0.085,
    tint: "#f28b63",
    action: "EXPLORE PLANET",
  },
  {
    id: "saturn",
    name: "SATURN",
    eyebrow: "SOLAR SYSTEM / PLANET 06",
    subtitle: "The Ringed Giant",
    description:
      "A vast gas giant surrounded by brilliant rings of ice and rock, with dozens of fascinating moons.",
    diameter: "116,460 km",
    distance: "1.43 billion km",
    period: "29.4 years",
    texture: "/textures/saturn.jpg",
    radius: 0.72,
    orbit: 14.6,
    orbitSpeed: 0.055,
    tint: "#e6c58b",
    action: "EXPLORE PLANET",
  },
  {
    id: "venus",
    name: "VENUS",
    eyebrow: "SOLAR SYSTEM / PLANET 02",
    subtitle: "Veiled in Gold",
    description:
      "A volcanic world wrapped in dense clouds, with a surface shaped by immense heat and pressure.",
    diameter: "12,104 km",
    distance: "108.2 million km",
    period: "225 days",
    texture: "/textures/venus.jpg",
    radius: 0.43,
    orbit: 6.6,
    orbitSpeed: 0.15,
    tint: "#f0c38e",
    action: "EXPLORE PLANET",
  },
  {
    id: "jupiter",
    name: "JUPITER",
    eyebrow: "SOLAR SYSTEM / PLANET 05",
    subtitle: "King of the Planets",
    description:
      "A colossal gas giant whose swirling cloud bands shelter storms larger than Earth itself.",
    diameter: "139,820 km",
    distance: "778.6 million km",
    period: "11.86 years",
    texture: "/textures/jupiter.jpg",
    radius: 0.88,
    orbit: 10.1,
    orbitSpeed: 0.07,
    tint: "#dfb68c",
    action: "EXPLORE PLANET",
  },
  {
    id: "uranus",
    name: "URANUS",
    eyebrow: "SOLAR SYSTEM / PLANET 07",
    subtitle: "The Sideways Ice Giant",
    description:
      "An icy blue giant that spins on its side, surrounded by faint rings and a family of dark moons.",
    diameter: "50,724 km",
    distance: "2.87 billion km",
    period: "84 years",
    texture: "/textures/uranus.jpg",
    radius: 0.65,
    orbit: 13.2,
    orbitSpeed: 0.045,
    tint: "#95e1e6",
    action: "EXPLORE PLANET",
  },
  {
    id: "neptune",
    name: "NEPTUNE",
    eyebrow: "SOLAR SYSTEM / PLANET 08",
    subtitle: "Beyond the Blue",
    description:
      "A distant ice giant swept by supersonic winds at the quiet, cold edge of the planetary system.",
    diameter: "49,244 km",
    distance: "4.50 billion km",
    period: "165 years",
    texture: "/textures/neptune.jpg",
    radius: 0.63,
    orbit: 15.5,
    orbitSpeed: 0.035,
    tint: "#688eff",
    action: "EXPLORE PLANET",
  },
];

const moon: Body = {
  id: "moon",
  name: "THE MOON",
  eyebrow: "EARTH'S NATURAL SATELLITE",
  subtitle: "Our Closest Celestial Neighbor",
  description:
    "The Moon is Earth's only natural satellite. Its cratered surface preserves evidence of billions of years of solar system history.",
  diameter: "3,474.8 km",
  distance: "384,400 km from Earth",
  period: "27.3 days",
  texture: "/textures/moon.jpg",
  radius: 0.17,
  orbit: 0.78,
  orbitSpeed: 0.42,
  tint: "#d9e1e8",
  action: "EXPLORE THE MOON",
};

const groups = [
  ["mercury", "earth", "mars", "saturn"],
  ["venus", "jupiter", "uranus", "neptune"],
  ["moon", "earth", "mars", "saturn"],
];

const relics = [
  {
    id: "rover",
    name: "Apollo Lunar Roving Vehicle",
    type: "MOBILE EXPLORATION",
    mission: "Apollo 15 / 16 / 17 · 1971–72",
    location: "Hadley–Apennine region",
    purpose:
      "Carried astronauts and scientific equipment across the lunar surface.",
  },
  {
    id: "lander",
    name: "Lunar Module Descent Stage",
    type: "LANDING SYSTEM",
    mission: "Apollo lunar missions · 1969–72",
    location: "Tranquility Base, Mare Tranquillitatis",
    purpose:
      "The lower stage that brought astronauts safely down to the lunar surface.",
  },
  {
    id: "experiment",
    name: "ALSEP Seismic Experiment",
    type: "LUNAR SCIENCE",
    mission: "Apollo 12 · 1969",
    location: "Oceanus Procellarum",
    purpose:
      "Measured moonquakes and helped scientists understand the Moon’s interior.",
  },
];

function updateBodyPosition(body: Body, elapsedTime: number, target: THREE.Vector3) {
  const angle =
    elapsedTime * body.orbitSpeed +
    (body.id === "moon" ? 0 : body.orbit * 0.67);
  if (body.id === "moon") {
    const earthAngle = elapsedTime * 0.11 + 8.2 * 0.67;
    target.set(
      Math.cos(earthAngle) * 8.2 + Math.cos(angle) * body.orbit,
      Math.sin(earthAngle) * 8.2 * 0.56 + Math.sin(angle) * body.orbit * 0.56,
      0.45,
    );
    return;
  }
  target.set(
    Math.cos(angle) * body.orbit,
    Math.sin(angle) * body.orbit * 0.56,
    0,
  );
}

function PlanetMesh({
  body,
  selected,
  onSelect,
}: {
  body: Body;
  selected: boolean;
  onSelect: () => void;
}) {
  const mesh = useMemo(
    () => new THREE.SphereGeometry(body.radius, 48, 48),
    [body.radius],
  );
  const texture = useLoader(TextureLoader, body.texture);
  const ref = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const object = ref.current;
    if (!object) return;
    updateBodyPosition(body, clock.elapsedTime, object.position);
    if (sphereRef.current) sphereRef.current.rotation.y += 0.0015;
  });

  return (
    <group
      ref={ref}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
    >
      <mesh ref={sphereRef} geometry={mesh}>
        <meshStandardMaterial map={texture} roughness={0.86} metalness={0.02} />
      </mesh>
      {body.id === "saturn" && (
        <mesh rotation={[Math.PI / 2.35, 0, -0.14]}>
          <ringGeometry args={[body.radius * 1.12, body.radius * 1.95, 96]} />
          <meshStandardMaterial
            color="#ddc59b"
            side={THREE.DoubleSide}
            transparent
            opacity={0.78}
            roughness={0.8}
          />
        </mesh>
      )}
      {selected && (
        <pointLight
          color="#57d8ff"
          intensity={1.7}
          distance={body.radius * 6}
        />
      )}
    </group>
  );
}

function PlanetCallout({ body }: { body: Body }) {
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const position = new THREE.Vector3();
    const startTime = performance.now();
    const update = () => {
      const label = labelRef.current;
      if (label) {
        updateBodyPosition(body, (performance.now() - startTime) / 1000, position);
        const width = window.innerWidth;
        const height = window.innerHeight;
        const distance = 35 - position.z;
        const halfHeight = Math.tan((37 * Math.PI) / 360) * distance;
        const x = width / 2 + (position.x / halfHeight) * (height / 2);
        const y = height / 2 - (position.y / halfHeight) * (height / 2);
        label.style.left = `${x}px`;
        label.style.top = `${y - body.radius * height / (halfHeight * 2)}px`;
        label.style.transform = "translate(-50%, -100%)";
      }
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [body, body.radius]);

  return <div ref={labelRef} className="planet-tag" aria-hidden="true">{body.name}</div>;
}

function Sun() {
  const texture = useLoader(TextureLoader, "/textures/sun.jpg");
  return (
    <group>
      <mesh>
        <sphereGeometry args={[1.15, 64, 64]} />
        <meshBasicMaterial map={texture} />
      </mesh>
      <mesh scale={1.17}>
        <sphereGeometry args={[1.15, 48, 48]} />
        <meshBasicMaterial
          color="#ff9f53"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>
      <pointLight color="#ffca86" intensity={100} distance={38} decay={2} />
    </group>
  );
}

function Orbit({ radius }: { radius: number }) {
  return (
    <mesh scale={[radius, radius * 0.56, 1]}>
      <ringGeometry args={[0.995, 1, 180]} />
      <meshBasicMaterial
        color="#a8c4df"
        transparent
        opacity={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function SolarScene({
  visible,
  selectedId,
  onSelect,
}: {
  visible: Body[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <Canvas
      className="solar-canvas"
      camera={{ position: [0, 0, 35], fov: 37 }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={["#030611"]} />
      <ambientLight intensity={0.18} />
      <Stars
        radius={90}
        depth={55}
        count={1800}
        factor={3}
        saturation={0.1}
        fade
        speed={0.25}
      />
      {visible
        .filter((body) => body.id !== "moon")
        .map((body) => (
          <Orbit key={`orbit-${body.id}`} radius={body.orbit} />
        ))}
      <Suspense fallback={null}>
        <Sun />
        {visible.map((body) => (
          <PlanetMesh
            key={body.id}
            body={body}
            selected={body.id === selectedId}
            onSelect={() => onSelect(body.id)}
          />
        ))}
        {!visible.some((body) => body.id === "moon") && (
          <PlanetMesh
            body={moon}
            selected={selectedId === "moon"}
            onSelect={() => onSelect("moon")}
          />
        )}
      </Suspense>
    </Canvas>
  );
}

function Crater({ x, z, size }: { x: number; z: number; size: number }) {
  return (
    <mesh position={[x, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[size * 0.72, size, 32]} />
      <meshStandardMaterial color="#6e7072" roughness={1} />
    </mesh>
  );
}

function LunarRover({
  position,
  onClick,
}: {
  position: [number, number, number];
  onClick: () => void;
}) {
  return (
    <group
      position={position}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      <mesh position={[0, 0.76, 0]}>
        <boxGeometry args={[1.2, 0.18, 0.75]} />
        <meshStandardMaterial
          color="#bcbfc0"
          metalness={0.55}
          roughness={0.45}
        />
      </mesh>
      <mesh position={[0, 1.25, 0]}>
        <boxGeometry args={[0.68, 0.56, 0.58]} />
        <meshStandardMaterial
          color="#d9c27c"
          metalness={0.25}
          roughness={0.4}
        />
      </mesh>
      {[-0.64, 0.64].map((x) =>
        [-0.43, 0.43].map((z) => (
          <mesh
            key={`${x}-${z}`}
            position={[x, 0.37, z]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.28, 0.28, 0.12, 18]} />
            <meshStandardMaterial color="#262a2d" roughness={0.9} />
          </mesh>
        )),
      )}
      <mesh position={[0, 1.84, -0.08]} rotation={[0.2, 0, 0.2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.7, 8]} />
        <meshStandardMaterial color="#d7d8d4" />
      </mesh>
    </group>
  );
}

function LunarLander({
  position,
  onClick,
}: {
  position: [number, number, number];
  onClick: () => void;
}) {
  return (
    <group
      position={position}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      <mesh position={[0, 1.7, 0]}>
        <cylinderGeometry args={[0.45, 0.72, 1, 6]} />
        <meshStandardMaterial
          color="#c6a55e"
          metalness={0.35}
          roughness={0.5}
        />
      </mesh>
      <mesh position={[0, 2.25, 0]}>
        <coneGeometry args={[0.5, 0.4, 6]} />
        <meshStandardMaterial color="#d7bd7e" metalness={0.25} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.85, 0, 0]}>
          <mesh position={[0, 0.85, 0]} rotation={[0, 0, side * 0.36]}>
            <cylinderGeometry args={[0.035, 0.035, 1.7, 8]} />
            <meshStandardMaterial color="#b89b61" />
          </mesh>
          <mesh position={[side * 0.4, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.04, 1.2, 8]} />
            <meshStandardMaterial color="#c6a55e" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function LunarScene({ onRelic }: { onRelic: (id: string) => void }) {
  const craters = useMemo(
    () =>
      Array.from({ length: 34 }, (_, index) => {
        const angle = index * 2.4;
        const distance = 4 + (index % 6) * 1.8;
        return {
          x: Math.cos(angle) * distance,
          z: Math.sin(angle) * distance,
          size: 0.35 + (index % 4) * 0.24,
        };
      }),
    [],
  );
  return (
    <Canvas
      className="lunar-canvas"
      camera={{ position: [0, 7, 14], fov: 48 }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={["#080b12"]} />
      <fog attach="fog" args={["#080b12", 18, 55]} />
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[-7, 10, 3]}
        intensity={2.6}
        color="#e7edff"
      />
      <Stars radius={90} depth={55} count={1400} factor={3} fade speed={0.15} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}>
        <planeGeometry args={[100, 100, 1, 1]} />
        <meshStandardMaterial color="#777775" roughness={1} />
      </mesh>
      {craters.map((crater, index) => (
        <Crater key={index} {...crater} />
      ))}
      <LunarRover position={[-3.2, 0, 1.8]} onClick={() => onRelic("rover")} />
      <LunarLander
        position={[3.1, 0, -3.2]}
        onClick={() => onRelic("lander")}
      />
      <group
        position={[0.6, 0.16, 3.5]}
        onClick={(event) => {
          event.stopPropagation();
          onRelic("experiment");
        }}
      >
        <mesh>
          <boxGeometry args={[0.42, 0.24, 0.34]} />
          <meshStandardMaterial color="#b8a66c" metalness={0.35} />
        </mesh>
        <mesh position={[0.16, 0.4, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.58, 8]} />
          <meshStandardMaterial color="#c8c4b8" />
        </mesh>
      </group>
    </Canvas>
  );
}

function App() {
  const [selectedId, setSelectedId] = useState("earth");
  const [groupIndex, setGroupIndex] = useState(0);
  const [view, setView] = useState<"system" | "moon">("system");
  const [relicId, setRelicId] = useState("rover");
  const selected =
    selectedId === "moon"
      ? moon
      : (bodies.find((body) => body.id === selectedId) ?? bodies[1]);
  const visible = useMemo(
    () =>
      groups[groupIndex]
        .map((id) =>
          id === "moon" ? moon : bodies.find((body) => body.id === id)!,
        )
        .filter(Boolean),
    [groupIndex],
  );
  const relic = relics.find((item) => item.id === relicId) ?? relics[0];

  const selectBody = (id: string) => {
    setSelectedId(id);
    if (id === "moon") setGroupIndex(2);
  };
  const changeGroup = (direction: number) => {
    const nextIndex = (groupIndex + direction + groups.length) % groups.length;
    setGroupIndex(nextIndex);
    setSelectedId(groups[nextIndex][0]);
  };

  return (
    <main className="space-app relative isolate min-h-screen overflow-hidden bg-[#030611] text-[#f5f7ff]">
      <div className="nebula nebula-one" />
      <div className="nebula nebula-two" />
      <header className="topbar absolute inset-x-0 top-0 z-20 flex items-center justify-between px-8 py-5 md:px-12">
        <button
          className="brand flex items-center gap-3"
          onClick={() => {
            setView("system");
            setSelectedId("earth");
            setGroupIndex(0);
          }}
          aria-label="Space Relics home"
        >
          <span className="brand-mark">
            <span />
          </span>
          <span className="brand-word">
            SPACE <b>RELICS</b>
          </span>
        </button>
        <nav
          className="top-nav flex items-center gap-8"
          aria-label="Main navigation"
        >
          <button
            className={view === "system" ? "nav-link active" : "nav-link"}
            onClick={() => setView("system")}
          >
            SOLAR SYSTEM
          </button>
          <button
            className={view === "moon" ? "nav-link active" : "nav-link"}
            onClick={() => setView("moon")}
          >
            FIELD JOURNAL
          </button>
        </nav>
        <button className="profile-button" aria-label="Open profile">
          A<span>01</span>
        </button>
      </header>

      <div className="coordinates" aria-hidden="true">
        <span>LOCAL GROUP</span>
        <i /> <span>SECTOR 01 — 08</span>
      </div>
      <div className="scene-wrap">
        {view === "system" ? (
          <SolarScene
            visible={visible}
            selectedId={selectedId}
            onSelect={selectBody}
          />
        ) : (
          <LunarScene onRelic={setRelicId} />
        )}
      </div>
      {view === "system" && (
        <PlanetCallout body={selected} />
      )}

      <aside className="info-panel absolute z-10" aria-live="polite">
        <div className="panel-kicker">
          <span className="status-dot" />
          {view === "moon"
            ? "LUNAR FIELD / RELIC 0" +
              (relics.findIndex((item) => item.id === relicId) + 1)
            : selected.eyebrow}
        </div>
        {view === "moon" ? (
          <>
            <span className="panel-index">{relic.type}</span>
            <h1>{relic.name}</h1>
            <p className="panel-subtitle">{relic.mission}</p>
            <p className="panel-description">{relic.purpose}</p>
            <div className="facts">
              <div>
                <span>LOCATION</span>
                <strong>{relic.location}</strong>
              </div>
              <div>
                <span>MISSION</span>
                <strong>{relic.mission}</strong>
              </div>
              <div>
                <span>STATUS</span>
                <strong>RESTING ON LUNAR SURFACE</strong>
              </div>
            </div>
            <div className="panel-actions">
              <button
                className="primary-button"
                onClick={() => setView("system")}
              >
                RETURN TO SYSTEM <span>↗</span>
              </button>
              <button
                className="text-button"
                onClick={() =>
                  setRelicId(
                    relics[
                      (relics.findIndex((item) => item.id === relicId) + 1) %
                        relics.length
                    ].id,
                  )
                }
              >
                NEXT RELIC <span>→</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <span className="panel-index">CELESTIAL BODY</span>
            <h1>{selected.name}</h1>
            <p className="panel-subtitle">{selected.subtitle}</p>
            <p className="panel-description">{selected.description}</p>
            <div className="facts">
              <div>
                <span>DIAMETER</span>
                <strong>{selected.diameter}</strong>
              </div>
              <div>
                <span>
                  {selected.id === "moon"
                    ? "AVG. DISTANCE FROM EARTH"
                    : "DISTANCE FROM SUN"}
                </span>
                <strong>{selected.distance}</strong>
              </div>
              <div>
                <span>ORBITAL PERIOD</span>
                <strong>{selected.period}</strong>
              </div>
            </div>
            <div className="panel-actions">
              <button
                className="primary-button"
                onClick={() => {
                  setView("moon");
                  setRelicId("rover");
                }}
              >
                {selected.action}
                <span>↗</span>
              </button>
              <button
                className="text-button"
                onClick={() => {
                  setView("moon");
                  setRelicId("lander");
                }}
              >
                VIEW DISCOVERIES <span>→</span>
              </button>
            </div>
          </>
        )}
        <div className="panel-foot">
          <span>NASA / JPL DATA</span>
          <span>01 — 08</span>
        </div>
      </aside>

      {view === "moon" && (
        <div className="relic-list absolute z-10">
          <span className="selector-caption">LUNAR DISCOVERIES</span>
          {relics.map((item, index) => (
            <button
              key={item.id}
              className={
                relicId === item.id ? "relic-choice selected" : "relic-choice"
              }
              onClick={() => setRelicId(item.id)}
            >
              <span>0{index + 1}</span>
              {item.name}
              <b>↗</b>
            </button>
          ))}
        </div>
      )}

      {view === "system" && (
        <section
          className="planet-selector absolute z-20"
          aria-label="Select a celestial body"
        >
          <button
            className="group-arrow previous"
            onClick={() => changeGroup(-1)}
            aria-label="Previous group"
            title="Previous group"
          >
            ↑
          </button>
          <div className="selector-items" key={groupIndex}>
            {visible.map((body, index) => (
              <button
                key={body.id}
                className={
                  selectedId === body.id
                    ? "selector-item selected"
                    : "selector-item"
                }
                onClick={() => selectBody(body.id)}
              >
                <span
                  className={`thumb thumb-${body.id}`}
                  style={
                    {
                      "--planet-tint": body.tint,
                      "--planet-texture": `url("${body.texture}")`,
                    } as React.CSSProperties
                  }
                >
                  <span />
                </span>
                <span className="selector-name">
                  {body.id === "moon" ? "MOON" : body.name}
                </span>
                <span className="selector-number">0{index + 1}</span>
              </button>
            ))}
          </div>
          <button
            className="group-arrow next"
            onClick={() => changeGroup(1)}
            aria-label="Next group"
            title="Next group"
          >
            ↓
          </button>
        </section>
      )}

      <div className="scene-caption absolute z-10">
        <span>
          {view === "moon" ? "LUNAR SURFACE" : "SOL · HELIOCENTRIC VIEW"}
        </span>
        <i />{" "}
        <span>
          {view === "moon" ? "APOLLO LANDING ZONE" : "LIVE SIMULATION"}
        </span>
      </div>
      <div className="side-tools absolute z-10">
        <button aria-label="Toggle sound">⌁</button>
        <span>SCROLL TO EXPLORE</span>
      </div>
    </main>
  );
}

export default App;
