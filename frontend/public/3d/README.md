# 🎯 MODELOS 3D - INSTRUÇÕES

## 📁 Localização dos Modelos

Os modelos 3D devem ser colocados em:
```
/Applications/tcc-fabio/frontend/public/3d/
```

## 📦 Arquivos Necessários

1. **male_athlete.glb** - Modelo masculino atlético
2. **female_athlete.glb** - Modelo feminino atlético

## ✅ Especificações dos Modelos

### Requisitos Técnicos:
- **Formato**: GLB (binário, otimizado)
- **Tamanho**: < 20MB cada
- **Mesh**: Único ou poucos submeshes
- **Materiais**: PBR com:
  - `roughness`: 0.2 - 0.35 (brilho limpo)
  - Normals corretos
  - AO (Ambient Occlusion) calculado
  
### Morph Targets (Blendshapes):
Se disponíveis, devem ter os nomes:
- **`bfDown`**: Redução de gordura corporal (-8%)
- **`muscleUp`**: Hipertrofia muscular (+5kg)

### Referência Visual:
- Proporções atléticas realistas
- Fibras musculares evidentes
- Definição anatômica clara
- Escala: ~1.70-1.80m de altura

## 🔧 Fallback Atual

Enquanto os modelos GLB não estiverem disponíveis, o sistema usa um **modelo procedural 3D** criado com geometrias primitivas do Three.js que:

- ✅ Responde aos sliders (BF e Massa)
- ✅ Permite rotação 360°
- ✅ Suporta zoom e interação touch
- ✅ Alterna entre gêneros
- ✅ Aplica scale e material adjustments

## 🚀 Como Testar com Modelos Reais

1. Coloque os arquivos `.glb` na pasta `/public/3d/`
2. Nomeie exatamente:
   - `male_athlete.glb`
   - `female_athlete.glb`
3. O componente `Scene3DModel.jsx` tentará carregá-los automaticamente
4. Se os modelos tiverem morph targets, serão aplicados automaticamente
5. Caso contrário, o fallback com scale será usado

## 🎨 Exportação Recomendada

### Blender:
1. Certifique-se de que os morph targets estão nomeados corretamente
2. Aplique todas as transformações
3. Exporte como GLB:
   - ☑ Apply Modifiers
   - ☑ Include Normals
   - ☑ Include Tangents (se houver normal maps)
   - ☑ Compression (Draco opcional, mas aumenta compatibilidade)

### Roughness/Metallic:
- Use **Principled BSDF**
- Roughness: 0.25 (base para pele)
- Metallic: 0.05
- Specular: 0.5

## 📊 Performance

Com os modelos corretos:
- Desktop: 60 FPS
- Mobile: 40+ FPS
- Carregamento: < 3s

## 🆘 Troubleshooting

**Modelo não aparece:**
- Verifique console do navegador
- Confirme nomes dos arquivos
- Valide se o GLB não está corrompido

**Morph targets não funcionam:**
- O sistema usará scale fallback automaticamente
- Nenhuma ação necessária

**Performance baixa:**
- Reduza polycount para < 50k vértices
- Otimize texturas (1024x1024 é suficiente)
- Use Draco compression na exportação

---

✨ **Status Atual**: Sistema funcionando com fallback procedural. Aguardando modelos GLB realistas.
