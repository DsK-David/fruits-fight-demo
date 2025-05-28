// Constantes do jogo
const GAME_WIDTH = window.innerWidth;
const GAME_HEIGHT = window.innerHeight;
const FRUIT_TYPES = ['apple', 'banana', 'orange', 'watermelon', 'strawberry', 'pineapple'];
const ITEM_TYPES = [...FRUIT_TYPES, 'bomb'];
const ITEM_SCORES = {
  apple: 10,
  banana: 15,
  orange: 20,
  watermelon: 25,
  strawberry: 30,
  pineapple: 40,
  bomb: 0
};
const ITEM_SPEEDS = {
  apple: 5,
  banana: 8,
  orange: 7,
  watermelon: 6.5,
  strawberry: 8,
  pineapple: 6,
  bomb: 9
};
const ITEM_SIZES = {
  apple: 70,
  banana: 80,
  orange: 60,
  watermelon: 100,
  strawberry: 80,
  pineapple: 90,
  bomb: 70
};
const ITEM_IMAGES = {
  apple: 'https://cdn-icons-png.flaticon.com/512/415/415682.png',
  banana: 'https://cdn-icons-png.flaticon.com/512/1514/1514933.png',
  orange: 'https://cdn-icons-png.flaticon.com/512/135/135620.png',
  watermelon: 'https://cdn-icons-png.flaticon.com/512/7693/7693578.png',
  strawberry: 'https://cdn-icons-png.flaticon.com/512/590/590685.png',
  pineapple: 'https://cdn-icons-png.flaticon.com/512/8692/8692265.png',
  bomb: 'https://cdn-icons-png.flaticon.com/512/7086/7086637.png'
};
const MAX_LIVES = 3;
const INITIAL_SPAWN_RATE = 1500; // ms
const SPAWN_RATE_DECREASE = 50; // ms per level
const MIN_SPAWN_RATE = 500;
const BOMB_SPAWN_CHANCE = 0.15; // 15% de chance de spawnar uma bomba

// Sistema de níveis
const LEVEL_THRESHOLDS = [0, 100, 500, 1000, 2000, 5000]; // Pontos necessários para cada nível
const SPEED_MULTIPLIERS = [1, 1.2, 1.5, 1.8, 2.2, 2.7]; // Multiplicadores de velocidade por nível
const MAX_LEVEL = LEVEL_THRESHOLDS.length - 1;

// Variáveis do jogo
let score = 0;
let highScore = localStorage.getItem('fruitNinjaHighScore') || 0;
let lives = MAX_LIVES;
let currentLevel = 1;
let gameActive = false;
let gamePaused = false;
let items = [];
let spawnRate = INITIAL_SPAWN_RATE;
let lastTime = 0;
let animationFrameId = null;
let spawnIntervalId = null;

// Variáveis para o sistema de corte
let isSlicing = false;
let lastSlicePoint = { x: 0, y: 0 };
let sliceVelocity = { x: 0, y: 0 };
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints;
const MIN_SLICE_VELOCITY = isTouchDevice ? 3 : 5;
const MIN_SLICE_DISTANCE = isTouchDevice ? 20 : 30;
let slicePoints = [];
let lastPoint = { x: 0, y: 0 };

// Elementos do DOM
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score-value');
const livesContainer = document.getElementById('lives-container');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const pauseScreen = document.getElementById('pause-screen');
const finalScoreDisplay = document.getElementById('final-score');
const pauseScoreDisplay = document.getElementById('pause-score');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const menuButton = document.getElementById('menu-button');
const pauseButton = document.getElementById('pause-button');
const resumeButton = document.getElementById('resume-button');
const restartFromPauseButton = document.getElementById('restart-from-pause-button');
const menuFromPauseButton = document.getElementById('menu-from-pause-button');

// Canvas para o efeito de corte
const canvas = document.createElement('canvas');
canvas.id = 'slice-canvas';
canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.zIndex = '50';
canvas.style.pointerEvents = 'none';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Elemento para mostrar o recorde
const highScoreDisplay = document.createElement('div');
highScoreDisplay.id = 'high-score-display';
highScoreDisplay.textContent = `Recorde: ${highScore}`;
highScoreDisplay.style.fontSize = '24px';
highScoreDisplay.style.marginBottom = '20px';
highScoreDisplay.style.color = 'var(--warning-color)';
startScreen.insertBefore(highScoreDisplay, startScreen.firstChild.nextSibling);

// Animação de nível up
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    0% { opacity: 1; transform: translate(-50%, -50%) scale(1.5); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
  }
