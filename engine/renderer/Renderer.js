class Renderer {
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

        document.querySelector("#help-button").addEventListener('click', (e) => {
            Swal.fire({
                title: 'Instructions',
                showCloseButton: true,
                html: `  
                    <div id="tutorial">
                        <p>Hi! I am Wesley-M, the developer behind Ssnake, a game 
                        based on the classical one, but with a new face! I hope 
                        that the game will remind you of the fun of snake!</p>
                        
                        <p class="large-font">Here is the rules:</p>
                        <ul>
                            <li>Don't clash with your body (LoL)</li>
                        </ul>
        
                        <p>As you will notice the balls have different colors, and each 
                        color has an effect on your snake. </p>
        
                        <p class="mid-font">The possible effects are:</p>
        
                        <ul>
                            <li>
                                Game over instantenously
                            </li>
                            <li>
                                Key to winning
                            </li>
                            <li>
                                Increase ratio of vision field
                            </li>
                            <li>
                                Decrease ratio of vision field
                            </li>
                            <li>
                                Plus three points
                            </li>
                            <li>
                                Minus three points
                            </li>
                            <li>
                                Increase speed
                            </li>
                            <li>
                                Decrease speed
                            </li>
                        </ul>
        
                        <p class="large-font center"> Discover the colors and its effects ^-^ </p>
                    </div>
                `,
                icon: 'question',
                confirmButtonText: 'Cool'
            })
        });
    }
    
}