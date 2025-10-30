import { useState, useEffect, useRef } from 'react';

/**
 * Componente de Contadores de Impacto em Tempo Real
 * Números animados com efeito de contagem ao aparecer na tela
 */
export default function ImpactStats() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isVisible]);

  const stats = [
    { 
      value: 187, 
      suffix: '', 
      label: 'Alunos Transformados',
      icon: '✅'
    },
    { 
      value: 92, 
      suffix: '%', 
      label: 'Bateram PR em < 5 semanas',
      icon: '🔥'
    },
    { 
      value: 28, 
      suffix: '', 
      label: 'Transformações ativas agora',
      icon: '📈'
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-16 md:py-20 px-6 bg-gradient-to-br from-[#0D1117] via-[#151B23] to-[#0D1117]"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <StatCounter
              key={index}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              icon={stat.icon}
              isVisible={isVisible}
              delay={index * 150}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCounter({ value, suffix, label, icon, isVisible, delay }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 segundos
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setTimeout(() => {
      const counter = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(counter);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(counter);
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, value, delay]);

  return (
    <div 
      className={`
        text-center transform transition-all duration-700
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Ícone */}
      <div className="text-4xl md:text-5xl mb-4 animate-pulse">
        {icon}
      </div>
      
      {/* Número */}
      <div className="text-5xl md:text-6xl lg:text-7xl font-black mb-2 bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] bg-clip-text text-transparent">
        {count}{suffix}
      </div>
      
      {/* Label */}
      <div className="text-sm md:text-base text-[#C7D0DD] font-medium tracking-wide uppercase">
        {label}
      </div>
    </div>
  );
}
