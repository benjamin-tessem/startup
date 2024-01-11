


// Playfield is 10x20, but there are 2 hidden rows above the playfield, where the tetrominos spawn
const playfieldWidth = 10;
const playfieldHeight = 20;
const playfieldHiddenRows = 2;

/**
 * @type {Array<Array<number>>}
 */
const playfield = Array(playfieldHeight + playfieldHiddenRows).fill(0).map(() => Array(playfieldWidth).fill(0));

/**
 *  @see https://tetris.fandom.com/wiki/SRS
 */
const tetrominos = {
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

const colors = {
    'I': 'cyan',
    'O': 'yellow',
    'T': 'purple',
    'S': 'green',
    'Z': 'red',
    'J': 'blue',
    'L': 'orange'
};

/**
 * Get random number between range [min, max]
 * @param {number} min 
 * @param {number} max 
 */
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + min);
}

/**
 * @type {string[]} tetromino 
 */
const globalSequence = [];

const randomGenerator = () => {
    const sequence = ["I", "J", "L", "O", "S", "T", "Z"];

    const seqLength = sequence.length;
    // randomly shuffle the sequence using get random int, and set that as the new sequence
    for (let i = 0; i < seqLength; i++) {
        const randomIndex = getRandomInt(0, seqLength - 1);
        const temp = sequence[i];
        sequence[i] = sequence[randomIndex];
        sequence[randomIndex] = temp;
    }
    globalSequence.push(...sequence);
}

/**
 * @param {HTMLCanvasElement} canvas 
 */
export const gameLoop = (canvas) => {
    const ctx = canvas.getContext('2d');
    // Fill the height of the canvas parent, then make the width 9:16
    const
}