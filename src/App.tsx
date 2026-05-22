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

interface CardText {
  year: string;
  title: string;
  description: string;
}

type CardsTextData = Record<string, CardText>;

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

const defaultCardsText: CardsTextData = {
  launch: {
    year: "1977",
    title: "O Lançamento",
    description: "A Voyager 1 é lançada ao espaço a bordo de um foguete Titan IIIE. Sua velocidade inicial supera qualquer veículo humano anterior, marcando o início de uma jornada eterna rumo ao desconhecido."
  },
  jupiter: {
    year: "1979",
    title: "Encontro com Júpiter",
    description: "Aproximando-se do gigante gasoso, a Voyager 1 utiliza a gravidade de Júpiter como um \"estilingue espacial\", ganhando um impulso massivo de velocidade enquanto captura detalhes inéditos das tempestades jupiterianas."
  },
  saturn: {
    year: "1980",
    title: "Os Anéis de Saturno",
    description: "A sonda voa bem perto de Saturno e Titan, revelando a complexidade espetacular de seus anéis de gelo e poeira. A gravidade do planeta redireciona a Voyager para fora do plano do sistema solar."
  },
  golden: {
    year: "Mensagem Cósmica",
    title: "O Disco de Ouro",
    description: "Acoplado à sonda, está o Disco de Ouro, gravado com saudações em 55 idiomas, sons da Terra, músicas de várias culturas e imagens do nosso mundo — uma carta de apresentação para quem quer que encontre a sonda no futuro distante."
  },
  interstellar: {
    year: "2012",
    title: "Espaço Interestelar",
    description: "Ao cruzar a heliopausa, a Voyager 1 deixa a bolha magnética do Sol para trás, tornando-se o primeiro objeto criado pela humanidade a adentrar o oceano silencioso do espaço interestelar."
  }
};

