
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 3000;



app.use(express.json());
// Auth tokens
app.use(cookieParser());

// Static 
app.use(express.static('public'));

// Trust headers that are forwarded from the proxy so we can determine IP addresses
app.set('trust proxy', true);



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});