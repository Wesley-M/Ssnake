import Sound from './Sound.js'

// Load and set sound variables
const SOUNDS = {
    "background"   : new Sound("snd/back.mp3", 0.3, true),
    "hit"          : new Sound("snd/hit.wav", 0.4, false)
}

const BACK_CELL = 0;
const SNAKE_CELL = 1;
const GOAL_CELL = 2;
const HIDDEN_CELL = 3;

class Grid {
    constructor() {
        this._grid = [];
        this._width = 60;
        this._height = 40;
        this.goal = [];
        this.paused = true;

        this.clear();
        this.setGoal();
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

        let maxX = 8;
        let maxY = 8;

        // Redraw grid
        for (let i = 0; i < this._height; i++) {
            for (let j = 0; j < this._width; j++) {
                let distanceFromHead = Math.sqrt( ((i - headX) ** 2) + ((j - headY) ** 2) );
                if (distanceFromHead >= 10) {
                    this._grid[i][j] = HIDDEN_CELL;
                } else {
                    this._grid[i][j] = BACK_CELL;
                }
            }
        }

        // Place the goal again
        if (this._grid[this.goal[0]][this.goal[1]] != HIDDEN_CELL) {
            this._grid[this.goal[0]][this.goal[1]] = GOAL_CELL;
        }

        // Redraw snake
        snake.forEach(coordinate => {
            let x = coordinate[0];
            let y = coordinate[1];
            if (this._grid[y][x] != HIDDEN_CELL) {
                this._grid[y][x] = SNAKE_CELL;
            }
        });
    }

    setGoal = function(snake = [[0,0], [0,1]]) {
        let x = parseInt(Math.random() * this.height);
        let y = parseInt(Math.random() * this.width);

        if (includes(snake, [x,y])) {
            this.setGoal(snake);
        } else {
            this._grid[x][y] = GOAL_CELL;
            this.goal = [x, y];
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
        this.init();
    }

    init = function() {
        this.currentDirection = "down";
        this.snake = [[0,0], [0,1]];
        this.handleEvents();
        this.framesInterval = setInterval(this.move, 1000/10);
    }

    move = () => {
        if (!this.grid.paused) {
            this.snake.pop();                 // Removing tail
            let newHead = this._getNewHead(); // Calculating coordinates of new head

            if (this.hitGoal(newHead)) {
                this.grid.grid[this.grid.goal[0]][this.grid.goal[1]] = 0;
                this.grid.setGoal(this.snake);
                
                this.appendToTail();

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

        this.view.render();  // Rendering game
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
        return (head.toString() == this.grid.goal.slice().reverse().toString());
    }

    hasCrashed = function(head) {
        return includes(this.snake, head);
    }

    appendToTail = function() {
        let xTail = this.snake[this.snake.length - 1][0], yTail = this.snake[this.snake.length - 1][1];
        let newTail = [xTail + 1, yTail];
        this.snake.push(newTail);
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
}

class View {
    constructor(grid) {
        this.table = document.querySelector("table");
        this.grid = grid;
        this.handleEvents();
    }

    render = function() {
        this.table.innerHTML = "";
        for (let i = 0; i < this.grid.grid.length; i++) {
            let tr = document.createElement("tr");
            for (let j = 0; j < this.grid.grid[0].length; j++) {
                let td = document.createElement("td");
                
                let cellType = this.grid.grid[i][j];
                switch(cellType) {
                    case BACK_CELL:
                        td.classList.add("back-cell");
                        break;
                    case SNAKE_CELL:
                        td.classList.add("snake-cell");
                        break;
                    case GOAL_CELL:
                        td.classList.add("goal-cell");
                        break;
                    case HIDDEN_CELL:
                        td.classList.add("hidden-cell");
                        break;
                }

                tr.appendChild(td);
            }
            this.table.appendChild(tr);
        }
        document.querySelector("main").appendChild(this.table);
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