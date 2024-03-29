const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;

const client = new MongoClient(url);
const db = client.db("tetris");
const userCollection = db.collection("users");
const scoreCollection = db.collection("scores");

/**
 * Gets a user from the database
 * @param {string} username
 */
const getUser = (username) => {
    return userCollection.findOne({ username: username });
}

/**
 * Get a user by their access token
 * @param {string} token
 */
const getUserByToken = (token) => {
    return userCollection.findOne({ token: token });
}

/**
 * Create a new user
 * @param {string} username 
 * @param {string} password 
 * @returns 
 */
const createUser = async (username, password) => {
    const hash = await bcrypt.hash(password, 10);
    const token = uuid.v4();

    await userCollection.insertOne({
        username: username,
        password: hash,
        token: token
    });

    return {
        username: username,
        token: token
    };
}

/**
 * Create a new score
 * @param {string} username 
 * @param {number} score 
 */
const createScore = async (username, score) => {
    await scoreCollection.insertOne({
        username: username,
        score: score,
        // Set the date to a iso string
        date: new Date().toISOString()
    });
}

/**
 * Get the top 10 scores
 * @returns {Promise<Array<object>>} An array of high scores
 */
const getHighScores = async () => {
    const scores = await scoreCollection.find().sort({ score: -1 }).limit(10).toArray();
    return scores;
}


module.exports = {
    getUser,
    getUserByToken,
    createUser,
    createScore,
    getHighScores
}
