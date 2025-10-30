# 🎮 GUIA RÁPIDO - SIMULADOR 3D MUSCLEMAX

## 🚀 Como Usar

### Controles do Simulador

#### 🖱️ Mouse/Desktop:
- **Rotacionar**: Arraste com botão esquerdo
- **Zoom**: Scroll do mouse
- **Reset**: Botão ↻ no canto superior direito

#### 📱 Touch/Mobile:
- **Rotacionar**: Arraste com um dedo
- **Zoom**: Pinch (dois dedos)
- **Reset**: Toque no botão ↻

#### ⌨️ Teclado:
- **H**: Alternar para Homem
- **M**: Alternar para Mulher
- **↑/↓**: Ajustar slider focado (passo 0.05)
- **Tab**: Navegar entre controles

---

## 🎯 Funcionalidades

### 1️⃣ Seleção de Gênero
- **Homem** ou **Mulher**
- Troca instantânea do modelo
- Atalhos: Teclas H/M

### 2️⃣ Redução de Gordura Corporal
- **Range**: 0% a -8%
- Simula definição muscular
- Efeito visual em tempo real

### 3️⃣ Ganho de Massa Muscular
- **Range**: 0 kg a +5 kg
- Aumenta volume dos músculos
- Efeito proporcional em grupos específicos

### 4️⃣ Visualização 3D
- **Rotação 360°**: Veja todos os ângulos
- **Zoom inteligente**: Limites confortáveis
- **Auto-rotate**: Ativa após 5s de inatividade
- **Iluminação dinâmica**: Reage aos ajustes

### 5️⃣ Navegação
- **"Acessar Plataforma Completa"**: Vai para seção de Treinos/Exercícios
- Scroll suave e automático

---

## 🔧 Configuração Técnica

### Dependências Instaladas:
```json
{
  "@react-three/fiber": "^8.x",
  "@react-three/drei": "^9.x",
  "zustand": "^4.x",
  "three": "^0.172.0"
}
```

### Arquitetura:
```
components/
├── ShapeSimulator.jsx     → UI e controles principais
├── Scene3D.jsx            → Canvas e configuração 3D
└── Scene3DModel.jsx       → Modelo 3D (GLB ou fallback)

stores/
└── shapeSimStore.js       → Estado global (Zustand)

public/3d/
├── male_athlete.glb       → Modelo masculino (pendente)
├── female_athlete.glb     → Modelo feminino (pendente)
└── README.md              → Instruções dos modelos
```

---

## 📊 Performance

### Métricas Esperadas:
- **Desktop**: 60 FPS constante
- **Mobile**: 40+ FPS
- **Carregamento**: < 2s (fallback) / < 5s (GLB)
- **Interatividade**: < 16ms de resposta

### Otimizações Ativas:
- ✅ DPR adaptativo (1-2x)
- ✅ Suspense com lazy loading
- ✅ Damping nos controles
- ✅ Lerp suave nas transições
- ✅ WebGL high-performance mode

---

## 🎨 Personalização

### Ajustar Iluminação (Scene3D.jsx):
```jsx
<hemisphereLight intensity={0.6} /> // Luz ambiente
<directionalLight intensity={1.2} /> // Luz principal
<spotLight color="#FF6A3D" />       // Accent lights
```

### Ajustar Limites de Câmera:
```jsx
<OrbitControls
  minDistance={2.4}  // Zoom mínimo
  maxDistance={4.2}  // Zoom máximo
  minPolarAngle={0.9}  // Rotação vertical mín
  maxPolarAngle={2.3}  // Rotação vertical máx
/>
```

### Ajustar Ranges dos Sliders:
```jsx
// Em ShapeSimulator.jsx
const bfPercentage = (bf * 8).toFixed(1);  // 0-8%
const muscleKg = (muscle * 5).toFixed(1);  // 0-5kg
```

---

## 🐛 Troubleshooting

### Modelo não aparece?
1. Verifique console do navegador (F12)
2. Confirme que está na rota correta
3. Limpe cache: Ctrl+Shift+R (Win) / Cmd+Shift+R (Mac)

### Performance baixa?
1. Feche outras abas do navegador
2. Desabilite extensões pesadas
3. Atualize drivers de GPU

### Sliders não respondem?
1. Verifique se JavaScript está habilitado
2. Teste com teclado (↑/↓)
3. Hard refresh (Ctrl+F5)

---

## 🔮 Próximas Melhorias

### Em Desenvolvimento:
- [ ] Modelos GLB hiper-realistas
- [ ] Comparação antes/depois (split view)
- [ ] Animações de exercícios
- [ ] Export de imagem/vídeo
- [ ] Histórico de progressão

### Sugestões:
- [ ] Medidas corporais (cintura, peito, braço)
- [ ] Preset de objetivos (cutting, bulking, recomp)
- [ ] Integração com IA para sugestões
- [ ] Modo VR/AR

---

## 📞 Suporte

**Desenvolvido por**: MuscleMax Team  
**Tech Stack**: React + Three.js + Vite  
**Versão**: 1.0.0

---

## ✨ Enjoy your Digital Mirror!

**Transforme sua visão em realidade com o poder da visualização 3D.**
