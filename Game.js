import Sound from './Sound.js'

// Load and set sound variables
const SOUNDS = {
    "background"   : new Sound("snd/back.mp3", 0.4, true),
    "hit"          : new Sound("snd/hit.wav", 0.5, false),
    "gameover"     : new Sound("snd/game_over.ogg", 0.4, false),
    "key_falling"  : new Sound("snd/key.wav", 0.4, false)
}

const INITIAL_SNAKE_LENGTH = 2;
const MIN_SPEED = 8;
const DEFAULT_SPEED = 10;
const DEFAULT_VISION_FIELD = 8;
const MINIMUM_VISION_FIELD = 6;

class Goal {
    constructor(snake, grid) {
        this.snake = snake;
        this.grid = grid;

        this.init();

        this.coordinate = this.randomCoordinate(); 
        this.effect = this.randomEffect();
        
        if (this.effect === this.possibleEffects.KEY['effect']) { 
            this.scheduleRemoveGoal(10000); 
            SOUNDS["key_falling"].play();
        }
    }

    init() {
        const PROB_NORMAL = 0.7;

        const RARE_PROBS = 1 - PROB_NORMAL;
        const PROB_RARE = 0.7 * RARE_PROBS;
        const PROB_SUPER_RARE = 0.2 * RARE_PROBS;
        const PROB_HIPER_RARE = 0.1 * RARE_PROBS;

        this.possibleEffects = {
            NORMAL_POINT:   {
                'effect': 'normal_point', 
                'prob': PROB_NORMAL, 
                'func': this.normal_point,
                'type': 'positive'
            },
            DEATH: {
                'effect': 'death', 
                'prob': PROB_SUPER_RARE, 
                'func': this.death,
                'type': 'negative'
            },
            KEY: {
                'effect': 'key', 
                'prob': PROB_HIPER_RARE,
                'func': this.key,
                'type': 'positive'
            },
            INCREASE_SPEED: {
                'effect': 'increase_speed', 
                'prob': PROB_SUPER_RARE,
                'func': this.increase_speed,
                'type': 'positive'
            }, 
            DECREASE_SPEED: {
                'effect': 'decrease_speed', 
                'prob': PROB_RARE,
                'func': this.decrease_speed,
                'type': 'negative'
            },
            MINUS3: {
                'effect': 'minus3', 
                'prob': PROB_RARE,
                'func': this.minus3,
                'type': 'negative'
            },
            PLUS3: {
                'effect': 'plus3', 
                'prob': PROB_SUPER_RARE,
                'func': this.plus3,
                'type': 'positive'
            },
            DECREASE_RATIO: {
                'effect': 'decrease_ratio', 
                'prob': PROB_RARE,
                'func': this.decrease_ratio,
                'type': 'negative'
            },
            INCREASE_RATIO: {
                'effect': 'increase_ratio', 
                'prob': PROB_RARE,
                'func': this.increase_ratio,
                'type': 'positive'
            }
        }
    }

    randomCoordinate = function() {
        let x = parseInt(Math.random() * this.grid.height);
        let y = parseInt(Math.random() * this.grid.width);

        // Ensure that the goal hasn't appeared below the snake
        if (includes(this.snake.snake, [y,x])) {
            this.randomCoordinate();
        }
     
        return [x, y];
    }

    randomEffect() {
        let randomProb = Math.random();

        let probabilities = this.getProbabilitiesFromEffects();
        let probOfevent = this.getProbOfEvent(randomProb, probabilities);
        let effectsToChoose = [];

        // Get all the effects that happen with this probability
        Object.keys(this.possibleEffects).forEach(name => {
            if (this.possibleEffects[name]["prob"].toFixed(3) == probOfevent) {
                effectsToChoose.push(this.possibleEffects[name]["effect"]);
            }
        });

        let randomIndex = parseInt(effectsToChoose.length * Math.random());

        console.log(effectsToChoose);

        return effectsToChoose[randomIndex];
    }

    getProbOfEvent(randomProb, probabilities) {
        let start = 0;

        for (let i = 0; i < probabilities.length; i++) {
            let interval_end = (start + probabilities[i]);
            if (randomProb >= start && randomProb < interval_end) {
                return (interval_end - start).toFixed(3);
            }
            start += probabilities[i];  
        }

        return -1;
    }

    getProbabilitiesFromEffects() {
        let repeatedProbabilities = Object.keys(this.possibleEffects).map(effectName => {
            return this.possibleEffects[effectName]['prob'];
        });

        let uniqueProbabilities = Array.from(new Set(repeatedProbabilities)).sort();

        return uniqueProbabilities;
    }

