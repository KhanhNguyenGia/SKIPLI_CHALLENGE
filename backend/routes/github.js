const { Router } = require('express');
const {
	searchGithubUsers,
	findGithubUserProfile,
	likeGithubUser,
	getUserProfile,
} = require('../controller/github');

const githubRouter = Router();

githubRouter.get('/search', searchGithubUsers);
githubRouter.get('/getUser/:github_user_id', findGithubUserProfile);
githubRouter.post('/like', likeGithubUser);
githubRouter.get('/getProfile/:phone_number', getUserProfile);

module.exports = githubRouter;
