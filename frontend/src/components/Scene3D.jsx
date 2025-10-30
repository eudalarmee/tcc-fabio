import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Grid } from '@react-three/drei';
import Scene3DModel from './Scene3DModel';
import { useShapeSimStore } from '../stores/shapeSimStore';

export default function Scene3D() {
  const controlsRef = useRef();
  const { autoRotate, setAutoRotate } = useShapeSimStore();
  const inactivityTimerRef = useRef(null);

  // Detectar inatividade para auto-rotate
  const resetInactivityTimer = () => {
    setAutoRotate(false);
    clearTimeout(inactivityTimerRef.current);
    
    inactivityTimerRef.current = setTimeout(() => {
      setAutoRotate(true);
    }, 5000);
  };

  useEffect(() => {
    resetInactivityTimer();
    return () => clearTimeout(inactivityTimerRef.current);
  }, []);

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#0D1117] via-[#151B23] to-[#0D1117]">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance'
        }}
        onPointerDown={resetInactivityTimer}
        onWheel={resetInactivityTimer}
        onTouchStart={resetInactivityTimer}
      >
        <Suspense fallback={<LoadingPlaceholder />}>
          <PerspectiveCamera 
            makeDefault 
            position={[0, 1.7, 3.2]} 
            fov={38}
          />

          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={2.4}
            maxDistance={4.2}
            minPolarAngle={0.9}
            maxPolarAngle={2.3}
            autoRotate={autoRotate && !prefersReducedMotion}
            autoRotateSpeed={0.5}
            enableDamping={true}
            dampingFactor={0.05}
            rotateSpeed={0.8}
            zoomSpeed={0.8}
            target={[0, 0.8, 0]}
          />

          <Lights />
          <Scene3DModel />
          <GridFloor />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

function Lights() {
  return (
    <>
      <hemisphereLight intensity={0.6} color="#ffffff" groundColor="#1a1a2e" />
      <directionalLight
        position={[2, 4, 3]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={15}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0001}
      />
      <spotLight position={[-3, 3, -4]} angle={0.5} penumbra={1} intensity={0.4} color="#FF6A3D" />
      <pointLight position={[0, 2, 4]} intensity={0.3} color="#ffffff" />
      <spotLight position={[4, 2, 2]} angle={0.6} penumbra={1} intensity={0.35} color="#FF1493" />
    </>
  );
}

function GridFloor() {
  return (
    <Grid
      args={[20, 20]}
      cellSize={0.5}
      cellColor="#ffffff"
      sectionSize={2}
      sectionColor="#ffffff"
      fadeDistance={25}
      fadeStrength={1}
      position={[0, -1.7, 0]}
      infiniteGrid
      material-opacity={0.04}
      material-transparent
    />
  );
}

function LoadingPlaceholder() {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <boxGeometry args={[0.5, 1.6, 0.3]} />
        <meshStandardMaterial color="#333333" wireframe opacity={0.3} transparent />
      </mesh>
      <pointLight intensity={0.5} />
    </group>
  );
}
