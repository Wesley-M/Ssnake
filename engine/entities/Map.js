export default class Grid {
    constructor() {

        this.height = 35;
        this.width = 30;
        
        this.blocks = [];
        
        this.goals = [];
        
        this.paused = true;
        this.vision_field = DEFAULT_VISION_FIELD;

        this.clear();
    }

    // mobile_adapt() {
    //     if (window.matchMedia("(max-width:800px)").matches) {
    //         this._height = 45;
    //         this._width = 40;
    //     }
    // }

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
