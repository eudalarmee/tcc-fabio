export default function Banner() {
  return (
    <section className="relative bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white text-center py-32 px-6 overflow-hidden">
      {/* Efeito de fundo sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500/5 via-transparent to-transparent"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-black mb-8 leading-none tracking-tight">
          <span 
            className="inline-block"
            style={{
              textShadow: '0 0 40px rgba(234, 179, 8, 0.6), 0 0 80px rgba(234, 179, 8, 0.3), 0 2px 4px rgba(0, 0, 0, 0.8)',
              filter: 'drop-shadow(0 0 20px rgba(234, 179, 8, 0.4))',
              WebkitTextStroke: '1px rgba(234, 179, 8, 0.3)'
            }}
          >
            SEJA
          </span>
          {' '}
          <span className="text-white">
            sua própria revolução.
          </span>
        </h1>
        
        <a
          href="/cadastro"
          className="inline-block mt-12 bg-yellow-500 text-black font-bold px-10 py-4 rounded-full shadow-xl hover:bg-yellow-400 hover:scale-105 transition-all duration-300 text-lg tracking-wide"
        >
          Comece Agora
        </a>
      </div>
    </section>
  );
}
