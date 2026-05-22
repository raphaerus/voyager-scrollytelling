import { useState, useEffect } from 'react'
import { Root, Pin, Animation } from '@bsmnt/scrollytelling'
import voyagerProbe from './assets/voyager_probe.png'

interface ElementProperties {
  x: number; // in vw
  y: number; // in vh
  scale: number;
  rotate: number;
  opacity: number;
}

interface Keyframe extends ElementProperties {
  progress: number; // 0 to 100
}

type KeyframesData = Record<string, Keyframe[]>;

const defaultKeyframes: KeyframesData = {
  voyager: [
    { progress: 0, x: -20, y: 15, scale: 0.25, rotate: -25, opacity: 1 },
    { progress: 18, x: 0, y: 0, scale: 0.55, rotate: 10, opacity: 1 },
    { progress: 20, x: 0, y: 0, scale: 0.55, rotate: 10, opacity: 1 },
    { progress: 38, x: 25, y: -15, scale: 1.1, rotate: -40, opacity: 1 },
    { progress: 45, x: -30, y: 20, scale: 0.6, rotate: 15, opacity: 1 },
    { progress: 48, x: -30, y: 20, scale: 0.6, rotate: 15, opacity: 1 },
    { progress: 65, x: 5, y: -10, scale: 0.9, rotate: -60, opacity: 1 },
    { progress: 68, x: 5, y: -10, scale: 0.9, rotate: -60, opacity: 1 },
    { progress: 82, x: 32, y: 22, scale: 0.4, rotate: 20, opacity: 0.5 },
    { progress: 85, x: 32, y: 22, scale: 0.4, rotate: 20, opacity: 0 },
    { progress: 100, x: -5, y: -10, scale: 0.18, rotate: 135, opacity: 0.9 }
  ],
  earth: [
    { progress: 0, x: 25, y: 10, scale: 1.0, rotate: 0, opacity: 1 },
    { progress: 15, x: -40, y: 5, scale: 0.1, rotate: 0, opacity: 0 },
    { progress: 100, x: -40, y: 5, scale: 0.1, rotate: 0, opacity: 0 }
  ],
  jupiter: [
    { progress: 0, x: 50, y: -20, scale: 0.1, rotate: 0, opacity: 0 },
    { progress: 12, x: 50, y: -20, scale: 0.1, rotate: 0, opacity: 0 },
    { progress: 42, x: -15, y: 5, scale: 1.3, rotate: 0, opacity: 1 },
    { progress: 50, x: -50, y: 20, scale: 0.1, rotate: 0, opacity: 0 },
    { progress: 100, x: -50, y: 20, scale: 0.1, rotate: 0, opacity: 0 }
  ],
  saturn: [
    { progress: 0, x: -50, y: 30, scale: 0.1, rotate: 15, opacity: 0 },
    { progress: 40, x: -50, y: 30, scale: 0.1, rotate: 15, opacity: 0 },
    { progress: 70, x: 10, y: -5, scale: 1.1, rotate: -10, opacity: 1 },
    { progress: 78, x: 50, y: -30, scale: 0.1, rotate: -30, opacity: 0 },
    { progress: 100, x: 50, y: -30, scale: 0.1, rotate: -30, opacity: 0 }
  ],
  golden: [
    { progress: 0, x: 0, y: 0, scale: 0, rotate: -180, opacity: 0 },
    { progress: 68, x: 0, y: 0, scale: 0, rotate: -180, opacity: 0 },
    { progress: 85, x: 0, y: 0, scale: 1.1, rotate: 360, opacity: 1 },
    { progress: 92, x: 0, y: 0, scale: 0, rotate: 540, opacity: 0 },
    { progress: 100, x: 0, y: 0, scale: 0, rotate: 540, opacity: 0 }
  ]
};

