import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useShapeSimStore } from '../stores/shapeSimStore';
import * as THREE from 'three';

export default function Scene3DModel() {
  const groupRef = useRef();
  const meshRef = useRef();
  const { gender, bf, muscle } = useShapeSimStore();
  const [modelError, setModelError] = useState(false);
  
  // Tentar carregar modelo
  let model = null;
  try {
    const modelPath = `/3d/${gender}_athlete.glb`;
    model = useGLTF(modelPath, true);
  } catch (error) {
    console.warn('Modelo 3D não encontrado, usando fallback');
    setModelError(true);
  }

  // Animação suave de rotação automática
  useFrame((state) => {
    if (groupRef.current && useShapeSimStore.getState().autoRotate) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  // Aplicar morphTargets ou fallback
  useEffect(() => {
    if (!meshRef.current || !model) return;

    const mesh = meshRef.current;
    
    // Tentar aplicar morph targets
    if (mesh.morphTargetInfluences && mesh.morphTargetDictionary) {
      const bfIndex = mesh.morphTargetDictionary['bfDown'];
      const muscleIndex = mesh.morphTargetDictionary['muscleUp'];
      
      if (bfIndex !== undefined) {
        mesh.morphTargetInfluences[bfIndex] = bf;
      }
      if (muscleIndex !== undefined) {
        mesh.morphTargetInfluences[muscleIndex] = muscle;
      }
    } else {
      // Fallback: scale não uniforme
      applyFallbackTransform(mesh, bf, muscle);
    }
  }, [bf, muscle, model]);

  // Fallback transform quando não há morph targets
  const applyFallbackTransform = (mesh, bfValue, muscleValue) => {
    mesh.traverse((child) => {
      if (child.isMesh) {
        // Escala base + muscle
        const muscleScale = 1 + muscleValue * 0.08;
        child.scale.set(muscleScale, 1, muscleScale);
        
        // Ajustar material para simular definição (BF)
        if (child.material) {
          const originalRoughness = child.material.userData.originalRoughness || child.material.roughness;
          child.material.userData.originalRoughness = originalRoughness;
          
          // Mais BF = mais definição = menos roughness
          child.material.roughness = THREE.MathUtils.lerp(
            originalRoughness,
            originalRoughness * 0.7,
            bfValue
          );
          
          // Ajustar AO intensity se disponível
          if (child.material.aoMapIntensity !== undefined) {
            child.material.aoMapIntensity = THREE.MathUtils.lerp(1, 1.5, bfValue);
          }
        }
      }
    });
  };

  // Se não há modelo, renderizar placeholder realista
  if (modelError || !model) {
    return <FallbackModel bf={bf} muscle={muscle} gender={gender} />;
  }

  return (
    <group ref={groupRef} position={[0, -1.7, 0]}>
      <primitive 
        ref={meshRef}
        object={model.scene} 
        scale={1}
      />
    </group>
  );
}

// Modelo Fallback procedural PREMIUM (enquanto não temos GLB)
function FallbackModel({ bf, muscle, gender }) {
  const groupRef = useRef();
  
  useFrame(() => {
    if (groupRef.current && useShapeSimStore.getState().autoRotate) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  const bodyScale = 1 + muscle * 0.15;
  const definition = bf * 0.9;
  
  // Cores baseadas em gênero
  const skinColor = gender === 'male' ? '#A67C52' : '#C4A57B';
  const shadowColor = gender === 'male' ? '#6B4423' : '#8B6F47';
  const highlightColor = '#E8D4B8';

  return (
    <group ref={groupRef} position={[0, -0.9, 0]} scale={1.1}>
      {/* Cabeça */}
      <mesh position={[0, 1.55, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial 
          color={skinColor} 
          roughness={0.28}
          metalness={0.02}
        />
      </mesh>

      {/* Cabelo simples */}
      <mesh position={[0, 1.63, 0]} castShadow>
        <sphereGeometry args={[0.15, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color={gender === 'male' ? '#2C1810' : '#4A3328'}
          roughness={0.8}
        />
      </mesh>

      {/* Pescoço */}
      <mesh position={[0, 1.38, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.065, 0.075, 0.14, 16]} />
        <meshStandardMaterial 
          color={skinColor} 
          roughness={0.3}
        />
      </mesh>

      {/* Trapézio */}
      <mesh position={[0, 1.32, 0]} scale={[bodyScale * 1.15, 1, bodyScale]} castShadow receiveShadow>
        <coneGeometry args={[0.16, 0.08, 16]} />
        <meshStandardMaterial 
          color={skinColor}
          roughness={0.25 - definition * 0.12}
          metalness={0.04}
        />
      </mesh>

      {/* Tronco Superior - Peitoral */}
      <mesh position={[0, 1.1, 0]} scale={[bodyScale * 1.25, 1, bodyScale]} castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.38, 0.24]} />
        <meshStandardMaterial 
          color={skinColor}
          roughness={0.22 - definition * 0.15}
          metalness={0.05}
        />
      </mesh>

      {/* Definição peitoral central */}
      {definition > 0.25 && (
        <mesh position={[0, 1.18, 0.125]}>
          <planeGeometry args={[0.015, 0.28]} />
          <meshStandardMaterial 
            color={shadowColor}
            opacity={definition * 0.6}
            transparent
          />
        </mesh>
      )}

      {/* Highlight peitoral superior */}
      <mesh position={[0, 1.22, 0.13]} rotation={[-0.3, 0, 0]}>
        <ellipseGeometry args={[0.15 * bodyScale, 0.08, 32]} />
        <meshStandardMaterial 
          color={highlightColor}
          opacity={0.15 + muscle * 0.2}
          transparent
          emissive={highlightColor}
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Ombros (Deltóides) */}
      <mesh 
        position={[-0.24 - bodyScale * 0.02, 1.22, 0]} 
        scale={[bodyScale * 1.4, 1, bodyScale * 1.4]}
        castShadow 
        receiveShadow
      >
        <sphereGeometry args={[0.095, 24, 24]} />
        <meshStandardMaterial 
          color={skinColor}
          roughness={0.24 - definition * 0.1}
          metalness={0.05}
        />
      </mesh>
      <mesh 
        position={[0.24 + bodyScale * 0.02, 1.22, 0]} 
        scale={[bodyScale * 1.4, 1, bodyScale * 1.4]}
        castShadow 
        receiveShadow
      >
        <sphereGeometry args={[0.095, 24, 24]} />
        <meshStandardMaterial 
          color={skinColor}
          roughness={0.24 - definition * 0.1}
          metalness={0.05}
        />
      </mesh>

      {/* Braço Esquerdo (Bíceps/Tríceps) */}
      <group position={[-0.28 - bodyScale * 0.03, 1.0, 0]}>
        <mesh 
          rotation={[0, 0, 0.08]} 
          scale={[bodyScale * 1.35, 1, bodyScale * 1.35]}
          castShadow 
          receiveShadow
        >
          <capsuleGeometry args={[0.058, 0.48, 16, 32]} />
          <meshStandardMaterial 
            color={skinColor}
            roughness={0.26 - definition * 0.12}
            metalness={0.04}
          />
        </mesh>
        
        {/* Highlight bíceps */}
        <mesh position={[0, 0.12, 0.06]} rotation={[0, 0, 0.08]}>
          <ellipseGeometry args={[0.035 * bodyScale, 0.08, 16]} />
          <meshStandardMaterial 
            color={highlightColor}
            opacity={0.2 + muscle * 0.35}
            transparent
          />
        </mesh>

        {/* Antebraço */}
        <mesh position={[0, -0.32, 0]} rotation={[0, 0, 0.05]}>
          <capsuleGeometry args={[0.045, 0.32, 16, 32]} />
          <meshStandardMaterial color={skinColor} roughness={0.32} />
        </mesh>
        
        {/* Mão */}
        <mesh position={[0, -0.52, 0]} castShadow>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.4} />
        </mesh>
      </group>

      {/* Braço Direito */}
      <group position={[0.28 + bodyScale * 0.03, 1.0, 0]}>
        <mesh 
          rotation={[0, 0, -0.08]} 
          scale={[bodyScale * 1.35, 1, bodyScale * 1.35]}
          castShadow 
          receiveShadow
        >
          <capsuleGeometry args={[0.058, 0.48, 16, 32]} />
          <meshStandardMaterial 
            color={skinColor}
            roughness={0.26 - definition * 0.12}
            metalness={0.04}
          />
        </mesh>
        
        {/* Highlight bíceps */}
        <mesh position={[0, 0.12, 0.06]} rotation={[0, 0, -0.08]}>
          <ellipseGeometry args={[0.035 * bodyScale, 0.08, 16]} />
          <meshStandardMaterial 
            color={highlightColor}
            opacity={0.2 + muscle * 0.35}
            transparent
          />
        </mesh>

        {/* Antebraço */}
        <mesh position={[0, -0.32, 0]} rotation={[0, 0, -0.05]}>
          <capsuleGeometry args={[0.045, 0.32, 16, 32]} />
          <meshStandardMaterial color={skinColor} roughness={0.32} />
        </mesh>
        
        {/* Mão */}
        <mesh position={[0, -0.52, 0]} castShadow>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.4} />
        </mesh>
      </group>

      {/* Core/Abdômen */}
      <mesh 
        position={[0, 0.78, 0]} 
        scale={[bodyScale * 0.95, 1, bodyScale * 0.85]}
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[0.36, 0.42, 0.22]} />
        <meshStandardMaterial 
          color={skinColor}
          roughness={0.20 - definition * 0.18}
          metalness={0.06}
        />
      </mesh>

      {/* Six-pack definition */}
      {definition > 0.2 && (
        <group position={[0, 0.85, 0.115]}>
          {/* Linha central */}
          <mesh>
            <planeGeometry args={[0.012, 0.38]} />
            <meshStandardMaterial 
              color={shadowColor}
              opacity={definition * 0.7}
              transparent
            />
          </mesh>
          
          {/* Blocos abdominais */}
          {[...Array(3)].map((_, i) => (
            <group key={`abs-row-${i}`} position={[0, 0.12 - i * 0.11, 0]}>
              {/* Esquerda */}
              <mesh position={[-0.055, 0, 0]}>
                <planeGeometry args={[0.08, 0.055]} />
                <meshStandardMaterial 
                  color={shadowColor}
                  opacity={definition * 0.5}
                  transparent
                />
              </mesh>
              {/* Direita */}
              <mesh position={[0.055, 0, 0]}>
                <planeGeometry args={[0.08, 0.055]} />
                <meshStandardMaterial 
                  color={shadowColor}
                  opacity={definition * 0.5}
                  transparent
                />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* V-line (Oblíquos) */}
      {definition > 0.35 && (
        <group position={[0, 0.58, 0.115]}>
          <mesh position={[-0.08, 0, 0]} rotation={[0, 0, 0.45]}>
            <planeGeometry args={[0.12, 0.015]} />
            <meshStandardMaterial 
              color={shadowColor}
              opacity={definition * 0.65}
              transparent
            />
          </mesh>
          <mesh position={[0.08, 0, 0]} rotation={[0, 0, -0.45]}>
            <planeGeometry args={[0.12, 0.015]} />
            <meshStandardMaterial 
              color={shadowColor}
              opacity={definition * 0.65}
              transparent
            />
          </mesh>
        </group>
      )}

      {/* Quadril */}
      <mesh 
        position={[0, 0.52, 0]} 
        scale={[bodyScale * 1.05, 1, bodyScale]}
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[0.38, 0.18, 0.24]} />
        <meshStandardMaterial 
          color={skinColor}
          roughness={0.28}
        />
      </mesh>

      {/* Perna Esquerda (Quadríceps) */}
      <group position={[-0.12, 0.2, 0]}>
        <mesh 
          scale={[bodyScale * 1.3, 1, bodyScale * 1.3]}
          castShadow 
          receiveShadow
        >
          <capsuleGeometry args={[0.085, 0.62, 16, 32]} />
          <meshStandardMaterial 
            color={skinColor}
            roughness={0.25 - definition * 0.1}
            metalness={0.04}
          />
        </mesh>
        
        {/* Highlight quadríceps */}
        <mesh position={[0, 0.15, 0.09]} rotation={[-0.1, 0, 0]}>
          <ellipseGeometry args={[0.045 * bodyScale, 0.16, 16]} />
          <meshStandardMaterial 
            color={highlightColor}
            opacity={0.18 + muscle * 0.3}
            transparent
          />
        </mesh>

        {/* Panturrilha */}
        <mesh position={[0, -0.5, 0]} scale={[bodyScale, 1, bodyScale]} castShadow receiveShadow>
          <capsuleGeometry args={[0.065, 0.32, 16, 32]} />
          <meshStandardMaterial color={skinColor} roughness={0.3} />
        </mesh>
        
        {/* Pé */}
        <mesh position={[0, -0.72, 0.03]} rotation={[-0.1, 0, 0]} castShadow>
          <boxGeometry args={[0.06, 0.04, 0.12]} />
          <meshStandardMaterial color={skinColor} roughness={0.35} />
        </mesh>
      </group>

      {/* Perna Direita */}
      <group position={[0.12, 0.2, 0]}>
        <mesh 
          scale={[bodyScale * 1.3, 1, bodyScale * 1.3]}
          castShadow 
          receiveShadow
        >
          <capsuleGeometry args={[0.085, 0.62, 16, 32]} />
          <meshStandardMaterial 
            color={skinColor}
            roughness={0.25 - definition * 0.1}
            metalness={0.04}
          />
        </mesh>
        
        {/* Highlight quadríceps */}
        <mesh position={[0, 0.15, 0.09]} rotation={[-0.1, 0, 0]}>
          <ellipseGeometry args={[0.045 * bodyScale, 0.16, 16]} />
          <meshStandardMaterial 
            color={highlightColor}
            opacity={0.18 + muscle * 0.3}
            transparent
          />
        </mesh>

        {/* Panturrilha */}
        <mesh position={[0, -0.5, 0]} scale={[bodyScale, 1, bodyScale]} castShadow receiveShadow>
          <capsuleGeometry args={[0.065, 0.32, 16, 32]} />
          <meshStandardMaterial color={skinColor} roughness={0.3} />
        </mesh>
        
        {/* Pé */}
        <mesh position={[0, -0.72, 0.03]} rotation={[-0.1, 0, 0]} castShadow>
          <boxGeometry args={[0.06, 0.04, 0.12]} />
          <meshStandardMaterial color={skinColor} roughness={0.35} />
        </mesh>
      </group>

      {/* Sombras de contato no chão */}
      <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.3, 32]} />
        <meshStandardMaterial 
          color="#000000"
          opacity={0.2}
          transparent
        />
      </mesh>
    </group>
  );
}
