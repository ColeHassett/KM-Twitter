var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var Twitter = require('twitter');
var twitter_info = require('./assets/twitter_info.js');

// var client = new Twitter({
// 	consumer_key: 'process.env.TWITTER_CONSUMER_KEY',
// 	consumer_secret: 'process.env.TWITTER_CONSUMER_SECRET',
// 	access_token_key: 'process.env.TWITTER_ACCESS_TOKEN_KEY',
// 	access_token_secret: 'process.env.TWITTER_ACCESS_TOKEN_SECRET'
// });

var client = new Twitter({
	consumer_key: twitter_info.TWITTER_CONSUMER_KEY,
	consumer_secret: twitter_info.TWITTER_CONSUMER_SECRET,
	access_token_key: twitter_info.TWITTER_ACCESS_TOKEN_KEY,
	access_token_secret: twitter_info.TWITTER_ACCESS_TOKEN_SECRET
});

// var client = new Twitter({
// 	consumer_key: '3DSwCqCWYO6c1aGHMzOPQ1XFK',
// 	consumer_secret: 'R9jU8VmhWmXeJrksJuAu4HUIsGFFHftZgFNRBRM31Lmof9XnRF',
// 	access_token_key: '2270894426-ZxxcbbNG5UARESWqOVx32zpdQNWFRadQvHdMJPc',
// 	access_token_secret: '7NO0fB2HaD2vrPlajJLpg7cBFIyB9JOJUaJjLR4q4DXDk'
// });

var users = [];
var path = __dirname;

app.use("/assets", express.static(path + "/assets"));

io.on('connection', function(socket) {

	socket.on('get_search_results', function(data) {
		var username = data.username;
		client.get('users/search', {q: username}, function(err, res) {
			if (err) {
				console.dir(err);
			} else {
				var temp_users = [];
				for (var i in res) {
					temp_users.push(res[i].screen_name);
				}
				users = temp_users;
				socket.emit('update_search_results', {users: users});
			}
		});
	});
});

app.get('/', function(req, res) {
	res.render(path + '/index.pug');
});

server.listen(8080, function() {
	console.log("Live at Port 8080");
});
