const socket = io();

const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const messageButton = document.getElementById('messageButton');
const notificationContainer = document.getElementById('notificationContainer');

const params = Qs.parse(window.location.search, {
	ignoreQueryPrefix: true, // remove "?" from query string before parsing it with `Qs`
});

socket.emit('joinChat', params.userName);

socket.on('notification', (notif) => {
	notificationContainer.innerHTML = notif;
});

messageButton.addEventListener('click', (e) => {
	const message = messageInput.value;

	if (message) {
		socket.emit('newMessage', message);
	}
});

socket.on('message', (messageString) => {
	const message = JSON.parse(messageString);

	messagesContainer.innerHTML += `<div>${message.user}: ${message.message}</div>`;
});

socket.on('messages', (messagesString) => {
	const messages = JSON.parse(messagesString);

	messagesContainer.innerHTML = '';

	messages.forEach((message) => {
		messagesContainer.innerHTML += `<div>${message.user}: ${message.message}</div>`;
	});
});
