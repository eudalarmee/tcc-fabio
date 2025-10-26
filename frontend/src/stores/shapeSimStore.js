import { create } from 'zustand';

export const useShapeSimStore = create((set) => ({
  gender: 'male', // 'male' | 'female'
  bf: 0, // 0..1 (0 = sem redução, 1 = -8% BF)
  muscle: 0, // 0..1 (0 = base, 1 = +5 kg)
  autoRotate: false,
  
  setGender: (gender) => set({ gender }),
  setBf: (bf) => set({ bf: Math.max(0, Math.min(1, bf)) }),
  setMuscle: (muscle) => set({ muscle: Math.max(0, Math.min(1, muscle)) }),
  setAutoRotate: (autoRotate) => set({ autoRotate }),
  reset: () => set({ bf: 0, muscle: 0, autoRotate: false }),
}));
