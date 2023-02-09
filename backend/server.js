require('dotenv').config();
const express = require('express');
const cors = require('cors');
const phoneRouter = require('./routes/phone');
const githubRouter = require('./routes/github');

const PORT = 4000;
const app = express();

app.use(express.json());
app.use(cors());

app.use('/phone', phoneRouter);
app.use('/github', githubRouter);

app.listen(PORT, () => {
	console.log('Server is running on port 4000');
});
