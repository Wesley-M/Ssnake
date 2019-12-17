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

class Goal {
    constructor(snake, grid) {
        this.possibleEffects = {
            NORMAL_POINT: "normal",
            INCREASE_SPEED: 'increase_speed',
            DECREASE_SPEED: 'decrease_speed',
            MINUS3: 'minus3',
            PLUS3: 'plus3',
            INCREASE_RATIO: 'increase_ratio'
        }

        this.snake = snake;
        this.grid = grid;
        this.coordinate = this.randomCoordinate(); 
        this.effect = this.randomEffect();
    }

    randomCoordinate = function() {
        let x = parseInt(Math.random() * this.grid.height);
        let y = parseInt(Math.random() * this.grid.width);

        if (includes(this.snake.snake, [y,x])) {
            this.randomCoordinate();
        }

        console.log([x,y]);

        return [x, y];
    }

    randomEffect() {
        let randomP = Math.random();
        
        let effect = "";
        
        let tenPercent = randomP > 0.9 && randomP < 1;
        let thirtyPercent = randomP >= 0 && randomP <= 0.3;

        if (tenPercent) {
            let randomE = Math.random();
            if (randomE <= 0.33) {
                effect = this.possibleEffects.PLUS3;
            } else if (randomE <= 0.66){
                effect = this.possibleEffects.INCREASE_RATIO;
            } else {
                effect = this.possibleEffects.MINUS3;
            }
        } else if (thirtyPercent)  {
            let randomE = Math.random();
            if (randomE < 0.5) {
                effect = this.possibleEffects.INCREASE_SPEED;
            } else {
                effect = this.possibleEffects.DECREASE_SPEED;
            }
        } else {
            effect = this.possibleEffects.NORMAL_POINT;
        }

        return effect;
    }

    applyEffect() {
        switch(this.effect) {
            case this.possibleEffects.PLUS3:
                for (let i = 0; i < 3; i++) {
                    this.snake.appendToTail();
                }
                break;
            case this.possibleEffects.INCREASE_RATIO:
                this.snake.grid.vision_field += 3;
                break;
            case this.possibleEffects.MINUS3:
                for (let i = 0; i < 3; i++) {
                    if (this.snake.length > INITIAL_SNAKE_LENGTH) {
                        this.snake.removeFromTail();
                    }
                }
                break;
            case this.possibleEffects.INCREASE_SPEED:
                clearInterval(this.snake.framesInterval);
                this.snake.velocity += 4;
                this.snake.framesInterval = setInterval(this.snake.move, 1000/this.snake.velocity);
                break;
            case this.possibleEffects.DECREASE_SPEED:
                if (this.snake.velocity > MIN_SPEED) {
                    clearInterval(this.snake.framesInterval);
                    this.snake.velocity -= 4;
                    console.log(this.snake.velocity);
                    this.snake.framesInterval = setInterval(this.snake.move, 1000/this.snake.velocity);
                }
                break;
            case this.possibleEffects.NORMAL_POINT:
                this.snake.appendToTail();
                break;
        }
    }

}

const cellType = {
    BACK_CELL: 0,
    SNAKE_CELL: 1,
    GOAL_CELL: Goal,
    HIDDEN_CELL: 3
}

class Grid {
    constructor() {
        this._height = 40;
        this._width = 60;
        
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

        let snakeHead = snake[0];
        let headX = snakeHead[1], headY = snakeHead[0];

        // Redraw grid
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

        // Place the goals again
        this.goals.forEach(goal => {
            if (this._grid[goal.coordinate[0]][goal.coordinate[1]] != cellType.HIDDEN_CELL) {
                this._grid[goal.coordinate[0]][goal.coordinate[1]] = goal;
            }
        });

        // Redraw snake
        snake.forEach(coordinate => {
            let x = coordinate[0];
            let y = coordinate[1];
            if (this._grid[y][x] != cellType.HIDDEN_CELL) {
                this._grid[y][x] = cellType.SNAKE_CELL;
            }
        });
    }

