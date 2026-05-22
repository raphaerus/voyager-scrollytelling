# Jornada de Scrollytelling da Voyager 1

Uma experiência web interativa controlada por rolagem (scroll) que conta a história histórica da sonda espacial Voyager 1 enquanto ela viaja da Terra, passa por Júpiter e Saturno, e cruza para o espaço interestelar.

Usaremos a biblioteca `@bsmnt/scrollytelling` (alimentada pelo GSAP ScrollTrigger) para fixar (pin) uma visualização espacial central enquanto animamos o fundo, planetas e a espaçonave Voyager com base no progresso da rolagem da página.

---

## Revisão do Usuário Necessária

> [!IMPORTANT]
> O projeto usará as duas imagens que geramos anteriormente. Precisaremos copiá-las da pasta de dados do aplicativo para a pasta de assets do projeto assim que o plano for aprovado.
> - **Fundo Espacial**: Uma nebulosa colorida no espaço profundo com tons neon.
> - **Sonda Voyager**: Um recorte detalhado da espaçonave Voyager 1.

> [!NOTE]
> Todas as animações planetárias (Terra, Júpiter, Saturno) serão estilizadas usando CSS moderno e elementos SVG brilhantes, em vez de arquivos de imagem pesados. Isso nos dará uma renderização vetorial suave, brilhos neon gradientes e excelente desempenho.

---

## Mudanças Propostas

### Configuração de Assets

#### [NOVO] [space_background.png](src/assets/space_background.png)
Gráfico de nebulosa no espaço profundo de alta resolução gerado pela ferramenta de imagem de IA.

#### [NOVO] [voyager_probe.png](src/assets/voyager_probe.png)
Gráfico detalhado da espaçonave Voyager gerado pela ferramenta de imagem de IA.

---

### Folha de Estilos

#### [MODIFICAR] [index.css](src/index.css)
Substituir os estilos padrão do projeto por estilos customizados para:
- Layout cósmico de espaço profundo (tema escuro de preto para roxo).
- Seções de linha do tempo com altura fixa.
- Contêiner de visualização (viewport) fixado (pinned).
- Gradientes de brilho cósmico, planetas e partículas de estrelas.
- Estilos de cartões flutuantes com bordas neon e glassmorphism (efeito vidro).

---

### App React Principal

#### [MODIFICAR] [App.tsx](src/App.tsx)
Reconstruir o `App.tsx` usando os componentes da `@bsmnt/scrollytelling`:
1. Envolver toda a experiência em um contêiner `<Root>` para inicializar a linha do tempo do GSAP ScrollTrigger.
2. Incorporar o componente `<Pin>` contendo a tela do espaço:
   - Imagem da sonda Voyager (animada em escala, rotação, translação e opacidade).
   - Fundo espacial (com zoom em efeito parallax).
   - Planetas em SVG:
     - **Terra**: Uma pequena esfera azul que desaparece.
     - **Júpiter**: Uma enorme esfera com faixas laranja que se aproxima em zoom.
     - **Saturn**: Um planeta amarelo-ouro envolto em anéis que se inclina e gira.
     - **Disco de Ouro (Golden Record)**: O lendário disco de mensagem que aparece no centro, girando conforme entramos no espaço profundo.
3. Colocar nós `<Animation>` mapeando o progresso da rolagem para valores CSS/SVG.
4. Renderizar painéis de texto flutuantes marcando fases importantes:
   - **1977 - O Lançamento**: Deixando a Terra para trás.
   - **1979 - Encontro com Júpiter**: Assistência gravitacional.
   - **1980 - Os Anéis de Saturno**: Viagem além do conhecido.
   - **O Disco de Ouro**: Uma saudação ao cosmos.
   - **2012 - O Espaço Interestelar**: A fronteira silenciosa.

---

## Plano de Verificação

### Testes Locais/Automatizados
- Iniciar o servidor local do Vite:
  ```bash
  npm run dev
  ```
- Executar o build de desenvolvimento para garantir zero erros de compilação:
  ```bash
  npm run build
  ```

### Verificação Manual
- Abrir a URL local do servidor dev no navegador.
- Rolar a página para baixo lentamente para testar:
  - Fixação suave da cena principal.
  - A sonda Voyager se movendo e rotacionando.
  - Planetas surgindo e mudando de escala suavemente.
  - O Disco de Ouro girando em foco.
  - Cartões de texto com efeito vidro aparecendo e desaparecendo exatamente conforme suas fases ocorrem.
