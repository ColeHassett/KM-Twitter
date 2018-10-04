var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var Twitter = require('twitter');
var twitter_info = require('./assets/twitter_info.js');

var client = new Twitter({
	consumer_key: twitter_info.TWITTER_CONSUMER_KEY,
	consumer_secret: twitter_info.TWITTER_CONSUMER_SECRET,
	access_token_key: twitter_info.TWITTER_ACCESS_TOKEN_KEY,
	access_token_secret: twitter_info.TWITTER_ACCESS_TOKEN_SECRET
});

var path = __dirname;

app.use("/assets", express.static(path + "/assets"));

io.on('connection', function(socket) {

	socket.on('get_search_results', function(data) {
		var amount = data.amount.length > 0 ? parseInt(data.amount) : 50;
		getUsers(data.username, amount, 1);
	});

	socket.on('get_tweets', function(data) {
		var amount = data.amount.length > 0 ? parseInt(data.amount) : 50;
		getTweets(data.term, amount);
	});

	socket.on('get_user_tweets', function(data) {
		var amount = data.amount.length > 0 ? parseInt(data.amount) : 50;
		getUserTweets(data.username, amount);
	});

	function tweetHelper(res) {
		var status_text = [];
		var status_ids = [];
		var imgs = [];
		var usernames = [];
		for (var status in res) {
			status_text.push(res[status].text);
			status_ids.push(res[status].id_str)
			imgs.push(res[status].user.profile_image_url);
			usernames.push(res[status].user.screen_name);
		}
		socket.emit('update_tweet_search_results', {statuses: status_text, status_ids: status_ids, usernames: usernames, imgs: imgs});
	}

	function getUserTweets(user, amount) {
		client.get('statuses/user_timeline', {screen_name: user, count: amount}, function(err, res) {
			if (err) {
				console.dir(err);
			} else {
				tweetHelper(res);
			}
		});
	}

	function getTweets(term, amount) {
		client.get('search/tweets', {q: term, count: amount}, function(err, res) {
			if (err) {
				console.dir(err);
			} else {
				tweetHelper(res.statuses);
			}
		});
	}

	function getUsers(username, amount, page) {
		var users = [];
		var imgs = [];
		client.get('users/search', {q: username, page: page, count: 20}, function(err, res) {
			if (err) {
				console.dir(err);
			} else {
				var index = amount > 20 ? 20 : amount;
				if (page == 1 && res.length < 20 && amount >= 20) {
					index = res.length;
					amount = 0;
				}
				for (var i = 0; i < index; i++) {
					users.push(res[i].screen_name);
					imgs.push(res[i].profile_image_url);
				}
				amount-=20;
				page++;
				if (amount > 0) {
					getUsers(username, amount, page++);
				} else {
					socket.emit('update_search_results', {users: users, img: imgs});
					users = [];
					imgs = [];
				}
			}
		});
	}

});

app.get('/', function(req, res) {
	res.render(path + '/index.pug');
});

server.listen(8080, function() {
	console.log("Live at Port 8080");
});