function interpolateProperty(keyframes: Keyframe[], progress: number): ElementProperties {
  if (keyframes.length === 0) {
    return { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 };
  }
  
  const sorted = [...keyframes].sort((a, b) => a.progress - b.progress);
  
  let k1 = sorted[0];
  let k2 = sorted[sorted.length - 1];
  
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].progress <= progress) {
      k1 = sorted[i];
    }
  }
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].progress >= progress) {
      k2 = sorted[i];
    }
  }
  
  if (k1.progress === k2.progress) {
    return { x: k1.x, y: k1.y, scale: k1.scale, rotate: k1.rotate, opacity: k1.opacity };
  }
  
  const t = (progress - k1.progress) / (k2.progress - k1.progress);
  
  return {
    x: parseFloat((k1.x + t * (k2.x - k1.x)).toFixed(2)),
    y: parseFloat((k1.y + t * (k2.y - k1.y)).toFixed(2)),
    scale: parseFloat((k1.scale + t * (k2.scale - k1.scale)).toFixed(3)),
    rotate: parseFloat((k1.rotate + t * (k2.rotate - k1.rotate)).toFixed(1)),
    opacity: parseFloat((k1.opacity + t * (k2.opacity - k1.opacity)).toFixed(2)),
  };
}

function getCardOpacity(cardId: string, progress: number): number {
  switch (cardId) {
    case 'launch':
      if (progress < 4) return progress / 4;
      if (progress >= 4 && progress <= 12) return 1;
      if (progress > 12 && progress <= 16) return 1 - (progress - 12) / 4;
      return 0;
    case 'jupiter':
      if (progress < 16) return 0;
      if (progress >= 16 && progress < 20) return (progress - 16) / 4;
      if (progress >= 20 && progress <= 36) return 1;
      if (progress > 36 && progress <= 40) return 1 - (progress - 36) / 4;
      return 0;
    case 'saturn':
      if (progress < 42) return 0;
      if (progress >= 42 && progress < 46) return (progress - 42) / 4;
      if (progress >= 46 && progress <= 62) return 1;
      if (progress > 62 && progress <= 66) return 1 - (progress - 62) / 4;
      return 0;
    case 'golden':
      if (progress < 68) return 0;
      if (progress >= 68 && progress < 72) return (progress - 68) / 4;
      if (progress >= 72 && progress <= 82) return 1;
      if (progress > 82 && progress <= 86) return 1 - (progress - 82) / 4;
      return 0;
    case 'interstellar':
      if (progress < 88) return 0;
      if (progress >= 88 && progress < 92) return (progress - 88) / 4;
      if (progress >= 92) return 1;
      return 0;
    default:
      return 0;
  }
}

