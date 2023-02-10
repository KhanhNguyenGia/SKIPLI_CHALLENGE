const { Octokit } = require('@octokit/core');
const { PHONE_REGEX } = require('../constants/constant');
const { getFirestore } = require('firebase-admin/firestore');

const MAX_SEARCH_RESULT = 1000;

const db = getFirestore();
const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });

async function searchGithubUsers(req, res) {
	const { q, page = 1, per_page = 40 } = req.query;
	if (!q) return res.status(400).send({ message: 'Require search term' });
	if (isNaN(page) || isNaN(per_page))
		return res.status(400).send({ message: 'Invalid page or per_page' });
	// Github allows maximum 1000 search result
	// If per_page is not divisible by 1000, the last page will have per_page number of items, including some from the second to last page
	if (page * per_page >= MAX_SEARCH_RESULT + +per_page)
		return res.status(400).send({ message: 'Exceed the number of available search result' });
	try {
		const result = await octokit.request('GET /search/users', {
			q,
			page,
			per_page,
		});
		const { items } = result.data;
		const users = await Promise.all(
			items.map(({ id }) =>
				octokit.request('GET /user/{id}', {
					id: id,
				})
			)
		);
		const filteredUsers = users.map(
			({ data: { login, id, avatar_url, html_url, public_repos, followers } }) => ({
				login,
				id,
				avatar_url,
				html_url,
				public_repos,
				followers,
			})
		);
		const pages = Math.ceil(MAX_SEARCH_RESULT / per_page);
		return res.status(200).send({ users: filteredUsers, pages });
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: 'Internal server error' });
	}
}

async function findGithubUserProfile(req, res) {
	const { github_user_id } = req.params;
	if (!github_user_id) return res.status(400).send({ message: 'Require github user id' });
	try {
		const result = await octokit.request('GET /user/{id}', {
			id: github_user_id,
		});
		const { data } = result;
		const { login, id, avatar_url, html_url, public_repos, followers } = data;
		return res.status(200).send({ login, id, avatar_url, html_url, public_repos, followers });
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: 'Internal server error' });
	}
}

async function likeGithubUser(req, res) {
	const { phone_number, github_user_id } = req.body;
	if (!phone_number || !github_user_id)
		return res.status(400).send({ message: 'Require phone number and github user id' });
	if (!PHONE_REGEX.test(phone_number))
		return res.status(400).send({ message: 'Invalid phone number' });
	try {
		const docRef = await db.collection('users').doc(phone_number).get();
		if (!docRef.exists) return res.status(400).send({ message: 'User not found' });
		const { favorite_github_users = [] } = docRef.data();
		let message = 'Like success';
		let newList = [];
		if (favorite_github_users.includes(github_user_id)) {
			newList = favorite_github_users.filter((id) => id !== github_user_id);
			message = 'Unlike success';
		} else newList = [...favorite_github_users, github_user_id];
		await db.collection('users').doc(phone_number).update({ favorite_github_users: newList });
		return res.status(200).send({ message });
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: 'Internal server error' });
	}
}

async function getUserProfile(req, res) {
	const { phone_number } = req.params;
	if (!phone_number) return res.status(400).send({ message: 'Require phone number' });
	if (!PHONE_REGEX.test(phone_number))
		return res.status(400).send({ message: 'Invalid phone number' });
	try {
		const docRef = await db.collection('users').doc(phone_number).get();
		if (!docRef.exists) return res.status(400).send({ message: 'User not found' });
		const { favorite_github_users = [] } = docRef.data();
		return res.status(200).send({ favorite_github_users });
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: 'Internal server error' });
	}
}

module.exports = {
	searchGithubUsers,
	findGithubUserProfile,
	likeGithubUser,
	getUserProfile,
};
