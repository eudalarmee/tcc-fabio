# 📐 ESPECIFICAÇÕES TÉCNICAS - SIMULADOR 3D

## 🎯 Arquitetura do Sistema

### Stack Tecnológico
```
React 19.0.0
├── Three.js 0.172.0
├── @react-three/fiber (R3F)
├── @react-three/drei
├── Zustand 4.x
├── React Router DOM 7.6.2
└── Vite 6.3.1
```

---

## 📊 Estrutura de State (Zustand)

### Store: `shapeSimStore`

```typescript
interface ShapeSimStore {
  gender: 'male' | 'female';      // Gênero do modelo
  bf: number;                      // 0..1 (BF reduction)
  muscle: number;                  // 0..1 (muscle gain)
  autoRotate: boolean;             // Auto-rotate estado
  
  // Actions
  setGender: (gender) => void;
  setBf: (bf) => void;            // Auto-clamp 0-1
  setMuscle: (muscle) => void;    // Auto-clamp 0-1
  setAutoRotate: (bool) => void;
  reset: () => void;              // Zera bf, muscle, autoRotate
}
```

### Conversões para Display
```javascript
const bfPercentage = bf * 8;      // 0-8%
const muscleKg = muscle * 5;      // 0-5 kg
```

---

## 🎨 Sistema de Iluminação (Scene3D.jsx)

### Configuração Premium
```jsx
// Luz ambiente hemisférica
<hemisphereLight 
  intensity={0.6} 
  color="#ffffff" 
  groundColor="#1a1a2e" 
/>

// Key light (principal) com sombras
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

// Rim light (recorte traseiro)
<spotLight 
  position={[-3, 3, -4]} 
  angle={0.5} 
  penumbra={1} 
  intensity={0.4} 
  color="#FF6A3D" 
/>

// Fill light (frontal suave)
<pointLight 
  position={[0, 2, 4]} 
  intensity={0.3} 
  color="#ffffff" 
/>

// Accent light (lateral colorido)
<spotLight 
  position={[4, 2, 2]} 
  angle={0.6} 
  penumbra={1} 
  intensity={0.35} 
  color="#FF1493" 
/>
```

### Intensidade Total
```
Ambient: 0.6
Key: 1.2
Rim: 0.4
Fill: 0.3
Accent: 0.35
─────────────
Total: ~2.85
```

---

## 📷 Configuração de Câmera

### PerspectiveCamera
```jsx
<PerspectiveCamera 
  makeDefault 
  position={[0, 1.7, 3.2]}  // x, y, z
  fov={38}                   // Field of view
  near={0.1}                 // Near clipping
  far={1000}                 // Far clipping
/>
```

### OrbitControls
```jsx
<OrbitControls
  // Comportamento
  enablePan={false}
  enableZoom={true}
  enableRotate={true}
  enableDamping={true}
  dampingFactor={0.05}
  
  // Limites de zoom
  minDistance={2.4}
  maxDistance={4.2}
  
  // Limites de rotação vertical
  minPolarAngle={0.9}   // ~51.5°
  maxPolarAngle={2.3}   // ~131.8°
  
  // Auto-rotate
  autoRotate={autoRotate && !prefersReducedMotion}
  autoRotateSpeed={0.5}
  
  // Velocidades
  rotateSpeed={0.8}
  zoomSpeed={0.8}
  
  // Target (lookAt)
  target={[0, 0.8, 0]}
/>
```

---

## 🎭 Sistema de Materiais (PBR)

### Pele Base
```javascript
const skinMaterial = {
  color: gender === 'male' ? '#A67C52' : '#C4A57B',
  roughness: 0.25,
  metalness: 0.02,
  envMapIntensity: 1.0
}
```

### Pele com Definição (BF alto)
```javascript
const definedSkinMaterial = {
  color: skinColor,
  roughness: 0.25 - (bf * 0.18),  // 0.25 → 0.07
  metalness: 0.02 + (bf * 0.08),  // 0.02 → 0.10
  envMapIntensity: 1.0 + (bf * 0.5)
}
```

### Sombras de Definição
```javascript
const shadowMaterial = {
  color: gender === 'male' ? '#6B4423' : '#8B6F47',
  opacity: bf * 0.7,
  transparent: true
}
```

### Highlights Musculares
```javascript
const highlightMaterial = {
  color: '#E8D4B8',
  opacity: 0.15 + (muscle * 0.35),
  transparent: true,
  emissive: '#E8D4B8',
  emissiveIntensity: 0.05
}
```

---

## 💪 Sistema de Escalas Musculares

### Grupos e Multiplicadores

```javascript
const muscleGroups = {
  shoulders: {
    baseScale: 1.0,
    multiplier: { x: 1.4, y: 1.0, z: 1.4 }  // +40% lateral
  },
  chest: {
    baseScale: 1.0,
    multiplier: { x: 1.25, y: 1.0, z: 1.15 } // +25% largura
  },
  arms: {
    baseScale: 1.0,
    multiplier: { x: 1.35, y: 1.0, z: 1.35 } // +35% volume
  },
  core: {
    baseScale: 1.0,
    multiplier: { x: 0.95, y: 1.0, z: 0.85 } // -5% (definição)
  },
  legs: {
    baseScale: 1.0,
    multiplier: { x: 1.3, y: 1.0, z: 1.3 }  // +30% volume
  }
}

// Aplicação
const finalScale = {
  x: baseScale.x * (1 + muscle * multiplier.x),
  y: baseScale.y * (1 + muscle * multiplier.y),
  z: baseScale.z * (1 + muscle * multiplier.z)
}
```

---

## 🎯 Sistema de Definição Muscular

### Threshold de Visibilidade

