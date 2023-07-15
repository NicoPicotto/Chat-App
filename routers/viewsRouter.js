const { Router } = require('express');

const viewsRouterFn = (io) => {
	const viewsRouter = new Router();

	const userNames = [];

	viewsRouter.get('/login', (req, res) => {
		return res.render('login');
	});

	viewsRouter.post('/login', (req, res) => {
		const user = req.body;

		const userName = user.name;
		userNames.push(userName);

		io.emit('newUser', userName);

		return res.redirect(`/chat?userName=${userName}`);
	});

	viewsRouter.get('/chat', (req, res) => {
		return res.render('index');
	});

	return viewsRouter;
};

module.exports = viewsRouterFn;
