


// Playfield is 10x20, but there are 2 hidden rows above the playfield, where the tetrominos spawn
const playfieldWidth = 10;
const playfieldHeight = 20;
const playfieldHiddenRows = 2;


/**
 * @type {{[key: string]: Array<Array<number>>}}
 *  @see https://tetris.fandom.com/wiki/SRS
 */
export const tetrominos = {
    'I': [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    'J': [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    'L': [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    'O': [
        [1, 1],
        [1, 1],
    ],
    'S': [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    'Z': [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
    'T': [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
    ]
};

export const colors = {
    'I': 'cyan',
    'O': 'yellow',
    'T': 'purple',
    'S': 'green',
    'Z': 'red',
    'J': 'blue',
    'L': 'orange'
};

export class Game {

    /**
     * @type {string[]} tetrominos
     */
    #sequence = [];

    #grid = 32;
    #count = 0;
    #gameOver = false;
    #animationFrame = null

    #level = 1;
    #linesCleared = 0;

    // formula to determine amount of lines to clear to level up
    #linesToLevelUp = this.#level * 10;

    #speedMultiplier = 1 + (this.#level - 1) * 0.1;

    #tetromino = null;

    /**
    * First 2 rows are hidden, so we add 2 to the height
    * Those two first rows are the boundary, if any tetromino reaches those rows, the game is over
    * @type {Array<Array<number>>}
    */
    #playfield = []


    /**
     * Constructor
     * @param {HTMLCanvasElement} canvas 
     * @param {(restart: () => void) => void} onEnd 
     * @param {(tetromino: string) => void} nextBlock 
     * @param {(score: number) => void} setScore 
     * @param {(level: number) => void} setLevel
     */
    constructor(canvas, onEnd, nextBlock, setScore, setLevel) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.onEnd = onEnd;
        this.nextBlock = nextBlock;
        this.setScore = setScore;
        this.setLevel = setLevel;

        setLevel(this.#level);
        this.buildPlayfield();

        this.randomGenerator();
        // Initialize the tetromino
        this.#tetromino = this.getNextTetromino();

    }

    buildPlayfield = () => {
        // Start the index at -2, so the first 2 tetrominos are hidden
        for (let row = -playfieldHiddenRows; row < playfieldHeight; row++) {
            this.#playfield[row] = [];

            for (let col = 0; col < 10; col++) {
                this.#playfield[row][col] = 0;
            }
        }
    }


    /**
    * Get random number between range [min, max]
    * @param {number} min 
    * @param {number} max 
    */
    getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + min);
    }

    getNextTetromino = () => {
        if (this.#sequence.length === 0) {
            this.randomGenerator();
        }
        // This will never be undefined, because we call randomGenerator() if the sequence is empty
        const tetromino = this.#sequence.shift();
        const matrix = tetrominos[tetromino];

        // I and O start centered, the rest start 1 block to the left
        const col = this.#playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

        // I starts 2 blocks above the playfield, the rest start 1 block above
        const row = tetromino === 'I' || tetromino === 'O' ? -2 : -1;

        if (this.#sequence.length === 0) {
            this.randomGenerator();
        }

        this.nextBlock(this.#sequence[0])

        return {
            matrix,
            tetromino,
            row,
            col
        }
    }

    /**
    * Rotates a matrix 90 degrees clockwise
    * @param {Array<Array<number>>} matrix 
    * @returns 
    */
    rotate = (matrix) => {
        const N = matrix.length - 1;
        const result = matrix.map((row, i) => row.map((val, j) => matrix[N - j][i]));
        return result;
    }

    /**
    * 
    * @param {Array<Array<number>>} matrix 
    * @param {number} cellRow 
    * @param {number} cellCol 
    */
    isValidMove = (matrix, cellRow, cellCol) => {
        const result = matrix.every((row, dy) => {
            return row.every((val, dx) => {
                const col = cellCol + dx;
                const row = cellRow + dy;

                return !(val && (col < 0 || col >= this.#playfield[0].length || row >= this.#playfield.length || this.#playfield[row][col]));
            })
        })
        return result;
    }

    /**
    * 
    * @param {{col: number, row: number, matrix: Array<Array<number>>, tetromino: string}} tetromino 
    */
    placeTetromino = () => {
        // for every item in the tetromino matrix, if it's 1, place it in the playfield
        // if that cell is above the playfield, or rather in row 0 or 1, then game over
        this.#tetromino.matrix.forEach((row, dy) => {
            row.forEach((val, dx) => {
                if (val) {
                    const y = this.#tetromino.row + dy;
                    const x = this.#tetromino.col + dx;
                    if (y < playfieldHiddenRows) {
                        this.displayGameOver();
                    }
                    this.#playfield[y][x] = this.#tetromino.tetromino;
                }
            })
        })
        let cleared = 0;
        // Check for line clears, starting bottom up
        for (let row = this.#playfield.length - 1; row >= 0;) {
            // if the row is full, clear it and shift every row above it down
            if (this.#playfield[row].every(cell => !!cell)) {
                // clear the row
                this.#playfield.splice(row, 1);
                // add a new row at the top
                this.#playfield.unshift(Array(playfieldWidth).fill(0));
                cleared++;
            } else {
                // We only decrement the row if we didn't clear it, because if we did, the row above it is now the current row
                row--;
            }
        }

        // if we cleared any lines, update the score
        this.setScore?.(this.calcScore(cleared));
        this.#linesCleared += cleared;
        this.calcLevel();
        // Get the next tetromino
        this.#tetromino = this.getNextTetromino();
    }

    /**
     * Calculates the score based on the amount of lines cleared
     * @param {number} cleared 
     * @returns 
     */
    calcScore = (cleared) => {
        let score = 0;
        switch (cleared) {
            case 1:
                score = 40 * this.#level;
                break;
            case 2:
                score = 100 * this.#level;
                break;
            case 3:
                score = 300 * this.#level;
                break;
            case 4:
                score = 1200 * this.#level;
                break;
            default:
                break;
        }
        return score;
    }

    /**
     * Calculates the level based on the amount of lines cleared
     */
    calcLevel = () => {
        // formula to determine amount of lines to clear to level up
        this.#linesToLevelUp = this.#level * 10;
        if (this.#linesCleared >= this.#linesToLevelUp) {
            this.#level++;
            this.#speedMultiplier = 1 + (this.#level - 1) * 0.1;
            this.setLevel?.(this.#level);
            this.#linesCleared = 0;
        }
    }

    randomGenerator = () => {
        const sequence = ["I", "J", "L", "O", "S", "T", "Z"];
        //const sequence = ["O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O"];
        const seqLength = sequence.length;
        // randomly shuffle the sequence using get random int, and set that as the new sequence
        for (let i = 0; i < seqLength; i++) {
            const randomIndex = this.getRandomInt(0, seqLength - 1);
            const temp = sequence[i];
            sequence[i] = sequence[randomIndex];
            sequence[randomIndex] = temp;
        }
        this.#sequence.push(...sequence);
    }

    displayGameOver = () => {
        cancelAnimationFrame(this.#animationFrame);

        this.#gameOver = true;

        // Display game over text
        // Give a button to restart the game
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, this.ctx.canvas.height / 2 - 30, this.ctx.canvas.width, 60);
        this.ctx.fillStyle = 'red';
        this.ctx.font = '36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('GAME OVER', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
        this.removeListeners();
        this.onEnd(() => this.restart());
    }

    restart = () => {
        this.#sequence = [];
        this.#playfield = [];
        this.buildPlayfield();
        this.#gameOver = false;
        this.#playfield.forEach(row => row.fill(0));
        this.setScore?.(0);
        this.#level = 1;
        this.#linesCleared = 0;
        this.#speedMultiplier = 1 + (this.#level - 1) * 0.1;
        this.setLevel?.(this.#level);
        this.randomGenerator();
        this.#tetromino = this.getNextTetromino();
        this?.nextBlock(this.#sequence[0]);
        this.setupListeners();
        this.gameLoop();
    }

    /**
    * Main game loop
    */
    gameLoop = () => {
        this.#animationFrame = requestAnimationFrame(this.gameLoop);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // create the playfield grid
        for (let row = 0; row < playfieldHeight; row++) {
            for (let col = 0; col < playfieldWidth; col++) {
                if (this.#playfield[row][col]) {
                    const name = this.#playfield[row][col]
                    this.ctx.fillStyle = colors[name];

                    this.ctx.fillRect(col * this.#grid, row * this.#grid, this.#grid - 1, this.#grid - 1);
                }
            }
        }

        if (this.#tetromino) {
            if (++this.#count > 35 / this.#speedMultiplier) {
                this.#tetromino.row++;
                this.#count = 0;
                if (!this.isValidMove(this.#tetromino.matrix, this.#tetromino.row, this.#tetromino.col)) {
                    this.#tetromino.row--;
                    this.placeTetromino();
                }
            }

            this.ctx.fillStyle = colors[this.#tetromino.tetromino];

            this.#tetromino.matrix.forEach((row, dy) => {
                row.forEach((val, dx) => {
                    if (val) {
                        this.ctx.fillRect((this.#tetromino.col + dx) * this.#grid, (this.#tetromino.row + dy) * this.#grid, this.#grid - 1, this.#grid - 1);
                    }
                })
            })
        }
    }


    /**
     * 
     * @param {KeyboardEvent} e 
     */
    keyboardListeners = (e) => {
        if (this.#gameOver) {
            return;
        }
        if (e.key === 'ArrowLeft') {
            if (this.isValidMove(this.#tetromino.matrix, this.#tetromino.row, this.#tetromino.col - 1)) {
                this.#tetromino.col--;
            }
        } else if (e.key === 'ArrowRight') {
            if (this.isValidMove(this.#tetromino.matrix, this.#tetromino.row, this.#tetromino.col + 1)) {
                this.#tetromino.col++;
            }
        } else if (e.key === ' ') {
            // Make the piece drop down to the bottom of the playfield when this is pressed, rather than move down 1 block
            let dropRow = this.#tetromino.row;
            while (this.isValidMove(this.#tetromino.matrix, dropRow, this.#tetromino.col)) {
                dropRow++;
            }
            this.#tetromino.row = dropRow - 1;
            this.placeTetromino();
        }

        else if (e.key === 'ArrowDown') {

            if (this.isValidMove(this.#tetromino.matrix, this.#tetromino.row + 1, this.#tetromino.col)) {
                this.#tetromino.row++;

            }
        } else if (e.key === "ArrowUp") {
            const rotated = this.rotate(this.#tetromino.matrix);
            if (this.isValidMove(rotated, this.#tetromino.row, this.#tetromino.col)) {
                this.#tetromino.matrix = rotated;
            }
        }
    }


    start = () => {

        // Set the canvas to fill the parent container

        // this.canvas.height = this.canvas.parentElement.clientHeight;
        // // 10x20 playfield, but we need 2 hidden rows above the playfield
        // this.canvas.width = this.canvas.height / 2;
        // Set the background color to black so we can see the grid
        this.canvas.style.backgroundColor = 'black';

        // listeners
        this.setupListeners();

        this.gameLoop();
    }

    setupListeners = () => {
        document.addEventListener('keydown', this.keyboardListeners);

    }

    removeListeners = () => {
        document.removeEventListener('keydown', this.keyboardListeners);
        // Add touch event listeners
    }
}