    applyEffect() {
        this.possibleEffects[this.effect.toUpperCase()]['func']();
        SOUNDS["hit"].play();
    }

    // ******** Effects functions ******* //

    scheduleRemoveGoal(time) {
        setTimeout(() => {
            let newGoals = this.grid.goals.filter(e => e !== this);
            this.grid.goals = newGoals;
        }, time);
    }

    normal_point = () => {
        this.snake.appendToTail();
    }

    death = () => {
        this.snake.restart();
    }

    key = () => {
        let win = new Event("win");
        document.getElementById("game").dispatchEvent(win);
    }

    plus3 = () => {
        for (let i = 0; i < 3; i++) {
            this.snake.appendToTail();
        }
    }

    minus3 = () => {
        for (let i = 0; i < 3; i++) {
            if (this.snake.length > INITIAL_SNAKE_LENGTH) {
                this.snake.removeFromTail();
            }
        }
    }

    increase_ratio = () => {
        this.snake.grid.vision_field += 3;
    }

    decrease_ratio = () => {
        if (this.snake.grid.vision_field > MINIMUM_VISION_FIELD) {
            this.snake.grid.vision_field -= 3;
        }
    }

    increase_speed = () => {
        clearInterval(this.snake.framesInterval);
        this.snake.velocity += 4;
        this.snake.framesInterval = setInterval(this.snake.update, 1000/this.snake.velocity);
    }

    decrease_speed = () => {
        if (this.snake.velocity > MIN_SPEED) {
            clearInterval(this.snake.framesInterval);
            this.snake.velocity -= 4;
            this.snake.framesInterval = setInterval(this.snake.update, 1000/this.snake.velocity);
        }
    }

}

const cellType = {
    BACK_CELL: 0,
    SNAKE_CELL: 1,
    GOAL_CELL: Goal,
    HIDDEN_CELL: 2
}

class Grid {
    constructor() {

        this._height = 40;
        this._width = 60;

        if (window.matchMedia("(max-width:600px)").matches) {
            this._height = 50;
            this._width = 40;
        }
        
        this._grid = [];
        this.goals = [];
        
        this.paused = true;
        this.vision_field = DEFAULT_VISION_FIELD;

        this.clear();
    }

    clear = function() {
        this._grid = [];
        let row = [];
        for (let j = 0; j < this.width; j++) { 
            row.push(0); 
        }
        for (let i = 0; i < this.height; i++) { 
            this._grid.push(row.slice()); 
        }
    }

    redraw = function(snake) {
        this.redrawGrid(snake);
        this.placeGoals();
        this.redrawSnake(snake);
    }

    redrawGrid = (snake) => {
        let snakeHead = snake[0];
        let headX = snakeHead[1], headY = snakeHead[0];

        for (let i = 0; i < this._height; i++) {
            for (let j = 0; j < this._width; j++) {
                let distanceFromHead = Math.sqrt( ((i - headX) ** 2) + ((j - headY) ** 2) );
                if (distanceFromHead >= this.vision_field) {
                    this._grid[i][j] = cellType.HIDDEN_CELL;
                } else {
                    this._grid[i][j] = cellType.BACK_CELL;
                }
            }
        }
    }
    
    redrawSnake = (snake) => {
        snake.forEach(coordinate => {
            let x = coordinate[0];
            let y = coordinate[1];
            if (this._grid[y][x] != cellType.HIDDEN_CELL) {
                this._grid[y][x] = cellType.SNAKE_CELL;
            }
        });
    }

    placeGoals = () => {
        this.goals.forEach(goal => {
            if (this._grid[goal.coordinate[0]][goal.coordinate[1]] === cellType.BACK_CELL) {
                this._grid[goal.coordinate[0]][goal.coordinate[1]] = goal;
            }
        });
    }

    setGoals = ({snake, numberOfGoals = 5}) => {
        for (let i = 0; i < numberOfGoals; i++) {
            let goal = new Goal(snake, this);
            this._grid[goal.coordinate[0]][goal.coordinate[1]] = goal;
            this.goals.push(goal);
        }
    }

    get width() {
        return this._width;
    }

    set width(newWidth) {
        this._width = newWidth;
    }

    get height() {
        return this._height;
    }

    set height(newHeight) {
        this._height = newHeight;
    }

    get grid() {
        return this._grid;
    }

    set grid(newGrid) {
        this._grid = newGrid;
    }
}

class Snake {
    constructor(grid, view) {
        this.grid = grid;
        this.view = view;
        this.score = 0;
        this.min_goals = 4;
        this.velocity = DEFAULT_SPEED;
        
        this.init();
        
        this.grid.setGoals({snake: this, numberOfGoals: (Math.random() * 5) + 5 });
    }