`;
document.head.appendChild(style);

// Função para redimensionar o canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Event Listeners
// startButton.addEventListener('click', startGame);
// restartButton.addEventListener('click', restartGame);
// menuButton.addEventListener('click', returnToMenu);
// pauseButton.addEventListener('click', togglePause);
// resumeButton.addEventListener('click', resumeGame);
// restartFromPauseButton.addEventListener('click', restartFromPause);
// menuFromPauseButton.addEventListener('click', () => {
//   document.querySelectorAll('.fruit, .fruit-half, .bomb, .explosion, .juice-splash, .slice-trail').forEach(el => el.remove());
//   pauseScreen.style.display = 'none';
//   startScreen.style.display = 'flex';
//   returnToMenu();
// });

// Eventos de toque/mouse para o corte
// Remova os event listeners anteriores e adicione estes
gameContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
gameContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
gameContainer.addEventListener('touchend', handleTouchEnd, { passive: false });
menuButton.addEventListener('touchstart', returnToMenu, { passive: false });
startButton.addEventListener('touchstart', startGame, { passive: false });
restartFromPauseButton.addEventListener("touchstart", restartGame, {
  passive: false,
});
menuFromPauseButton.addEventListener("touchstart", returnToMenu, {
  passive: false,
});
pauseButton.addEventListener('touchstart', togglePause, { passive: false });
resumeButton.addEventListener('touchstart', resumeGame, { passive: false });
restartButton.addEventListener('touchstart', restartGame,{passive: false});


// Funções de controle do jogo
function startGame() {
  gameActive = true;
  gamePaused = false;
  score = 0;
  lives = MAX_LIVES;
  currentLevel = 1;
  spawnRate = INITIAL_SPAWN_RATE;
  items = [];

  startScreen.style.display = 'none';
  gameOverScreen.style.display = 'none';
  pauseScreen.style.display = 'none';
  updateScoreDisplay();
  updateLivesDisplay();

  lastTime = performance.now();
  gameLoop(lastTime);

  spawnIntervalId = setInterval(spawnItem, spawnRate);
}

function restartGame() {
  document.querySelectorAll('.fruit, .fruit-half, .bomb, .explosion, .juice-splash, .slice-trail').forEach(el => el.remove());
  gameOverScreen.style.display = 'none';
  startGame();
}

function restartFromPause() {
  document.querySelectorAll('.fruit, .fruit-half, .bomb, .explosion, .juice-splash, .slice-trail').forEach(el => el.remove());
  pauseScreen.style.display = 'none';
  startGame();
}

function returnToMenu() {
  document.querySelectorAll('.fruit, .fruit-half, .bomb, .explosion, .juice-splash, .slice-trail').forEach(el => el.remove());
  gameOverScreen.style.display = 'none';
  pauseScreen.style.display = 'none';
  startScreen.style.display = 'flex';
  // resetGame();
}

function togglePause() {
  if (!gameActive) return;
  
  if (gamePaused) {
    resumeGame();
  } else {
    pauseGame();
  }
}

function pauseGame() {
  gamePaused = true;
  clearInterval(spawnIntervalId);
  cancelAnimationFrame(animationFrameId);
  pauseScoreDisplay.textContent = score;
  pauseScreen.style.display = 'flex';
}

function resumeGame() {
  gamePaused = false;
  pauseScreen.style.display = 'none';
  lastTime = performance.now();
  gameLoop(lastTime);
  spawnIntervalId = setInterval(spawnItem, spawnRate);
}

function resetGame() {
  gameActive = false;
  clearInterval(spawnIntervalId);
  cancelAnimationFrame(animationFrameId);
}

// Funções do loop do jogo
function gameLoop(timestamp) {
  if (!gameActive || gamePaused) return;

  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  update(deltaTime);
  render();

  animationFrameId = requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i];
    
    if (item.cut || item.exploded) {
      item.cutTime += deltaTime;
      if (item.cutTime > 500) {
        removeItem(i);
      }
    } else {
      // Aplica o multiplicador de velocidade do nível atual
      item.y += item.speed * SPEED_MULTIPLIERS[currentLevel-1] * (deltaTime / 16);
      
      if (item.y > GAME_HEIGHT) {
        if (item.type !== 'bomb') {
          lives--;
          updateLivesDisplay();
        }
        removeItem(i);
        
        if (lives <= 0) {
          gameOver();
        }
      }
    }
  }
  
  // Verifica se subiu de nível
  checkLevelUp();
}

function render() {
  for (const item of items) {
    if (item.element) {
      item.element.style.top = `${item.y}px`;
      item.element.style.left = `${item.x}px`;
    }
    
    if (item.half1 && item.half2) {
      item.half1.style.top = `${item.y}px`;
      item.half1.style.left = `${item.x}px`;
      item.half2.style.top = `${item.y}px`;
      item.half2.style.left = `${item.x}px`;
    }
  }
}

// Sistema de níveis e recordes
function checkLevelUp() {
  const newLevel = calculateCurrentLevel();
  if (newLevel > currentLevel) {
    currentLevel = newLevel;
    spawnRate = Math.max(MIN_SPAWN_RATE, INITIAL_SPAWN_RATE - (currentLevel * SPAWN_RATE_DECREASE));
    clearInterval(spawnIntervalId);
    spawnIntervalId = setInterval(spawnItem, spawnRate);
    
    showLevelUpMessage();
  }
}

function calculateCurrentLevel() {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (score >= LEVEL_THRESHOLDS[i]) {
      return Math.min(i + 1, MAX_LEVEL);
    }
  }
  return 1;
}

function showLevelUpMessage() {
  const levelUpDiv = document.createElement('div');
  levelUpDiv.textContent = `Nível ${currentLevel}!`;
  levelUpDiv.style.position = 'absolute';
  levelUpDiv.style.top = '50%';
  levelUpDiv.style.left = '50%';
  levelUpDiv.style.transform = 'translate(-50%, -50%)';
  levelUpDiv.style.fontSize = '48px';
  levelUpDiv.style.color = 'white';
  levelUpDiv.style.textShadow = '0 0 10px black';
  levelUpDiv.style.zIndex = '300';
  levelUpDiv.style.animation = 'fadeOut 2s forwards';
  
  document.body.appendChild(levelUpDiv);
  
  setTimeout(() => {
    levelUpDiv.remove();
  }, 2000);
}

function updateHighScoreDisplay() {
  highScoreDisplay.textContent = `Recorde: ${highScore}`;
}

// Funções para spawn de itens
function spawnItem() {
  if (!gameActive || gamePaused) return;
  
  const isBomb = Math.random() < (BOMB_SPAWN_CHANCE * (1 + (currentLevel * 0.1)));
  const itemType = isBomb ? 'bomb' : FRUIT_TYPES[Math.floor(Math.random() * FRUIT_TYPES.length)];
  const size = ITEM_SIZES[itemType];
  const x = Math.random() * (GAME_WIDTH - size);
  const y = -size;
  const baseSpeedMultiplier = 1 + (currentLevel * 0.1);
  const speed = ITEM_SPEEDS[itemType] * (1 + Math.random() * 0.5) * baseSpeedMultiplier;

  const itemElement = document.createElement('div');
  itemElement.className = isBomb ? 'bomb' : `fruit ${itemType}`;
  itemElement.style.width = `${size}px`;
  itemElement.style.height = `${size}px`;
  itemElement.style.left = `${x}px`;
  itemElement.style.top = `${y}px`;
  
  const img = document.createElement('img');
  img.src = ITEM_IMAGES[itemType];
  img.draggable = false;
  itemElement.appendChild(img);
  
  gameContainer.appendChild(itemElement);
  
  const newItem = {
    type: itemType,
    x: x,
    y: y,
    speed: speed,
    size: size,
    element: itemElement,
    cut: false,
    exploded: false,
    cutTime: 0,
    half1: null,
    half2: null
  };
  
  items.push(newItem);
}

// Funções de corte (slice)
function handleTouchStart(e) {
  e.preventDefault();
  const touch = e.touches[0];
  startSlice({ clientX: touch.clientX, clientY: touch.clientY });
}

function handleTouchMove(e) {
  e.preventDefault();
  const touch = e.touches[0];
  moveSlice({ clientX: touch.clientX, clientY: touch.clientY });
}

function handleTouchEnd(e) {
  e.preventDefault();
  endSlice();
}

function startSlice(e) {
  if (!gameActive || gamePaused) return;
  isSlicing = true;
  slicePoints = [];
  lastPoint = { x: e.clientX, y: e.clientY };
  slicePoints.push(lastPoint);
}

function moveSlice(e) {
  if (!isSlicing || !gameActive || gamePaused) return;

  const currentPoint = { x: e.clientX, y: e.clientY };
  const velocity = Math.hypot(
    currentPoint.x - lastPoint.x,
    currentPoint.y - lastPoint.y
  );

  // Desenha a linha de corte
  ctx.beginPath();
  ctx.moveTo(lastPoint.x, lastPoint.y);
  ctx.lineTo(currentPoint.x, currentPoint.y);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
  ctx.lineWidth = isTouchDevice ? 8 : 4;
  ctx.lineCap = "round";
  ctx.stroke();

  // Verifica colisões apenas se a velocidade for suficiente
  if (velocity > MIN_SLICE_VELOCITY) {
    checkSliceCollision(lastPoint, currentPoint);
  }

  lastPoint = currentPoint;
  
  // Limpa o canvas para o próximo frame
  requestAnimationFrame(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
}

function endSlice() {
  isSlicing = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function checkSliceCollision(start, end) {
  items.forEach((item, index) => {
    if (item.cut || item.exploded) return;

    const itemBounds = {
      left: item.x,
      right: item.x + item.size,
      top: item.y,
      bottom: item.y + item.size
    };

    if (lineIntersectsRect(start, end, itemBounds)) {
      const centerX = item.x + item.size / 2;
      const centerY = item.y + item.size / 2;
      
      if (item.type === "bomb") {
        explodeBomb(index);
      } else {
        cutFruit(index, centerX, centerY);
      }
    }
  });
}

// Funções auxiliares para detecção de colisão
function lineIntersectsLine(a, b, c, d) {
  const denominator = (b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x);
  if (denominator === 0) return false;

  const ua = ((d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x)) / denominator;
  const ub = ((b.x - a.x) * (a.y - c.y) - (b.y - a.y) * (a.x - c.x)) / denominator;

  return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
}

function lineIntersectsRect(start, end, rect) {
  return (
    lineIntersectsLine(
      start,
      end,
      { x: rect.left, y: rect.top },
      { x: rect.right, y: rect.top }
    ) ||
    lineIntersectsLine(
      start,
      end,
      { x: rect.right, y: rect.top },
      { x: rect.right, y: rect.bottom }
    ) ||
    lineIntersectsLine(
      start,
      end,
      { x: rect.right, y: rect.bottom },
      { x: rect.left, y: rect.bottom }
    ) ||
    lineIntersectsLine(
      start,
      end,
      { x: rect.left, y: rect.bottom },
      { x: rect.left, y: rect.top }
    )
  );
}

// Funções para cortar frutas e explosão de bombas
function cutFruit(index, x, y) {
  if (index < 0 || index >= items.length || items[index].cut || items[index].type === 'bomb' || !gameActive || gamePaused) return;

  const fruit = items[index];
  fruit.cut = true;
  fruit.element.classList.add('cut');

  // Efeito visual de corte
  const slice = document.createElement('div');
  slice.className = 'slice-effect';
  slice.style.left = `${x - 50}px`;
  slice.style.top = `${y - 10}px`;
  const angle = Math.random() * 60 - 30;
  slice.style.setProperty('--rotation', `${angle}deg`);
  gameContainer.appendChild(slice);

  // Linha de suco
  const juiceLine = document.createElement('div');
  juiceLine.className = 'juice-line';
  juiceLine.style.left = `${x}px`;
  juiceLine.style.top = `${y}px`;
  juiceLine.style.width = `${fruit.size}px`;
  
  const juiceColors = {
    apple: '#ff3232',
    banana: '#ffff64',
    orange: '#ffa500',
    watermelon: '#ff6464',
    strawberry: '#ff0064',
    pineapple: '#ffc800'
  };
  
  juiceLine.style.setProperty('--juice-color', juiceColors[fruit.type] || '#ffffff');
  juiceLine.style.transform = `rotate(${angle}deg)`;
  gameContainer.appendChild(juiceLine);

  // Remove os efeitos após a animação
  setTimeout(() => {
    if (slice.parentNode) slice.parentNode.removeChild(slice);
    if (juiceLine.parentNode) juiceLine.parentNode.removeChild(juiceLine);
  }, 500);

  // Partículas de suco
  for (let i = 0; i < 5; i++) {
    createJuiceSplash(x, y, fruit.type);
  }

  // Cria metades da fruta
  fruit.half1 = document.createElement('div');
  fruit.half1.className = 'fruit-half';
  fruit.half1.style.width = `${fruit.size}px`;
  fruit.half1.style.height = `${fruit.size}px`;
  fruit.half1.style.left = `${fruit.x}px`;
  fruit.half1.style.top = `${fruit.y}px`;

  const img1 = document.createElement('img');
  img1.src = ITEM_IMAGES[fruit.type];
  img1.style.clipPath = 'polygon(0 0, 100% 0, 100% 50%, 0 50%)';
  img1.style.transform = 'translateY(-5px)';
  fruit.half1.appendChild(img1);

  fruit.half2 = document.createElement('div');
  fruit.half2.className = 'fruit-half';
  fruit.half2.style.width = `${fruit.size}px`;
  fruit.half2.style.height = `${fruit.size}px`;
  fruit.half2.style.left = `${fruit.x}px`;
  fruit.half2.style.top = `${fruit.y}px`;

  const img2 = document.createElement('img');
  img2.src = ITEM_IMAGES[fruit.type];
  img2.style.clipPath = 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)';
  img2.style.transform = 'translateY(5px)';
  fruit.half2.appendChild(img2);

  gameContainer.appendChild(fruit.half1);
  gameContainer.appendChild(fruit.half2);

  // Animação das metades
  setTimeout(() => {
    if (fruit.half1) {
      fruit.half1.style.transform = 'translate(-20px, 20px) rotate(-30deg)';
      fruit.half1.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
      fruit.half1.style.opacity = '0';
    }
    
    if (fruit.half2) {
      fruit.half2.style.transform = 'translate(20px, 20px) rotate(30deg)';
      fruit.half2.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
      fruit.half2.style.opacity = '0';
    }
  }, 10);

  // Adiciona pontos
  score += ITEM_SCORES[fruit.type];
  updateScoreDisplay();
}

function createJuiceSplash(x, y, fruitType) {
  const splash = document.createElement('div');
  splash.className = 'juice-splash';
  splash.style.left = `${x - 20}px`;

  splash.style.top = `${y - 20}px`;

  const juiceColors = {
    apple: 'rgba(255, 50, 50, 0.7)',
    banana: 'rgba(255, 255, 100, 0.7)',
    orange: 'rgba(255, 165, 0, 0.7)',
    watermelon: 'rgba(255, 100, 100, 0.7)',
    strawberry: 'rgba(255, 0, 100, 0.7)',
    pineapple: 'rgba(255, 200, 0, 0.7)'
  };

  splash.style.background = juiceColors[fruitType] || 'rgba(255, 255, 255, 0.7)';
  gameContainer.appendChild(splash);

  setTimeout(() => {
    if (splash.parentNode) {
      splash.parentNode.removeChild(splash);
    }
  }, 800);
}

function explodeBomb(index) {
  if (index < 0 || index >= items.length || items[index].exploded || items[index].type !== 'bomb' || !gameActive || gamePaused) return;

  const bomb = items[index];
  bomb.exploded = true;
  bomb.element.classList.add('exploded');

  const explosion = document.createElement('div');
  explosion.className = 'explosion';
  explosion.style.left = `${bomb.x - 75 + bomb.size / 2}px`;
  explosion.style.top = `${bomb.y - 75 + bomb.size / 2}px`;
  gameContainer.appendChild(explosion);

  setTimeout(() => {
    if (explosion.parentNode) {
      explosion.parentNode.removeChild(explosion);
    }
  }, 600);

  lives--;
  updateLivesDisplay();

  if (lives <= 0) {
    gameOver();
  }

}
function removeItem(index) {
  if (index < 0 || index >= items.length) return;

  const item = items[index];

  if (item.element && item.element.parentNode) {
    item.element.parentNode.removeChild(item.element);
  }

  if (item.half1 && item.half1.parentNode) {
    item.half1.parentNode.removeChild(item.half1);
  }

  if (item.half2 && item.half2.parentNode) {
    item.half2.parentNode.removeChild(item.half2);
  }

  items.splice(index, 1);
}

function updateScoreDisplay() {
  scoreDisplay.textContent = score;
}

function updateLivesDisplay() {
  const lifeElements = livesContainer.querySelectorAll('.life');
  lifeElements.forEach((life, index) => {
    life.style.backgroundColor = index < lives ? 'var(--danger-color)' : 'rgba(255, 255, 255, 0.2)';
  });
}

function gameOver() {
  gameActive = false;
  clearInterval(spawnIntervalId);
  cancelAnimationFrame(animationFrameId);

  // Atualiza o recorde se necessário
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('fruitNinjaHighScore', highScore);
    updateHighScoreDisplay();
    finalScoreDisplay.innerHTML = `Novo recorde!<br>${score}`;
  } else {
    finalScoreDisplay.innerHTML = `Pontuação: ${score}<br>Recorde: ${highScore}`;
  }
  
  gameOverScreen.style.display = 'flex';
}

// Inicia o jogo mostrando a tela inicial
startScreen.style.display = 'flex';