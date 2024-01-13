
const express = require('express');
const cookieParser = require('cookie-parser');
const { createUser, getUser, getUserByToken, createScore, getHighScores } = require('./database');
const bcrypt = require('bcrypt');
const peerProxy = require('./ws');
const app = express();


const port = process.argv.length > 2 ? process.argv[2] : 4000;

const authTokenName = 'auth';

/**
 * Set the auth cookie
 * @param {*} res 
 * @param {string} token 
 */
const setAuthCookie = (res, token) => {
    res.cookie(authTokenName, token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    });
}


app.use(express.json());
// Auth tokens
app.use(cookieParser());

// Static 
app.use(express.static('public'));

// Trust headers that are forwarded from the proxy so we can determine IP addresses
app.set('trust proxy', true);


const router = express.Router();
app.use('/api', router);

// Create a new user
router.post("/auth/register", async (req, res) => {
    const username = req.body?.username;
    const password = req.body?.password;

    if (!username || !password) {
        res.status(400).send({ error: "Invalid username or password" });
        return;
    }

    if (await getUser(req.body.username)) {
        res.status(400).send({ error: "Username already exists" });
        return;
    }
    const newUser = await createUser(username, password);
    setAuthCookie(res, newUser.token);
    res.status(204).send();
})

// Login
router.post("/auth/login", async (req, res) => {
    const username = req.body?.username;
    const password = req.body?.password;

    if (!username || !password) {
        res.status(400).send({ error: "Invalid username or password" });
        return;
    }

    const user = await getUser(username);

    if (!user) {
        res.status(400).send({ error: "Invalid username or password" });
        return;
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        res.status(400).send({ error: "Invalid username or password" });
        return;
    }

    setAuthCookie(res, user.token);
    // No content
    res.status(204).send();
})

const securedRouter = express.Router();

router.use(securedRouter);

securedRouter.use(async (req, res, next) => {
    const token = req.cookies?.auth;

    if (!token) {
        res.status(401).send({ error: "Unauthorized" });
        return;
    }

    const user = await getUserByToken(token);

    if (!user) {
        res.status(401).send({ error: "Unauthorized" });
        return;
    }

    next();
})

// Logout
securedRouter.post("/auth/logout", async (req, res) => {
    res.clearCookie(authTokenName);
    res.status(204).send();
})

securedRouter.post("/score", async (req, res) => {
    const score = req.body?.score;
    const token = req.cookies?.auth;

    if (!score && score !== 0) {
        res.status(400).send({ error: "Invalid score" });
        return;
    }

    const user = await getUserByToken(token);

    if (!user) {
        res.status(401).send({ error: "Unauthorized" });
        return;
    }

    await createScore(user.username, score);

    res.status(204).send();
});

securedRouter.get("/scores", async (req, res) => {
    const scores = await getHighScores();
    res.status(200).send(scores);
})

app.use((err, _, res, __) => {
    console.error(err.stack);
    res.status(500).send({ error: "Internal server error" });
});

app.use((_, res) => {
    res.sendFile("index.html", { root: "public" })
});




const httpService = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

peerProxy(httpService);