    setGoals = ({snake, numberOfGoals = 3}) => {
        console.log(snake);
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
        this.velocity = DEFAULT_SPEED;
        this.min_goals = 2;
        this.score = 0;
        this.init();
        this.grid.setGoals({snake: this, numberOfGoals: Math.random() * 5});
    }

    init = function() {
        this.currentDirection = "down";
        this.velocity = DEFAULT_SPEED;
        this.grid.vision_field = DEFAULT_VISION_FIELD;
        this.snake = [[0,0], [0,1]];
        this.handleEvents();
        this.framesInterval = setInterval(this.move, 1000/this.velocity);
    }

    move = () => {
        if (!this.grid.paused) {
            this.snake.pop();                 // Removing tail
            let newHead = this._getNewHead(); // Calculating coordinates of new head

            let hit = this.hitGoal(newHead);

            if (hit != null) {

                if (this.grid.goals.length < this.min_goals) {
                    this.grid.setGoals({snake: this});
                }
                
                hit.applyEffect();

                this.snake.unshift(newHead);
                this.grid.redraw(this.snake);

                SOUNDS["hit"].stop();
                SOUNDS["hit"].play();
            } else {
                if (this.hasCrashed(newHead)) {
                    this.init();                          // Restarting
                    this.grid.paused = true;
                    SOUNDS["background"].stop();
                    this.view.togglePlayScreen();
                    clearInterval(this.framesInterval);   // Clearing frames interval
                } else {
                    this.snake.unshift(newHead);       // Setting new head
                    this.grid.redraw(this.snake); // Updating grid
                }
            }
        }

        this.score = this.snake.length - INITIAL_SNAKE_LENGTH;

        this.view.render(this);  // Rendering game
    }

    _getNewHead = function() {
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

    hitGoal = function(head) {
        let hit = null;
        this.grid.goals.forEach(goal => {
            if (head.toString() == goal.coordinate.slice().reverse().toString()) {
                hit = goal;

                console.log(goal.effect);

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

    hasCrashed = function(head) {
        return includes(this.snake, head);
    }

    appendToTail = function() {
        let xTail = this.snake[this.snake.length - 1][0], yTail = this.snake[this.snake.length - 1][1];
        let newTail = [xTail + 1, yTail];
        this.snake.push(newTail);
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
    }

    get length() {
        return this.snake.length;
    }
}

// Used to render the game
class View {
    constructor(grid) {
        this.table = document.querySelector("table");
        this.grid = grid;
        this.handleEvents();
    }

    render = function(snake) {
        this.table.innerHTML = "";
        for (let i = 0; i < this.grid.grid.length; i++) {
            let tr = document.createElement("tr");
            for (let j = 0; j < this.grid.grid[0].length; j++) {
                let td = document.createElement("td");
                
                let cell = this.grid.grid[i][j];
                switch(cell) {
                    case cellType.BACK_CELL:
                        td.classList.add("back-cell");
                        break;
                    case cellType.SNAKE_CELL:
                        td.classList.add("snake-cell");
                        break;
                    case cellType.HIDDEN_CELL:
                        td.classList.add("hidden-cell");
                        break;
                }

                if (cell instanceof Goal) {
                    switch(cell.effect) {
                        case cell.possibleEffects.NORMAL_POINT:
                            td.classList.add("normal-point-goal-cell");
                            break;
                        case cell.possibleEffects.PLUS3:
                            td.classList.add("plus-three-goal-cell");
                            break;
                        case cell.possibleEffects.MINUS3:
                            td.classList.add("minus-three-goal-cell");
                            break;
                        case cell.possibleEffects.INCREASE_SPEED:
                            td.classList.add("increase-speed-goal-cell");
                            break;
                        case cell.possibleEffects.DECREASE_SPEED:
                            td.classList.add("decrease-speed-goal-cell");
                            break;
                        case cell.possibleEffects.INCREASE_RATIO: 
                            td.classList.add("increase-ratio-goal-cell");
                            break;
                    }
                }

                tr.appendChild(td);
            }
            this.table.appendChild(tr);
        }

        document.querySelector("main").appendChild(this.table);

        document.querySelector("#score-value").innerHTML = snake.score;
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