    init = function() {
        this.snake = [[0,0], [0,1]];
        this.velocity = DEFAULT_SPEED;
        this.grid.vision_field = DEFAULT_VISION_FIELD;
        this.currentDirection = "down";
        this.framesInterval = setInterval(this.update, 1000/this.velocity);
        this.handleEvents();

        this.oppositeDirection = {
            "up": "down",
            "left": "right",
            "right": "left",
            "down": "up"
        }
    }

    update = () => {
        let isPaused = this.grid.paused;

        if (!isPaused) {
            let goalHited = this.move();
            let goalWasHited = goalHited != null;

            if (goalWasHited) {
                this.setNewGoals();       // Setting new goals
                goalHited.applyEffect();  // Applying effect of goal
            }
            
            if (this.hasCrashed()) { this.restart(); }

            this.score = this.snake.length - INITIAL_SNAKE_LENGTH; // Setting score
            this.view.update(this);                                // Rendering game
        }
    }

    restart = () => {
        clearInterval(this.framesInterval); // Clearing frames interval
        this.init();                        // Reinit snake
        this.grid.paused = true;            // Pause game
        SOUNDS["background"].stop();        // Pause the background music
        SOUNDS["background"].resetTime();
        this.view.addGameOverScreen();      // Show the game over screen
        SOUNDS["gameover"].play();          // Play the game over music
        this.velocity = DEFAULT_SPEED;      // Setting default speed
    }

    move = () => {
        let hit = null;

        let newHead = this.getNewHead();  // Calculating coordinates of new head
        hit = this.checkHit(newHead);     // Check and catch a hit 
    
        if (!this.hasCrashed()) {
            this.snake.pop();              // Removing tail
            this.snake.unshift(newHead);   // Appending new head
            this.grid.redraw(this.snake);  // Redrawing screen
        }

        return hit;
    }

    setNewGoals = () => {
        let positiveGoals = this.grid.goals.filter(g => {
            console.log(g);
            return g.possibleEffects[g.effect.toUpperCase()].type === "positive";
        });

        let needNewGoals = positiveGoals.length < this.min_goals;
        
        if (needNewGoals) { 
            this.grid.setGoals({snake: this}); 
        }
    }

    getNewHead = function() {
        let oldHead = this.snake[0];        // Getting old head
        let x = oldHead[0], y = oldHead[1]; // Old head coordinates

        let newHead = [];
        if (this.currentDirection === "up") {
            let newY = (y - 1) < 0 ? this.grid.height - 1 : y - 1;
            newHead = [x, newY];
        } else if (this.currentDirection === "down") {
            let newY = (y + 1) > this.grid.height - 1 ? 0 : y + 1;
            newHead = [x, newY];
        } else if (this.currentDirection === "right") {
            let newX = (x + 1) > this.grid.width - 1 ? 0 : x + 1;
            newHead = [newX, y];
        } else if (this.currentDirection === "left") {
            let newX = (x - 1) < 0 ? this.grid.width - 1 : x - 1;
            newHead = [newX, y];
        }

        return newHead;
    }

    checkHit = function(head) {
        let hit = null;
        this.grid.goals.forEach(goal => {
            if (head.toString() == goal.coordinate.slice().reverse().toString()) {
                hit = goal;

                // Setting old goal as normal cell
                this.grid.grid[goal.coordinate[0]][goal.coordinate[1]] = cellType.BACK_CELL;

                // Removing from goals
                this.grid.goals = this.grid.goals.filter((g, index, array) => {
                    return g.coordinate.toString() != [goal.coordinate[0], goal.coordinate[1]].toString();
                });
            }
        });
        return hit;
    }

    hasCrashed = () => {
        let head = this.snake[0];
        
        let elementsEqualsToHead = this.snake.filter(el => {
            if (el.toString() === head.toString()) {
                return true;
            }
        });

        return elementsEqualsToHead.length >= 2;
    }

    appendToTail = function() {
        let xTail = this.snake[this.snake.length - 1][0];
        let yTail = this.snake[this.snake.length - 1][1];
        
        // Mapping of current direction to new tail
        const newTail = {
            'up'   : [xTail, yTail + 1], 
            'left' : [xTail + 1, yTail],
            'right': [xTail - 1, yTail],
            'down' : [xTail, yTail - 1]
        };

        this.snake.push(newTail[this.currentDirection]);
    }

    removeFromTail = function() {
        this.snake.pop();
    }