```javascript
// Six-pack
if (bf > 0.2) {
  renderAbdomenDefinition();
}

// V-line (oblíquos)
if (bf > 0.35) {
  renderVlineDefinition();
}

// Striations (geral)
if (bf > 0.3) {
  renderMuscleStriations();
}
```

### Opacidade Progressiva
```javascript
const shadowOpacity = bf * 0.7;       // 0 → 0.7
const highlightOpacity = muscle * 0.35; // 0 → 0.35
```

---

## ⚡ Otimizações de Performance

### WebGL Context
```javascript
gl={{
  antialias: true,
  alpha: false,
  powerPreference: 'high-performance',
  stencil: false,
  depth: true
}}
```

### DPR Adaptativo
```javascript
dpr={[1, 2]}  // Min 1x, Max 2x (retina)
```

### Shadow Map Size
```javascript
shadow-mapSize={[2048, 2048]}  // Alta qualidade
```

### Geometry Segments
```javascript
// Cabeça (alta qualidade)
<sphereGeometry args={[radius, 32, 32]} />

// Corpo (média qualidade)
<capsuleGeometry args={[radius, height, 16, 32]} />

// Detalhes (baixa qualidade)
<planeGeometry args={[width, height, 1, 1]} />
```

---

## 🔄 Sistema de Transições

### Lerp (Linear Interpolation)
```javascript
// Em useFrame
mesh.scale.lerp(targetScale, delta * 5);
// Velocidade: 5 unidades/segundo
// Suaviza movimentos bruscos
```

### Damping (OrbitControls)
```javascript
dampingFactor={0.05}
// 5% de damping = movimento fluido
```

### CSS Transitions
```css
transition-all duration-300  /* Sliders */
transition-all duration-700  /* Luzes */
```

---

## 📱 Responsividade

### Breakpoints
```css
/* Mobile */
@media (max-width: 768px) {
  aspect-ratio: 3/4;
  fov: 42;
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  aspect-ratio: 4/3;
  fov: 40;
}

/* Desktop */
@media (min-width: 1025px) {
  aspect-ratio: 4/3;
  fov: 38;
}
```

### Touch Controls
```javascript
// Eventos suportados
onPointerDown    // Mouse + Touch
onWheel          // Desktop scroll
onTouchStart     // Mobile touch
onTouchMove      // Mobile drag
```

---

## 🎮 Eventos e Interações

### Inatividade Timer
```javascript
const INACTIVITY_TIMEOUT = 5000; // 5 segundos

const resetInactivityTimer = () => {
  setAutoRotate(false);
  clearTimeout(inactivityTimerRef.current);
  
  inactivityTimerRef.current = setTimeout(() => {
    setAutoRotate(true);
  }, INACTIVITY_TIMEOUT);
};
```

### Keyboard Shortcuts
```javascript
// Gênero
'h' | 'H' → setGender('male')
'm' | 'M' → setGender('female')

// Sliders (quando focado)
'ArrowUp' | 'ArrowRight' → +0.05
'ArrowDown' | 'ArrowLeft' → -0.05

// Navegação
'Tab' → Next focusable element
```

---

## 🌐 URLs e Navegação

### Rotas
```javascript
// Home
path: '/'

// Exercícios (Treinos)
path: '/exercicios'
id: 'treinos'

// Navegação do CTA
navigate('/exercicios')
```

---

## 📏 Dimensões e Proporções

### Modelo 3D (Unity Units)
```
Altura total: ~1.75 units
├── Cabeça: 0.14 radius
├── Tronco: 0.80 height
├── Braços: 0.80 length
└── Pernas: 1.12 length

Posição base: [0, -0.9, 0]
Escala global: 1.1
```

### Canvas
```css
aspect-ratio: 4/3
width: 100%
max-width: 1200px
border-radius: 24px
```

---

## 🎨 Paleta de Cores

### Gradientes Principais
```css
/* CTA Button */
from: #FF6A3D
to: #FF1493

/* Headings */
from: #FF6A3D
via: #FF1493
to: #FF6A3D

/* Backgrounds */
from: #0D1117
via: #151B23
to: #0D1117
```

### Skin Tones
```css
/* Masculino */
base: #A67C52
shadow: #6B4423
highlight: #E8D4B8

/* Feminino */
base: #C4A57B
shadow: #8B6F47
highlight: #E8D4B8
```

---

## 🔍 Debug & Monitoring

### Console Logs (Dev Mode)
```javascript
// Carregamento de modelo
console.warn('Modelo 3D não encontrado, usando fallback');

// Erros
console.error('Falha ao carregar GLB:', error);
```

### Performance Monitoring
```javascript
// FPS (via DevTools)
chrome://performance

// GPU Stats (via Stats.js)
import Stats from 'three/examples/jsm/libs/stats.module'
```

---

## 📦 Build & Deploy

### Desenvolvimento
```bash
npm run dev
# http://localhost:5173
```

### Build Produção
```bash
npm run build
# Output: /dist
```

### Preview
```bash
npm run preview
# http://localhost:4173
```

---

## 🔐 Compatibilidade

### Browsers Suportados
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Devices Testados
- ✅ Desktop (Windows/Mac/Linux)
- ✅ Mobile (iOS/Android)
- ✅ Tablet (iPad/Surface)

### WebGL
- Requerido: WebGL 2.0
- Fallback: WebGL 1.0

---

## 📚 Referências

### Documentação
- [Three.js Docs](https://threejs.org/docs)
- [R3F Docs](https://docs.pmnd.rs/react-three-fiber)
- [Drei Docs](https://github.com/pmndrs/drei)
- [Zustand Docs](https://github.com/pmndrs/zustand)

### Assets
- Modelos GLB: `/public/3d/`
- README: `/public/3d/README.md`

---

**Especificações v1.0.0**  
**Última atualização**: 25/10/2025
