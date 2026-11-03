import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { CanvasTexture, SRGBColorSpace } from "three";

function OrbitScene() {
  const sceneRef = useRef(null);
  const starRef = useRef(null);
  const { pointer } = useThree();

  const solarTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    const width = 512;
    const height = 256;
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) throw new Error("Unable to create the solar texture canvas.");

    let seed = 42017;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const createNoiseGrid = (columns, rows) =>
      Float32Array.from({ length: columns * rows }, random);

    const noiseGrid = (grid, columns, rows, u, v) => {
      const x = ((u * columns) % columns + columns) % columns;
      const y = Math.min(v * rows, rows - Number.EPSILON);
      const x0 = Math.floor(x);
      const y0 = Math.floor(y);
      const tx = x - x0;
      const ty = y - y0;
      const smoothX = tx * tx * (3 - 2 * tx);
      const smoothY = ty * ty * (3 - 2 * ty);
      const nextX = (x0 + 1) % columns;
      const nextY = Math.min(y0 + 1, rows - 1);
      const topLeft = grid[y0 * columns + x0];
      const topRight = grid[y0 * columns + nextX];
      const bottomLeft = grid[nextY * columns + x0];
      const bottomRight = grid[nextY * columns + nextX];
      const top = topLeft + (topRight - topLeft) * smoothX;
      const bottom = bottomLeft + (bottomRight - bottomLeft) * smoothX;

      return top + (bottom - top) * smoothY;
    };

    const octaves = [
      { columns: 4, rows: 4, weight: 0.26 },
      { columns: 8, rows: 8, weight: 0.23 },
      { columns: 16, rows: 16, weight: 0.2 },
      { columns: 32, rows: 32, weight: 0.16 },
      { columns: 64, rows: 64, weight: 0.1 },
      { columns: 128, rows: 128, weight: 0.05 },
    ].map(({ columns, rows, weight }) => ({
      columns,
      rows,
      weight,
      grid: createNoiseGrid(columns, rows),
    }));

    const activeRegions = Array.from({ length: 7 }, () => ({
      u: random(),
      v: random(),
      strength: 0.08 + random() * 0.22,
      size: 0.0015 + random() * 0.0035,
    }));
    const image = context.createImageData(width, height);

    for (let y = 0; y < height; y += 1) {
      const v = y / height;
      const latitude = Math.cos((v - 0.5) * Math.PI);

      for (let x = 0; x < width; x += 1) {
        const u = x / width;
        const warp = noiseGrid(octaves[0].grid, 4, 4, u, v) - 0.5;
        let turbulence = 0;
        let weightTotal = 0;

        for (const { columns, rows, weight, grid } of octaves) {
          turbulence += noiseGrid(grid, columns, rows, u + warp * 0.045, v + warp * 0.035) * weight;
          weightTotal += weight;
        }

        turbulence /= weightTotal;
        const fineGrain = noiseGrid(octaves[5].grid, 128, 128, u, v);
        const filaments = Math.pow(
          Math.max(0, 1 - Math.abs(Math.sin((turbulence * 15 + warp * 2.4) * Math.PI))),
          4,
        );
        let active = 0;

        for (const region of activeRegions) {
          const distanceU = Math.min(Math.abs(u - region.u), 1 - Math.abs(u - region.u));
          const distanceV = (v - region.v) * 0.64;
          const distanceSquared = distanceU * distanceU + distanceV * distanceV;
          active += region.strength * Math.exp(-distanceSquared / region.size);
        }

        const plasma = Math.max(
          0,
          Math.min(
            1,
            0.16 +
              (turbulence - 0.34) * 2.1 +
              filaments * 0.27 +
              active * 1.7 +
              (fineGrain - 0.5) * 0.2,
          ),
        );
        const limbDarkening = 0.56 + latitude * 0.44;
        const lowColor = [38, 12, 72];
        const middleColor = [136, 25, 117];
        const highColor = [239, 52, 132];
        const hotColor = [255, 153, 207];
        const blend = (from, to, amount) => from + (to - from) * amount;
        const heat = Math.max(0, Math.min(1, (plasma - 0.12) / 0.88));
        const color =
          heat < 0.48
            ? lowColor.map((channel, index) =>
                blend(channel, middleColor[index], heat / 0.48),
              )
            : heat < 0.82
              ? middleColor.map((channel, index) =>
                  blend(channel, highColor[index], (heat - 0.48) / 0.34),
                )
              : highColor.map((channel, index) =>
                  blend(channel, hotColor[index], (heat - 0.82) / 0.18),
                );
        const index = (y * width + x) * 4;

        image.data[index] = (color[0] + active * 80 + filaments * 24) * limbDarkening;
        image.data[index + 1] = (color[1] + active * 45 + filaments * 18) * limbDarkening;
        image.data[index + 2] = (color[2] + active * 75 + filaments * 26) * limbDarkening;
        image.data[index + 3] = 255;
      }
    }

    context.putImageData(image, 0, 0);

    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    return texture;
  }, []);

  const stars = useMemo(
    () =>
      new Float32Array(
        Array.from({ length: 170 }, (_, index) => {
          const angle = index * 2.399963;
          const distance = 3 + ((index * 37) % 70) / 18;
          return [
            Math.cos(angle) * distance,
            (((index * 19) % 53) - 26) / 7,
            Math.sin(angle) * distance,
          ];
        }).flat(),
      ),
    [],
  );

  useFrame(({ clock }, delta) => {
    if (!sceneRef.current) return;

    const elapsed = clock.getElapsedTime();
    sceneRef.current.rotation.y += delta * 0.075;
    sceneRef.current.rotation.x +=
      (pointer.y * 0.12 - sceneRef.current.rotation.x) * delta * 1.5;
    sceneRef.current.position.y = Math.sin(elapsed * 0.55) * 0.1;

    if (starRef.current) {
      starRef.current.rotation.y += delta * 0.12;
      starRef.current.rotation.z = Math.sin(elapsed * 0.3) * 0.025;
    }
  });

  return (
    <>
      <ambientLight intensity={0.75} />
      <pointLight position={[3, 3, 4]} color="#ff9bcf" intensity={15} distance={12} />
      <pointLight position={[-4, -2, -3]} color="#82baff" intensity={13} distance={14} />
      <group ref={sceneRef}>
        <mesh ref={starRef}>
          <sphereGeometry args={[1.12, 96, 64]} />
          <meshPhysicalMaterial
            map={solarTexture}
            bumpMap={solarTexture}
            bumpScale={0.075}
            emissiveMap={solarTexture}
            emissive="#ff85c2"
            emissiveIntensity={0.38}
            roughness={0.88}
            metalness={0.05}
            clearcoat={1}
            clearcoatRoughness={0.5}
          />
        </mesh>
        <mesh rotation={[0.78, 0.16, -0.4]}>
          <torusGeometry args={[1.75, 0.009, 10, 180]} />
          <meshBasicMaterial color="#ff76b5" transparent opacity={0.8} />
        </mesh>
        <mesh rotation={[1.32, -0.5, 0.24]}>
          <torusGeometry args={[2.15, 0.006, 8, 180]} />
          <meshBasicMaterial color="#88d5ff" transparent opacity={0.52} />
        </mesh>
        <mesh position={[1.44, 0.42, 0.62]}>
          <icosahedronGeometry args={[0.11, 0]} />
          <meshStandardMaterial color="#88d5ff" emissive="#2076a4" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[-1.72, -0.7, -0.1]}>
          <octahedronGeometry args={[0.12, 0]} />
          <meshStandardMaterial color="#ff809f" emissive="#ff526d" emissiveIntensity={0.55} />
        </mesh>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[stars, 3]} />
          </bufferGeometry>
          <pointsMaterial
            color="#f0eee7"
            size={0.025}
            sizeAttenuation
            transparent
            opacity={0.52}
          />
        </points>
      </group>
    </>
  );
}

export default function OrbitExperience() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.4], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      fallback={<div className="hero-art__fallback" />}
    >
      <OrbitScene />
    </Canvas>
  );
}