    handleEvents = function() {
        document.addEventListener('keyup', (e) => {
            let direction = e.key.split("Arrow")[1].toLowerCase();
            if (["up", "down", "left", "right"].includes(direction)) {
                if (direction !== this.oppositeDirection[this.currentDirection]) {
                    this.currentDirection = direction;
                }
            }
        });

        let joystick = this.newJoystick();
        joystick.on('dir:up dir:down dir:left dir:right', (e) => {
            let direction = e.type.split("dir:")[1];
            if (direction !== this.oppositeDirection[this.currentDirection]) {
                this.currentDirection = direction;
            }
        })
    }

    newJoystick() {
        return nipplejs.create({
            zone: document.querySelector('table'),
            mode: 'static',
            position: {left: '75%', top: '85%'},
            color: 'white'
        });
    }

    get length() {
        return this.snake.length;
    }
}

// Used to render the game
class View {
    constructor(grid) {
        this.init();
        
        this.table = document.querySelector("table");
        this.grid = grid;
        this.lastGrid = this.copyGrid(grid.grid);

        this.addPlayScreen();
        this.renderTable();
        this.handleEvents();
    }

    init() {
        // Mapping of goals to cell classes
        this.cellEffectsToClasses = {
            'normal_point': 'normal-point-goal-cell',
            'plus3': 'plus-three-goal-cell',
            'minus3': 'minus-three-goal-cell',
            'increase_speed': 'increase-speed-goal-cell',
            'decrease_speed': 'decrease-speed-goal-cell',
            'increase_ratio': 'increase-ratio-goal-cell',
            'decrease_ratio': 'decrease-ratio-goal-cell',
            'death': 'death-goal-cell',
            'key': 'key-goal-cell'
        };

        this.cellTypesToClasses = [
            'back-cell',
            'snake-cell',
            'hidden-cell'
        ];

    }

    renderTable() {
        for (let i = 0; i < this.grid.grid.length; i++) {
            let tr = document.createElement("tr");
            for (let j = 0; j < this.grid.grid[0].length; j++) {
                let td = document.createElement("td");
                this.changeCellClass(td, this.grid.grid[i][j]);
                tr.appendChild(td);
            }
            this.table.appendChild(tr);
        }
    }

    update = function(snake) {
        let gridCoordinates = this.grid.grid;
        for (let i = 0; i < gridCoordinates.length; i++) {
            for (let j = 0; j < gridCoordinates[0].length; j++) {
                if (gridCoordinates[i][j] != this.lastGrid[i][j]) {
                    this.changeCellClass(this.table.rows[i].cells[j], gridCoordinates[i][j]);
                }
            }
        }
        this.lastGrid = this.copyGrid(gridCoordinates);
        document.querySelector("#score-value").innerHTML = snake.score;
    }

    changeCellClass = (td, gridCell) => {
        let styleClass = "";
        if (gridCell instanceof Goal) {
            styleClass = this.cellEffectsToClasses[gridCell.effect];
        } else {
            styleClass = this.cellTypesToClasses[gridCell];
        }
        td.className = '';
        td.classList.add(styleClass);
    }

    copyGrid = (grid) => {
        return grid.map((g) => {
            return g.slice();
        });
    }

    addPlayScreen = function() {
        let screen = document.querySelector(".view");
        screen.innerHTML = '<button class="play-btn">PLAY</button>';
        screen.style.display = "flex";
        this.addPlayEvent();
    }

    addGameOverScreen = () => {
        let screen = document.querySelector(".view");
        screen.innerHTML = '<p>Game Over</p> <button class="play-btn">RESTART</button>';
        screen.style.display = "flex";
        this.addPlayEvent();
    }

    addWinScreen = () => {
        let screen = document.querySelector(".view");
        screen.innerHTML = '<p>You\'ve got a key</p> <button class="play-btn">CONTINUE</button>';
        screen.style.display = "flex";
        this.grid.paused = true;
        this.addPlayEvent();
    }

    hideScreens = () => {
        document.querySelector(".view").style.display = "none";
    }

    addPlayEvent = function() {
        document.querySelector(".play-btn").addEventListener("click", () => {
            this.hideScreens();
            this.grid.paused = false;
            SOUNDS["background"].play();
            SOUNDS["gameover"].stop();
            SOUNDS["gameover"].resetTime();
        });
    }

    handleEvents() {
        document.getElementById("game").addEventListener('win', (e) => {
            this.addWinScreen();
        });
    }
    
}

function includes(array, el) {
    let includes = array.some(a => el.every((v, i) => v === a[i]));
    return includes;
}

function main() {
    let grid = new Grid();
    let view = new View(grid);
    let snake = new Snake(grid, view);
}

main();