# 🎮 Fruits Fight Demo

Um jogo de ação casual desenvolvido em JavaScript puro, onde os jogadores cortam frutas e evitam bombas para alcançar a maior pontuação possível.

## 📋 Características Principais

### Mecânicas de Jogo
- Sistema de pontuação progressivo
- Diferentes tipos de frutas com valores variados
- Bombas como elementos de risco
- Sistema de vidas
- Níveis de dificuldade crescente
- Efeitos visuais de corte e explosão

### Frutas e Pontuações
| Fruta    | Pontos | Velocidade |
|----------|--------|------------|
| Maçã     | 10     | Normal     |
| Banana   | 15     | Rápida     |
| Laranja  | 20     | Média      |
| Melancia | 25     | Lenta      |
| Morango  | 30     | Muito Rápida|
| Abacaxi  | 40     | Muito Lenta|

### Elementos Técnicos
- Animações CSS personalizadas
- Sistema de física para quedas
- Detecção de colisão
- Gerenciamento de estado do jogo
- Sistema de pause
- Interface responsiva

## 🛠️ Tecnologias Utilizadas
- HTML5
- CSS3 (com variáveis CSS)
- JavaScript Vanilla
- Font Awesome para ícones
- Flaticon para assets de frutas

## 🎯 Funcionalidades do Jogo

### Sistema de Níveis
- Dificuldade aumenta progressivamente
- Taxa de spawn de itens ajustável
- Velocidade das frutas variável
- Chance de spawn de bombas: 15%

### Interface do Usuário
- Menu principal interativo
- Tela de pausa
- Sistema de vidas visual
- Contador de pontuação
- Tela de game over
- Instruções integradas

### Efeitos Visuais
- Splash de suco ao cortar frutas
- Animação de explosão para bombas
- Frutas cortadas em duas metades
- Efeitos de partículas
- Sombras e filtros visuais

## 🎮 Como Jogar

1. **Objetivo**: Corte as frutas antes que caiam no chão
2. **Controles**: Use o mouse/touch para cortar
3. **Pontuação**: Cada fruta tem valor diferente
4. **Cuidado**: Bombas reduzem vidas
5. **Game Over**: Perde ao ficar sem vidas

## 🔧 Configurações do Jogo

```javascript
const INITIAL_SPAWN_RATE = 1500; // ms
const SPAWN_RATE_DECREASE = 50;  // ms por nível
const MIN_SPAWN_RATE = 500;      // ms
const LEVEL_UP_SCORE = 100;      // pontos
const MAX_LIVES = 3;             // vidas iniciais
```

## 📱 Responsividade
- Layout adaptativo para diferentes telas
- Suporte a touch events
- Interface otimizada para mobile
- Grid system responsivo
- Media queries para ajustes específicos

## 🚀 Performance
- Otimização de animações
- Gerenciamento eficiente de memória
- Limpeza automática de elementos
- Sistema de pause para economia de recursos
- Controle de frame rate

## 🎨 Personalização
- Sistema de cores com variáveis CSS
- Temas facilmente modificáveis
- Assets substituíveis
- Configurações ajustáveis
- Efeitos visuais customizáveis

## 🔄 Estados do Jogo
1. Tela Inicial
2. Jogo em Andamento
3. Jogo Pausado
4. Game Over
5. Retorno ao Menu

## 🎯 Próximas Atualizações Planejadas
- Sistema de recordes
- Novos tipos de frutas
- Power-ups especiais
- Modos de jogo adicionais
- Achievements

## 🌟 Recursos Futuros
- Multiplayer local
- Ranking online
- Novos efeitos visuais
- Modos de dificuldade
- Sistema de progressão

Este projeto demonstra implementação de mecânicas de jogo clássicas com tecnologias web modernas, oferecendo uma experiência divertida e responsiva para os jogadores.
