import Sound from './Sound.js'

// Load and set sound variables
const SOUNDS = {
    "background"   : new Sound("snd/back.mp3", 0.3, true),
    "hit"          : new Sound("snd/hit.wav", 0.4, false)
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
    }

    init() {
        const PROB_NORMAL = 0.7;
        const PROB_RARE = 0.2;
        const PROB_SUPER_RARE = 0.1;

        this.possibleEffects = {
            NORMAL_POINT:   {
                'effect': 'normal_point', 
                'prob': PROB_NORMAL, 
                'func': this.normal_point
            },
            INCREASE_SPEED: {
                'effect': 'increase_speed', 
                'prob': PROB_SUPER_RARE,
                'func': this.increase_speed
            }, 
            DECREASE_SPEED: {
                'effect': 'decrease_speed', 
                'prob': PROB_RARE,
                'func': this.decrease_speed
            },
            MINUS3: {
                'effect': 'minus3', 
                'prob': PROB_RARE,
                'func': this.minus3
            },
            PLUS3: {
                'effect': 'plus3', 
                'prob': PROB_SUPER_RARE,
                'func': this.plus3
            },
            DECREASE_RATIO: {
                'effect': 'decrease_ratio', 
                'prob': PROB_RARE,
                'func': this.decrease_ratio
            },
            INCREASE_RATIO: {
                'effect': 'increase_ratio', 
                'prob': PROB_RARE,
                'func': this.increase_ratio
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
            if (this.possibleEffects[name]["prob"] == probOfevent) {
                effectsToChoose.push(this.possibleEffects[name]["effect"]);
            }
        });

        let randomIndex = parseInt(effectsToChoose.length * Math.random());

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

    normal_point = () => {
        this.snake.appendToTail();
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

        this._height = 50;
        this._width = 70;

        if (window.matchMedia("(max-width:600px)").matches) {
            this._height = 60;
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
        this.init();                        // Reinit snake
        this.grid.paused = true;            // Pause game
        SOUNDS["background"].stop();        // Pause the background music
        this.view.togglePlayScreen();       // Show the play screen
        clearInterval(this.framesInterval); // Clearing frames interval
    }

    move = () => {
        let newHead = this.getNewHead();  // Calculating coordinates of new head
        let hit = this.checkHit(newHead); // Check and catch a hit 
        
        if (!this.hasCrashed()) {
            this.snake.pop();              // Removing tail
            this.snake.unshift(newHead);   // Appending new head
            this.grid.redraw(this.snake);  // Redrawing screen
        }

        return hit;
    }

    setNewGoals = () => {
        let needNewGoals = this.grid.goals.length < this.min_goals;
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
            if (e.code === "ArrowUp") {
                this.currentDirection = "up";
            } else if (e.code === "ArrowDown") {
                this.currentDirection = "down";
            } else if (e.code === "ArrowLeft") {
                this.currentDirection = "left";
            } else if (e.code === "ArrowRight") {
                this.currentDirection = "right";
            }
        });

        // Handle hammer events
        var hammertime = new Hammer(document.body);
        hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
        hammertime.on("swipeleft swiperight swipeup swipedown", (ev) => {
            var typeOfEvent = ev.type.split("swipe")[1];
            if (["up", "down", "left", "right"].includes(typeOfEvent)) {
                this.currentDirection = typeOfEvent;
            }
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

        this.handleEvents();
        this.renderTable();
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
            'decrease_ratio': 'decrease-ratio-goal-cell'
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
        // Remove all classes
        td.className = '';
        // Add style class
        td.classList.add(styleClass);
    }

    copyGrid = (grid) => {
        return grid.map((g) => {
            return g.slice();
        });
    }

    togglePlayScreen = function() {
        let display = document.querySelector("#view").style.display;
        if (display === "none") {
            display = "flex";
        } else {
            display = "none";
        }
        document.querySelector("#view").style.display = display;
    }

    handleEvents = function() {
        document.querySelector(".play-btn").addEventListener("click", () => {
            this.grid.paused = false;
            this.togglePlayScreen();
            SOUNDS["background"].play();
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