const imagePresets = {
  voyager: voyagerProbe,
  shuttle: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Space_Shuttle_Atlantis_in_orbit.png/640px-Space_Shuttle_Atlantis_in_orbit.png',
  ufo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Ufo_profile.png/640px-Ufo_profile.png',
  hubble: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Hubble_Space_Telescope_in_orbit.png/640px-Hubble_Space_Telescope_in_orbit.png'
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

  // New visual builder state
  const [cardsText, setCardsText] = useState<CardsTextData>(defaultCardsText);
  const [activeCardEdit, setActiveCardEdit] = useState<string>('launch');
  const [probeImage, setProbeImage] = useState<string>(voyagerProbe);
  const [customImageURL, setCustomImageURL] = useState<string>('');

  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    startX: number;
    startY: number;
    startCoordX: number;
    startCoordY: number;
  } | null>(null);

  // Lock body scroll when in sandbox mode
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

  // Card Text Editing Handler
  const handleCardTextChange = (field: keyof CardText, value: string) => {
    setCardsText(prev => ({
      ...prev,
      [activeCardEdit]: {
        ...prev[activeCardEdit],
        [field]: value
      }
    }));
  };

  // Preset Selector Handler
  const handleImagePresetChange = (presetKey: keyof typeof imagePresets | 'custom') => {
    if (presetKey === 'custom') {
      if (customImageURL) {
        setProbeImage(customImageURL);
      }
    } else {
      setProbeImage(imagePresets[presetKey]);
    }
  };

  // Export narrative project to JSON
  const exportProject = () => {
    const projectData = {
      version: "1.0.0",
      keyframes,
      cardsText,
      probeImage
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projectData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "projeto-voyager-storytelling.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import narrative project from JSON
  const handleImportProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.keyframes && data.cardsText) {
          setKeyframes(data.keyframes);
          setCardsText(data.cardsText);
          if (data.probeImage) setProbeImage(data.probeImage);
          alert("Projeto importado com sucesso!");
        } else {
          alert("Arquivo JSON inválido para projeto de storytelling!");
        }
      } catch (err) {
        alert("Erro ao decodificar arquivo JSON!");
      }
    };
    reader.readAsText(file);
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
    let code = `// Configuração da animação para: ${targetClass}\n`;
    
    if (sorted.length < 2) {
      return code + `// Adicione mais keyframes!`;
    }

    for (let i = 0; i < sorted.length - 1; i++) {
      const k1 = sorted[i];
      const k2 = sorted[i + 1];
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

          {/* Voyager Spacecraft (Or custom asset) */}
          <div 
            className={`voyager-spacecraft ${activeElement === 'voyager' ? 'sandbox-draggable' : ''}`}
            style={{
              transform: `translate(${voyagerProps.x}vw, ${voyagerProps.y}vh) scale(${voyagerProps.scale}) rotate(${voyagerProps.rotate}deg)`,
              opacity: voyagerProps.opacity,
              pointerEvents: activeElement === 'voyager' ? 'auto' : 'none',
            }}
            onMouseDown={activeElement === 'voyager' ? handleMouseDown : undefined}
          >
            <img src={probeImage} alt="Elemento Principal" />
          </div>

          {/* Scrolling text cards overlay (rendered from state) */}
          <div className="scrolly-stories" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 20, pointerEvents: 'none' }}>
            <div className="story-step align-left">
              <div className="story-card" id="card-launch" style={{ opacity: getCardOpacity('launch', sandboxProgress) }}>
                <span className="year">{cardsText.launch.year}</span>
                <h2>{cardsText.launch.title}</h2>
                <p>{cardsText.launch.description}</p>
              </div>
            </div>

            <div className="story-step align-right">
              <div className="story-card" id="card-jupiter" style={{ opacity: getCardOpacity('jupiter', sandboxProgress) }}>
                <span className="year">{cardsText.jupiter.year}</span>
                <h2>{cardsText.jupiter.title}</h2>
                <p>{cardsText.jupiter.description}</p>
              </div>
            </div>

            <div className="story-step align-left">
              <div className="story-card" id="card-saturn" style={{ opacity: getCardOpacity('saturn', sandboxProgress) }}>
                <span className="year">{cardsText.saturn.year}</span>
                <h2>{cardsText.saturn.title}</h2>
                <p>{cardsText.saturn.description}</p>
              </div>
            </div>

            <div className="story-step align-right">
              <div className="story-card" id="card-golden" style={{ opacity: getCardOpacity('golden', sandboxProgress) }}>
                <span className="year">{cardsText.golden.year}</span>
                <h2>{cardsText.golden.title}</h2>
                <p>{cardsText.golden.description}</p>
              </div>
            </div>

            <div className="story-step align-center">
              <div className="story-card" id="card-interstellar" style={{ opacity: getCardOpacity('interstellar', sandboxProgress) }}>
                <span className="year">{cardsText.interstellar.year}</span>
                <h2>{cardsText.interstellar.title}</h2>
                <p>{cardsText.interstellar.description}</p>
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
            <h3>Editor de Storytelling</h3>
            
            {/* Element Selection */}
            <div className="editor-section">
              <span className="editor-section-title">1. Elemento Visível</span>
              <div className="element-select-grid">
                {(['voyager', 'earth', 'jupiter', 'saturn', 'golden'] as const).map(el => (
                  <button 
                    key={el}
                    className={`element-select-btn ${activeElement === el ? 'active' : ''}`}
                    onClick={() => setActiveElement(el)}
                  >
                    {el === 'voyager' ? "Nave/Sonda 🛰️" : el === 'earth' ? "Terra 🌍" : el === 'jupiter' ? "Júpiter 🪐" : el === 'saturn' ? "Saturno 🪐" : "Disco 📀"}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Image / Library */}
            <div className="editor-section">
              <span className="editor-section-title">2. Biblioteca de Imagens</span>
              <select 
                className="editor-select"
                onChange={(e) => handleImagePresetChange(e.target.value as any)}
              >
                <option value="voyager">Sonda Voyager 1 (Padrão)</option>
                <option value="shuttle">Foguete/Ônibus Espacial Atlantis</option>
                <option value="ufo">Disco Voador / UFO</option>
                <option value="hubble">Telescópio Hubble</option>
              </select>
              <input 
                type="text"
                placeholder="Ou cole a URL de qualquer imagem..."
                className="editor-input"
                value={customImageURL}
                onChange={(e) => setCustomImageURL(e.target.value)}
              />
              <button 
                className="action-buttons button" 
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', padding: '0.4rem', color: '#fff', borderRadius: '8px' }}
                onClick={() => handleImagePresetChange('custom')}
              >
                Aplicar Imagem Personalizada
              </button>
            </div>

            {/* Editable Card Text section */}
            <div className="editor-section">
              <span className="editor-section-title">3. Editor de Textos</span>
              <select 
                className="editor-select"
                value={activeCardEdit}
                onChange={(e) => setActiveCardEdit(e.target.value)}
              >
                <option value="launch">Fase 1: O Lançamento</option>
                <option value="jupiter">Fase 2: Encontro com Júpiter</option>
                <option value="saturn">Fase 3: Anéis de Saturno</option>
                <option value="golden">Fase 4: O Disco de Ouro</option>
                <option value="interstellar">Fase 5: Espaço Interestelar</option>
              </select>
              <input 
                type="text"
                placeholder="Ano/Fase (ex: 1977)"
                className="editor-input"
                value={cardsText[activeCardEdit].year}
                onChange={(e) => handleCardTextChange('year', e.target.value)}
              />
              <input 
                type="text"
                placeholder="Título do Cartão"
                className="editor-input"
                value={cardsText[activeCardEdit].title}
                onChange={(e) => handleCardTextChange('title', e.target.value)}
              />
              <textarea 
                placeholder="História a ser contada..."
                className="editor-textarea"
                value={cardsText[activeCardEdit].description}
                onChange={(e) => handleCardTextChange('description', e.target.value)}
              />
            </div>

            {/* Element Parameters Sliders */}
            <div className="editor-section">
              <span className="editor-section-title">4. Parâmetros de Movimento</span>
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

            {/* Keyframes timeline management */}
            <div className="editor-section">
              <span className="editor-section-title">5. Keyframes ({keyframes[activeElement]?.length || 0})</span>
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

            {/* Code Generator & Project JSON exporter */}
            <div className="editor-section" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
              <span className="editor-section-title">6. Exportar / Salvar</span>
              <div className="action-buttons" style={{ marginBottom: '0.5rem' }}>
                <button className="primary" onClick={exportProject}>Salvar Projeto</button>
                <label className="file-import-btn">
                  Abrir Projeto
                  <input type="file" accept=".json" onChange={handleImportProject} />
                </label>
              </div>
              <div className="code-output-container">
                <pre className="code-output">{generateGSAPCode()}</pre>
                <button className="copy-btn" onClick={handleCopyCode}>
                  {copied ? "Copiado! ✓" : "Copiar Configuração"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* RENDER MODE B: STANDARD SCROLLYTELLING PAGE (REFLECTS EDITED DATA) */
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

                  {/* Voyager Spacecraft (Or custom asset) */}
                  <div className="voyager-spacecraft">
                    <img src={probeImage} alt="Sonda Voyager 1" />
                  </div>

                  {/* Scrolling text cards overlay (reflecting cardsText state) */}
                  <div className="scrolly-stories" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 20, pointerEvents: 'none' }}>
                    {/* Step 1: Launch */}
                    <div className="story-step align-left">
                      <div className="story-card" id="card-launch" style={{ opacity: 0 }}>
                        <span className="year">{cardsText.launch.year}</span>
                        <h2>{cardsText.launch.title}</h2>
                        <p>{cardsText.launch.description}</p>
                      </div>
                    </div>

                    {/* Step 2: Jupiter */}
                    <div className="story-step align-right">
                      <div className="story-card" id="card-jupiter" style={{ opacity: 0 }}>
                        <span className="year">{cardsText.jupiter.year}</span>
                        <h2>{cardsText.jupiter.title}</h2>
                        <p>{cardsText.jupiter.description}</p>
                      </div>
                    </div>

                    {/* Step 3: Saturn */}
                    <div className="story-step align-left">
                      <div className="story-card" id="card-saturn" style={{ opacity: 0 }}>
                        <span className="year">{cardsText.saturn.year}</span>
                        <h2>{cardsText.saturn.title}</h2>
                        <p>{cardsText.saturn.description}</p>
                      </div>
                    </div>

                    {/* Step 4: Golden Record */}
                    <div className="story-step align-right">
                      <div className="story-card" id="card-golden" style={{ opacity: 0 }}>
                        <span className="year">{cardsText.golden.year}</span>
                        <h2>{cardsText.golden.title}</h2>
                        <p>{cardsText.golden.description}</p>
                      </div>
                    </div>

                    {/* Step 5: Interstellar Space */}
                    <div className="story-step align-center">
                      <div className="story-card" id="card-interstellar" style={{ opacity: 0 }}>
                        <span className="year">{cardsText.interstellar.year}</span>
                        <h2>{cardsText.interstellar.title}</h2>
                        <p>{cardsText.interstellar.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Pin>

              {/* Declarative Scroll Animations for Visual Elements */}
              <Animation
                tween={[
                  {
                    target: '.space-background',
                    start: 0,
                    end: 100,
                    to: { scale: 1.3, x: '-5%', y: '-3%', ease: 'none' }
                  },
                  {
                    target: '.earth-planet',
                    start: 0,
                    end: 15,
                    fromTo: [
                      { scale: 1.0, opacity: 1, x: '25vw', y: '10vh' },
                      { scale: 0.1, opacity: 0, x: '-40vw', y: '5vh', ease: 'power1.inOut' }
                    ]
                  },
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
                  // Voyager trajectory
                  {
                    target: '.voyager-spacecraft',
                    start: 0,
                    end: 18,
                    fromTo: [
                      { scale: 0.25, rotate: -25, x: '-20vw', y: '15vh' },
                      { scale: 0.55, rotate: 10, x: '0vw', y: '0vh', ease: 'power1.out' }
                    ]
                  },
                  {
                    target: '.voyager-spacecraft',
                    start: 20,
                    end: 38,
                    to: { scale: 1.1, rotate: -40, x: '25vw', y: '-15vh', ease: 'power2.inOut' }
                  },
                  {
                    target: '.voyager-spacecraft',
                    start: 38,
                    end: 45,
                    to: { scale: 0.6, rotate: 15, x: '-30vw', y: '20vh', ease: 'power1.inOut' }
                  },
                  {
                    target: '.voyager-spacecraft',
                    start: 48,
                    end: 65,
                    to: { scale: 0.9, rotate: -60, x: '5vw', y: '-10vh', ease: 'power2.out' }
                  },
                  {
                    target: '.voyager-spacecraft',
                    start: 68,
                    end: 82,
                    to: { scale: 0.4, rotate: 20, x: '32vw', y: '22vh', opacity: 0.5, ease: 'power1.inOut' }
                  },
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
