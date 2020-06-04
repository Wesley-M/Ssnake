export default class Snake {
    constructor() {
        this.body = [{}]
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

        if (window.matchMedia("(max-width:800px)").matches) {
            let joystick = this.newJoystick();
            joystick.on('dir:up dir:down dir:left dir:right', (e) => {
                let direction = e.type.split("dir:")[1];
                if (direction !== this.oppositeDirection[this.currentDirection]) {
                    this.currentDirection = direction;
                }
            });
        }
    }

    newJoystick() {
        return nipplejs.create({
            zone: document.querySelector('table'),
            mode: 'static',
            position: {left: '70%', top: '85%'},
            color: 'white',
            size: 135
        });
    }

    get length() {
        return this.snake.length;
    }
}