const express = require('express');
const handlebars = require('express-handlebars');
const socketServer = require('./utils/io');

const viewsRouterFn = require('./routers/viewsRouter');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Configuración handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', './views');
app.set('view engine', 'handlebars');

app.use(express.static('public'));

const PORT = 8080;
const httpServer = app.listen(PORT, () =>
	console.log(`Servidor corriendo en el puerto ${PORT}`)
);

const io = socketServer(httpServer);

const users = [];
const messages = [];

io.on('connection', (socket) => {
	socket.on('joinChat', (userName) => {
		users.push({
			name: userName,
			id: socket.id,
		});

		socket.broadcast.emit('notification', `${userName} se ha unido al chat`);

		socket.emit('notification', `Bienvenid@ ${userName}`);
		socket.emit('messages', JSON.stringify(messages));
	});

	socket.on('newMessage', (message) => {
		const user = users.find((user) => user.id === socket.id);

		const newMessage = {
			message,
			user: user.name,
		};

		messages.push(newMessage);

		io.emit('message', JSON.stringify(newMessage));
	});
});

app.get('/healthcheck', (req, res) => {
	return res.json({
		status: 'Running',
		date: new Date(),
	});
});

const viewsRouter = viewsRouterFn(io);

app.use('/', viewsRouter);