function App() {
  const [sandboxMode, setSandboxMode] = useState(false);
  const [sandboxProgress, setSandboxProgress] = useState(0);
  const [activeElement, setActiveElement] = useState<'voyager' | 'earth' | 'jupiter' | 'saturn' | 'golden'>('voyager');
  const [keyframes, setKeyframes] = useState<KeyframesData>(defaultKeyframes);
  const [copied, setCopied] = useState(false);

  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    startX: number;
    startY: number;
    startCoordX: number;
    startCoordY: number;
  } | null>(null);

  // Smoothly lock body scroll when in sandbox mode
  useEffect(() => {
    if (sandboxMode) {
      document.body.classList.add('sandbox-active');
    } else {
      document.body.classList.remove('sandbox-active');
    }
    return () => {
      document.body.classList.remove('sandbox-active');
    };
  }, [sandboxMode]);

  // Update properties on keyframes
  const updateActiveElementProperty = (property: keyof ElementProperties, value: number) => {
    setKeyframes(prev => {
      const list = prev[activeElement] || [];
      const index = list.findIndex(k => k.progress === sandboxProgress);
      const newList = [...list];
      
      if (index !== -1) {
        newList[index] = {
          ...newList[index],
          [property]: value
        };
      } else {
        const currentValues = interpolateProperty(list, sandboxProgress);
        const newKeyframe: Keyframe = {
          progress: sandboxProgress,
          ...currentValues,
          [property]: value
        };
        newList.push(newKeyframe);
        newList.sort((a, b) => a.progress - b.progress);
      }
      return {
        ...prev,
        [activeElement]: newList
      };
    });
  };

  const updateActiveElementXY = (x: number, y: number) => {
    setKeyframes(prev => {
      const list = prev[activeElement] || [];
      const index = list.findIndex(k => k.progress === sandboxProgress);
      const newList = [...list];
      
      if (index !== -1) {
        newList[index] = {
          ...newList[index],
          x,
          y
        };
      } else {
        const currentValues = interpolateProperty(list, sandboxProgress);
        const newKeyframe: Keyframe = {
          progress: sandboxProgress,
          ...currentValues,
          x,
          y
        };
        newList.push(newKeyframe);
        newList.sort((a, b) => a.progress - b.progress);
      }
      return {
        ...prev,
        [activeElement]: newList
      };
    });
  };

  const deleteKeyframe = (progressToDelete: number) => {
    // Keep at least boundary keyframes 0 and 100
    if (progressToDelete === 0 || progressToDelete === 100) return;
    setKeyframes(prev => {
      const list = prev[activeElement] || [];
      const filtered = list.filter(k => k.progress !== progressToDelete);
      return {
        ...prev,
        [activeElement]: filtered
      };
    });
  };

  const resetActiveElement = () => {
    setKeyframes(prev => ({
      ...prev,
      [activeElement]: defaultKeyframes[activeElement]
    }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sandboxMode) return;
    e.preventDefault();
    const currentValues = interpolateProperty(keyframes[activeElement], sandboxProgress);
    setDragState({
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startCoordX: currentValues.x,
      startCoordY: currentValues.y,
    });
  };

  // Drag and drop event listeners
  useEffect(() => {
    if (!dragState) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState.isDragging) return;
      const dx = e.clientX - dragState.startX;
      const dy = e.clientY - dragState.startY;
      
      // Calculate delta in viewport coordinates
      const dxVal = (dx / window.innerWidth) * 100;
      const dyVal = (dy / window.innerHeight) * 100;
      
      const newX = parseFloat((dragState.startCoordX + dxVal).toFixed(2));
      const newY = parseFloat((dragState.startCoordY + dyVal).toFixed(2));
      
      updateActiveElementXY(newX, newY);
    };

    const handleMouseUp = () => {
      setDragState(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, sandboxProgress, activeElement]);

  // Compute interpolated properties for the current progress
  const voyagerProps = interpolateProperty(keyframes.voyager, sandboxProgress);
  const earthProps = interpolateProperty(keyframes.earth, sandboxProgress);
  const jupiterProps = interpolateProperty(keyframes.jupiter, sandboxProgress);
  const saturnProps = interpolateProperty(keyframes.saturn, sandboxProgress);
  const goldenProps = interpolateProperty(keyframes.golden, sandboxProgress);

  const activeValues = {
    voyager: voyagerProps,
    earth: earthProps,
    jupiter: jupiterProps,
    saturn: saturnProps,
    golden: goldenProps
  }[activeElement];

  // Generate code block
  const generateGSAPCode = () => {
    const list = keyframes[activeElement] || [];
    const sorted = [...list].sort((a, b) => a.progress - b.progress);
    
    const targetMap = {
      voyager: '.voyager-spacecraft',
      earth: '.earth-planet',
      jupiter: '.jupiter-planet',
      saturn: '.saturn-planet-wrapper',
      golden: '.golden-record-container'
    };
    
    const targetClass = targetMap[activeElement];
    let code = `// Animação para ${activeElement.toUpperCase()}\n`;
    
    if (sorted.length < 2) {
      return code + `// Adicione pelo menos 2 keyframes!`;
    }

    for (let i = 0; i < sorted.length - 1; i++) {
      const k1 = sorted[i];
      const k2 = sorted[i + 1];
      
      // Check if values change
      const isHold = k1.x === k2.x && k1.y === k2.y && k1.scale === k2.scale && k1.rotate === k2.rotate && k1.opacity === k2.opacity;
      if (isHold) continue;

      if (i === 0) {
        code += `{\n`;
        code += `  target: '${targetClass}',\n`;
        code += `  start: ${k1.progress},\n`;
        code += `  end: ${k2.progress},\n`;
        code += `  fromTo: [\n`;
        code += `    { scale: ${k1.scale}, rotate: ${k1.rotate}, x: '${k1.x}vw', y: '${k1.y}vh', opacity: ${k1.opacity} },\n`;
        code += `    { scale: ${k2.scale}, rotate: ${k2.rotate}, x: '${k2.x}vw', y: '${k2.y}vh', opacity: ${k2.opacity}, ease: 'power1.inOut' }\n`;
        code += `  ]\n`;
        code += `},\n`;
      } else {
        code += `{\n`;
        code += `  target: '${targetClass}',\n`;
        code += `  start: ${k1.progress},\n`;
        code += `  end: ${k2.progress},\n`;
        code += `  to: { scale: ${k2.scale}, rotate: ${k2.rotate}, x: '${k2.x}vw', y: '${k2.y}vh', opacity: ${k2.opacity}, ease: 'power1.inOut' }\n`;
        code += `},\n`;
      }
    }
    return code.trim();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateGSAPCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="scrolly-container">
      {/* Visual Editor Toggle Button */}
      <button 
        className="editor-toggle-btn"
        onClick={() => setSandboxMode(!sandboxMode)}
      >
        {sandboxMode ? "Voltar para o Site" : "Abrir Editor Visual"}
      </button>

      {/* RENDER MODE A: SANDBOX PREVIEW */}
      {sandboxMode ? (
        <div className="viewport-scene" style={{ height: '100vh', width: '100vw', position: 'relative' }}>
          {/* Background elements */}
          <div className="space-background" style={{ transform: `scale(1.1)`, opacity: 0.75 }} />
          <div className="starfield" />

          {/* Earth Planet */}
          <div 
            className={`planet earth-planet ${activeElement === 'earth' ? 'sandbox-draggable' : ''}`}
            style={{
              transform: `translate(${earthProps.x}vw, ${earthProps.y}vh) scale(${earthProps.scale})`,
              opacity: earthProps.opacity,
              pointerEvents: activeElement === 'earth' ? 'auto' : 'none',
            }}
            onMouseDown={activeElement === 'earth' ? handleMouseDown : undefined}
          />

          {/* Jupiter Planet */}
          <div 
            className={`planet jupiter-planet ${activeElement === 'jupiter' ? 'sandbox-draggable' : ''}`}
            style={{
              transform: `translate(${jupiterProps.x}vw, ${jupiterProps.y}vh) scale(${jupiterProps.scale})`,
              opacity: jupiterProps.opacity,
              pointerEvents: activeElement === 'jupiter' ? 'auto' : 'none',
            }}
            onMouseDown={activeElement === 'jupiter' ? handleMouseDown : undefined}
          />

          {/* Saturn Planet Wrapper */}
          <div 
            className={`saturn-planet-wrapper ${activeElement === 'saturn' ? 'sandbox-draggable' : ''}`}
            style={{
              transform: `translate(${saturnProps.x}vw, ${saturnProps.y}vh) scale(${saturnProps.scale}) rotate(${saturnProps.rotate}deg)`,
              opacity: saturnProps.opacity,
              pointerEvents: activeElement === 'saturn' ? 'auto' : 'none',
            }}
            onMouseDown={activeElement === 'saturn' ? handleMouseDown : undefined}
          >
            <div className="saturn-body" />
            <div className="saturn-rings" />
          </div>

          {/* Golden Record Container */}
          <div 
            className={`golden-record-container ${activeElement === 'golden' ? 'sandbox-draggable' : ''}`}
            style={{
              transform: `translate(${goldenProps.x}vw, ${goldenProps.y}vh) scale(${goldenProps.scale}) rotate(${goldenProps.rotate}deg)`,
              opacity: goldenProps.opacity,
              pointerEvents: activeElement === 'golden' ? 'auto' : 'none',
            }}
            onMouseDown={activeElement === 'golden' ? handleMouseDown : undefined}
          >
            <div className="golden-record">
              <div className="golden-record-center" />
            </div>
          </div>

          {/* Voyager Spacecraft */}
          <div 
            className={`voyager-spacecraft ${activeElement === 'voyager' ? 'sandbox-draggable' : ''}`}
            style={{
              transform: `translate(${voyagerProps.x}vw, ${voyagerProps.y}vh) scale(${voyagerProps.scale}) rotate(${voyagerProps.rotate}deg)`,
              opacity: voyagerProps.opacity,
              pointerEvents: activeElement === 'voyager' ? 'auto' : 'none',
            }}
            onMouseDown={activeElement === 'voyager' ? handleMouseDown : undefined}
          >
            <img src={voyagerProbe} alt="Sonda Voyager 1" />
          </div>

          {/* Scrolling text cards overlay (interpolated visual) */}
          <div className="scrolly-stories" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 20, pointerEvents: 'none' }}>
            <div className="story-step align-left">
              <div className="story-card" id="card-launch" style={{ opacity: getCardOpacity('launch', sandboxProgress) }}>
                <span className="year">1977</span>
                <h2>O Lançamento</h2>
                <p>A Voyager 1 é lançada ao espaço a bordo de um foguete Titan IIIE.</p>
              </div>
            </div>

            <div className="story-step align-right">
              <div className="story-card" id="card-jupiter" style={{ opacity: getCardOpacity('jupiter', sandboxProgress) }}>
                <span className="year">1979</span>
                <h2>Encontro com Júpiter</h2>
                <p>A Voyager 1 utiliza a gravidade de Júpiter como um "estilingue espacial".</p>
              </div>
            </div>

            <div className="story-step align-left">
              <div className="story-card" id="card-saturn" style={{ opacity: getCardOpacity('saturn', sandboxProgress) }}>
                <span className="year">1980</span>
                <h2>Os Anéis de Saturno</h2>
                <p>A sonda voa perto de Saturno, revelando a complexidade de seus anéis.</p>
              </div>
            </div>

            <div className="story-step align-right">
              <div className="story-card" id="card-golden" style={{ opacity: getCardOpacity('golden', sandboxProgress) }}>
                <span className="year">Mensagem Cósmica</span>
                <h2>O Disco de Ouro</h2>
                <p>Acoplado à sonda, está o Disco de Ouro, gravado com saudações da Terra.</p>
              </div>
            </div>

            <div className="story-step align-center">
              <div className="story-card" id="card-interstellar" style={{ opacity: getCardOpacity('interstellar', sandboxProgress) }}>
                <span className="year">2012</span>
                <h2>Espaço Interestelar</h2>
                <p>A Voyager 1 entra no oceano silencioso do espaço interestelar.</p>
              </div>
            </div>
          </div>

          {/* Timeline slider overlay */}
          <div className="sandbox-timeline">
            <label>
              <span>Progresso do Scroll Virtual</span>
              <span>{sandboxProgress}%</span>
            </label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sandboxProgress}
              onChange={(e) => setSandboxProgress(parseInt(e.target.value))}
            />
          </div>

          {/* Control Panel overlay */}
          <div className="visual-editor-panel">
            <h3>Editor de Movimento</h3>
            
            <div className="editor-section">
              <span className="editor-section-title">1. Selecionar Elemento</span>
              <div className="element-select-grid">
                {(['voyager', 'earth', 'jupiter', 'saturn', 'golden'] as const).map(el => (
                  <button 
                    key={el}
                    className={`element-select-btn ${activeElement === el ? 'active' : ''}`}
                    onClick={() => setActiveElement(el)}
                  >
                    {el === 'voyager' ? "Voyager 🛰️" : el === 'earth' ? "Terra 🌍" : el === 'jupiter' ? "Júpiter 🪐" : el === 'saturn' ? "Saturno 🪐" : "Disco 📀"}
                  </button>
                ))}
              </div>
            </div>

            <div className="sandbox-drag-instructions">
              🖱️ Clique e arraste o elemento diretamente na tela para posicionar!
            </div>

            <div className="editor-section">
              <span className="editor-section-title">2. Propriedades</span>
              <div className="editor-row">
                <label>Posição X</label>
                <input 
                  type="range" 
                  min="-60" 
                  max="60" 
                  step="0.5"
                  value={activeValues.x}
                  onChange={(e) => updateActiveElementProperty('x', parseFloat(e.target.value))}
                />
                <span className="editor-value">{activeValues.x}vw</span>
              </div>
              <div className="editor-row">
                <label>Posição Y</label>
                <input 
                  type="range" 
                  min="-60" 
                  max="60" 
                  step="0.5"
                  value={activeValues.y}
                  onChange={(e) => updateActiveElementProperty('y', parseFloat(e.target.value))}
                />
                <span className="editor-value">{activeValues.y}vh</span>
              </div>
              <div className="editor-row">
                <label>Escala</label>
                <input 
                  type="range" 
                  min="0.05" 
                  max="4" 
                  step="0.05"
                  value={activeValues.scale}
                  onChange={(e) => updateActiveElementProperty('scale', parseFloat(e.target.value))}
                />
                <span className="editor-value">{activeValues.scale}x</span>
              </div>
              <div className="editor-row">
                <label>Rotação</label>
                <input 
                  type="range" 
                  min="-360" 
                  max="360" 
                  step="5"
                  value={activeValues.rotate}
                  onChange={(e) => updateActiveElementProperty('rotate', parseFloat(e.target.value))}
                />
                <span className="editor-value">{activeValues.rotate}°</span>
              </div>
              <div className="editor-row">
                <label>Opacidade</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05"
                  value={activeValues.opacity}
                  onChange={(e) => updateActiveElementProperty('opacity', parseFloat(e.target.value))}
                />
                <span className="editor-value">{activeValues.opacity}</span>
              </div>
            </div>

            <div className="editor-section">
              <span className="editor-section-title">3. Keyframes ({keyframes[activeElement]?.length || 0})</span>
              <div className="keyframes-list">
                {keyframes[activeElement]?.map(kf => (
                  <span 
                    key={kf.progress} 
                    className={`keyframe-tag ${sandboxProgress === kf.progress ? 'active' : ''}`}
                    onClick={() => setSandboxProgress(kf.progress)}
                  >
                    {kf.progress}%
                    {kf.progress !== 0 && kf.progress !== 100 && (
                      <span 
                        style={{ marginLeft: '4px', cursor: 'pointer', color: '#ef4444' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteKeyframe(kf.progress);
                        }}
                      >
                        ×
                      </span>
                    )}
                  </span>
                ))}
              </div>
              <div className="action-buttons">
                <button 
                  className="primary"
                  onClick={() => updateActiveElementProperty('x', activeValues.x)}
                >
                  Salvar Keyframe
                </button>
                <button 
                  className="danger"
                  onClick={() => deleteKeyframe(sandboxProgress)}
                >
                  Deletar
                </button>
                <button onClick={resetActiveElement}>Resetar</button>
              </div>
            </div>

            <div className="code-output-container">
              <span className="editor-section-title">4. Código GSAP Gerado</span>
              <pre className="code-output">{generateGSAPCode()}</pre>
              <button className="copy-btn" onClick={handleCopyCode}>
                {copied ? "Copiado! ✓" : "Copiar Configuração"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* RENDER MODE B: STANDARD SCROLLYTELLING PAGE */
        <>
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
        </>
      )}
    </div>
  )
}

export default App
