import { Root, Pin, Animation } from '@bsmnt/scrollytelling'
import voyagerProbe from './assets/voyager_probe.png'

function App() {
  return (
    <div className="scrolly-container">
      {/* 1. WELCOME HERO SECTION */}
      <section className="hero-section">
        <h1>Voyager 1</h1>
        <p>
          Em 1977, a humanidade lançou uma mensagem em uma garrafa ao oceano cósmico. 
          Rode a página para acompanhar a maior jornada de exploração da nossa história.
        </p>
        <span className="scroll-cue">Role para iniciar a viagem ↓</span>
      </section>

      {/* 2. SCROLLYTELLING CORE */}
      <Root start="top top" end="bottom bottom">
        <div className="scrolly-wrapper">
          {/* Pinned Visual Scene */}
          <Pin childHeight="100vh" pinSpacerHeight="500vh">
            <div className="viewport-scene">
              {/* Background elements */}
              <div className="space-background" />
              <div className="starfield" />

              {/* Earth Planet */}
              <div className="planet earth-planet" />

              {/* Jupiter Planet */}
              <div className="planet jupiter-planet" />

              {/* Saturn Planet Wrapper */}
              <div className="saturn-planet-wrapper">
                <div className="saturn-body" />
                <div className="saturn-rings" />
              </div>

              {/* Golden Record Container */}
              <div className="golden-record-container">
                <div className="golden-record">
                  <div className="golden-record-center" />
                </div>
              </div>

              {/* Voyager Spacecraft */}
              <div className="voyager-spacecraft">
                <img src={voyagerProbe} alt="Sonda Voyager 1" />
              </div>

              {/* Scrolling text cards overlay (sticky-pinned) */}
              <div className="scrolly-stories" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 20, pointerEvents: 'none' }}>
                {/* Step 1: Launch */}
                <div className="story-step align-left">
                  <div className="story-card" id="card-launch" style={{ opacity: 0 }}>
                    <span className="year">1977</span>
                    <h2>O Lançamento</h2>
                    <p>
                      A Voyager 1 é lançada ao espaço a bordo de um foguete Titan IIIE. 
                      Sua velocidade inicial supera qualquer veículo humano anterior, 
                      marcando o início de uma jornada eterna rumo ao desconhecido.
                    </p>
                  </div>
                </div>

                {/* Step 2: Jupiter */}
                <div className="story-step align-right">
                  <div className="story-card" id="card-jupiter" style={{ opacity: 0 }}>
                    <span className="year">1979</span>
                    <h2>Encontro com Júpiter</h2>
                    <p>
                      Aproximando-se do gigante gasoso, a Voyager 1 utiliza a gravidade 
                      de Júpiter como um "estilingue espacial", ganhando um impulso massivo 
                      de velocidade enquanto captura detalhes inéditos das tempestades jupiterianas.
                    </p>
                  </div>
                </div>

                {/* Step 3: Saturn */}
                <div className="story-step align-left">
                  <div className="story-card" id="card-saturn" style={{ opacity: 0 }}>
                    <span className="year">1980</span>
                    <h2>Os Anéis de Saturno</h2>
                    <p>
                      A sonda voa bem perto de Saturno e Titan, revelando a complexidade 
                      espetacular de seus anéis de gelo e poeira. A gravidade do planeta 
                      redireciona a Voyager para fora do plano do sistema solar.
                    </p>
                  </div>
                </div>

                {/* Step 4: Golden Record */}
                <div className="story-step align-right">
                  <div className="story-card" id="card-golden" style={{ opacity: 0 }}>
                    <span className="year">Mensagem Cósmica</span>
                    <h2>O Disco de Ouro</h2>
                    <p>
                      Acoplado à sonda, está o Disco de Ouro, gravado com saudações em 55 idiomas, 
                      sons da Terra, músicas de várias culturas e imagens do nosso mundo — uma 
                      carta de apresentação para quem quer que encontre a sonda no futuro distante.
                    </p>
                  </div>
                </div>

                {/* Step 5: Interstellar Space */}
                <div className="story-step align-center">
                  <div className="story-card" id="card-interstellar" style={{ opacity: 0 }}>
                    <span className="year">2012</span>
                    <h2>Espaço Interestelar</h2>
                    <p>
                      Ao cruzar a heliopausa, a Voyager 1 deixa a bolha magnética do Sol para trás, 
                      tornando-se o primeiro objeto criado pela humanidade a adentrar o oceano silencioso 
                      do espaço interestelar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Pin>

          {/* Declarative Scroll Animations for Visual Elements */}
          <Animation
            tween={[
              // Space Background Animation (Subtle Zoom & Pan)
              {
                target: '.space-background',
                start: 0,
                end: 100,
                to: { scale: 1.3, x: '-5%', y: '-3%', ease: 'none' }
              },
              // Earth Animation (Fades out and moves left)
              {
                target: '.earth-planet',
                start: 0,
                end: 15,
                fromTo: [
                  { scale: 1.0, opacity: 1, x: '25vw', y: '10vh' },
                  { scale: 0.1, opacity: 0, x: '-40vw', y: '5vh', ease: 'power1.inOut' }
                ]
              },
              // Jupiter Animation (Flyby: enters from right, zooms in, exits left)
              {
                target: '.jupiter-planet',
                start: 12,
                end: 42,
                fromTo: [
                  { scale: 0.1, opacity: 0, x: '50vw', y: '-20vh' },
                  { scale: 1.3, opacity: 1, x: '-15vw', y: '5vh', ease: 'power1.out' }
                ]
              },
              {
                target: '.jupiter-planet',
                start: 42,
                end: 50,
                to: { scale: 0.1, opacity: 0, x: '-50vw', y: '20vh', ease: 'power1.in' }
              },
              // Saturn Animation (Flyby: enters from lower left, tilts, exits upper right)
              {
                target: '.saturn-planet-wrapper',
                start: 40,
                end: 70,
                fromTo: [
                  { scale: 0.1, opacity: 0, x: '-50vw', y: '30vh', rotate: 15 },
                  { scale: 1.1, opacity: 1, x: '10vw', y: '-5vh', rotate: -10, ease: 'power1.out' }
                ]
              },
              {
                target: '.saturn-planet-wrapper',
                start: 70,
                end: 78,
                to: { scale: 0.1, opacity: 0, x: '50vw', y: '-30vh', rotate: -30, ease: 'power1.in' }
              },
              // Golden Record Animation (Spinning showcase in center)
              {
                target: '.golden-record-container',
                start: 68,
                end: 85,
                fromTo: [
                  { scale: 0, opacity: 0, rotate: -180 },
                  { scale: 1.1, opacity: 1, rotate: 360, ease: 'back.out(1.2)' }
                ]
              },
              {
                target: '.golden-record-container',
                start: 85,
                end: 92,
                to: { scale: 0, opacity: 0, rotate: 540, ease: 'power2.in' }
              },
              // Voyager Spacecraft Complex Trajectory
              // Phase 1: Leaving Earth
              {
                target: '.voyager-spacecraft',
                start: 0,
                end: 18,
                fromTo: [
                  { scale: 0.25, rotate: -25, x: '-20vw', y: '15vh' },
                  { scale: 0.55, rotate: 10, x: '0vw', y: '0vh', ease: 'power1.out' }
                ]
              },
              // Phase 2: Jupiter swing-by (gravity assist acceleration)
              {
                target: '.voyager-spacecraft',
                start: 20,
                end: 38,
                to: { scale: 1.1, rotate: -40, x: '25vw', y: '-15vh', ease: 'power2.inOut' }
              },
              // Phase 3: Cruising to Saturn
              {
                target: '.voyager-spacecraft',
                start: 38,
                end: 45,
                to: { scale: 0.6, rotate: 15, x: '-30vw', y: '20vh', ease: 'power1.inOut' }
              },
              // Phase 4: Saturn flyby
              {
                target: '.voyager-spacecraft',
                start: 48,
                end: 65,
                to: { scale: 0.9, rotate: -60, x: '5vw', y: '-10vh', ease: 'power2.out' }
              },
              // Phase 5: Approaching Interstellar, moving aside for Golden Record
              {
                target: '.voyager-spacecraft',
                start: 68,
                end: 82,
                to: { scale: 0.4, rotate: 20, x: '32vw', y: '22vh', opacity: 0.5, ease: 'power1.inOut' }
              },
              // Phase 6: Deep interstellar space
              {
                target: '.voyager-spacecraft',
                start: 85,
                end: 100,
                to: { scale: 0.18, rotate: 135, x: '-5vw', y: '-10vh', opacity: 0.9, ease: 'power1.inOut' }
              }
            ]}
          />

          {/* Declarative Scroll Animations for Story text cards */}
          <Animation
            tween={[
              { target: '#card-launch', start: 0, end: 4, to: { opacity: 1 } },
              { target: '#card-launch', start: 12, end: 16, to: { opacity: 0, y: -40 } },
              
              { target: '#card-jupiter', start: 16, end: 20, fromTo: [{ opacity: 0, y: 40 }, { opacity: 1, y: 0 }] },
              { target: '#card-jupiter', start: 36, end: 40, to: { opacity: 0, y: -40 } },
              
              { target: '#card-saturn', start: 42, end: 46, fromTo: [{ opacity: 0, y: 40 }, { opacity: 1, y: 0 }] },
              { target: '#card-saturn', start: 62, end: 66, to: { opacity: 0, y: -40 } },
              
              { target: '#card-golden', start: 68, end: 72, fromTo: [{ opacity: 0, y: 40 }, { opacity: 1, y: 0 }] },
              { target: '#card-golden', start: 82, end: 86, to: { opacity: 0, y: -40 } },
              
              { target: '#card-interstellar', start: 88, end: 92, fromTo: [{ opacity: 0, y: 40 }, { opacity: 1, y: 0 }] }
            ]}
          />
        </div>
      </Root>

      {/* 3. CONCLUSION FOOTER */}
      <section className="footer-section">
        <h2>Rumo ao Infinito</h2>
        <p style={{ maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
          Hoje, a Voyager 1 continua sua viagem silenciosa na escuridão interestelar, a mais de 
          24 bilhões de quilômetros da Terra. Ela sobreviverá aos planetas, ao Sol e, possivelmente, 
          à própria humanidade, como um testemunho eterno da nossa curiosidade.
        </p>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className="restart-button"
        >
          Reiniciar Viagem
        </button>
      </section>
    </div>
  )
}

export default App
