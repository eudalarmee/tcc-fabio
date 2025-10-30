import { useState, useEffect } from 'react';

/**
 * Hook para frases dinâmicas baseadas no horário
 * Retorna frase motivacional premium ajustada ao momento do dia
 */
export function useDynamicPhrase() {
  const [phrase, setPhrase] = useState('');

  useEffect(() => {
    const updatePhrase = () => {
      const hour = new Date().getHours();
      
      // Frases premium por faixa de horário
      const phrases = {
        earlyMorning: "A disciplina acorda antes do sol.", // 4-6h
        morning: "Hoje é o dia que os fracos vão desistir.", // 6-9h
        midMorning: "A excelência não negocia.", // 9-12h
        afternoon: "Resultados são construídos agora.", // 12-17h
        evening: "Os fracos descansam. Os lendários constroem.", // 17-21h
        night: "Performance não tem horário.", // 21-23h
        lateNight: "Enquanto o mundo dorme, a excelência nasce." // 23-4h
      };

      if (hour >= 4 && hour < 6) {
        setPhrase(phrases.earlyMorning);
      } else if (hour >= 6 && hour < 9) {
        setPhrase(phrases.morning);
      } else if (hour >= 9 && hour < 12) {
        setPhrase(phrases.midMorning);
      } else if (hour >= 12 && hour < 17) {
        setPhrase(phrases.afternoon);
      } else if (hour >= 17 && hour < 21) {
        setPhrase(phrases.evening);
      } else if (hour >= 21 && hour < 23) {
        setPhrase(phrases.night);
      } else {
        setPhrase(phrases.lateNight);
      }
    };

    updatePhrase();
    
    // Atualiza a cada minuto
    const interval = setInterval(updatePhrase, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return phrase;
}
