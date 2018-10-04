var socket = io();
var search_term = document.getElementById('search_term');
var search_username = document.getElementById('search_username');
var search_amount = document.getElementById('search_amount');
var search_results = document.getElementById('search_results');

function doSearch(type) {
	var term = search_term.value;
	var username = search_username.value;
	var amount = search_amount.value;

	if (type == "User") {
		if (/^\w+$/.test(username)) {
			socket.emit('get_search_results', {username: username, amount: amount});
		} else {
			alert("Invalid Username");
		}
	} else if (type == "Tweet") {
		socket.emit('get_tweets', {term: term, amount: amount});
	} else if (type == "UserTweet") {
		if (/^\w+$/.test(username)) {
			socket.emit('get_user_tweets', {username: username, amount: amount});
		} else {
			alert("Invalid Username");
		}
	}
	while (search_results.firstChild) {
		search_results.removeChild(search_results.firstChild);
	}
}

function createImageURL(img) {

	var temp_file_type_arr = img.split(".");
	var temp_file_type = temp_file_type_arr[temp_file_type_arr.length-1];
	var img_URL = "";

	if (temp_file_type.length > 5) {
		temp_file_type = ""
	} else {
		temp_file_type = "." + temp_file_type
	}
	img_URL = img.substring(0, img.length-(temp_file_type.length+7)) + temp_file_type;
	return img_URL;
}

socket.on('update_tweet_search_results', function(data) {
	var statuses = data.statuses;
	var ids = data.status_ids;
	var users = data.usernames;
	var imgs = data.imgs;

	for (var i in statuses) {
		var temp_div = document.createElement("div");
		temp_div.draggable = true;
		temp_div.className = "card";
		temp_div.style = "background-color: #00aced";

		var temp_img = document.createElement("img");
		temp_img.className = "btn";
		temp_img.src = imgs[i];
		temp_img.alt = "Image Unavailable";
		temp_img.style = "text-align: left";

		var temp_div_head = document.createElement("div");
		temp_div_head.className = "card-header";
		temp_div_head.onclick = (function(username) {
			return function() {
				window.open("http://www.twitter.com/"+username,"_blank");
			}
		})(users[i]);

		var temp_div_body = document.createElement("div");
		var temp_text_node = document.createTextNode(statuses[i]);
		temp_div_body.style = "font-size: 1vw; text-align: center";
		temp_div_body.className = "card-body";
		temp_div_body.onclick = (function(username, id) {
			return function() {
				window.open("http://www.twitter.com/"+username+"/status/"+id,"_blank");
			}
		})(users[i], ids[i]);

		var temp_div_foot = document.createElement("div");
		temp_div_foot.className = "card-footer";
		var temp_link = document.createElement("a");
		temp_link.className = "btn btn-danger";
		temp_link.innerHTML = "Delete"
		temp_link.onclick = (function(div) {
			return function() {
				search_results.removeChild(div);
			}
		})(temp_div);

		temp_div_body.append(temp_text_node);
		temp_div_body.append(document.createElement("br"));
		temp_div_body.append(temp_link);
		temp_div_head.appendChild(temp_img);
		temp_div_foot.appendChild(temp_link);
		temp_div.appendChild(temp_div_head);
		temp_div.appendChild(temp_div_body);
		temp_div.appendChild(temp_div_foot);
		search_results.appendChild(temp_div);
	}
});

socket.on('update_search_results', function(data) {
	var users = data.users;
	if (users.length === 0) {
		alert("No Results");
		return;
	}
	var result = "";
	for (var user in users) {
		var temp_div = document.createElement("div");
		temp_div.draggable = true;
		temp_div.className = "card";
		temp_div.style = "background-color: #00aced";

		var temp_img = document.createElement("img");
		temp_img.className = "card-img-top btn";
		temp_img.src = createImageURL(data.img[user]);
		temp_img.alt = "Image Unavailable";
		temp_img.onclick = (function(i) {
			return function() {
				window.open("http://www.twitter.com/"+i,"_blank");
			}
		})(users[user]);

		var temp_div_body = document.createElement("div");
		var temp_text_node = document.createTextNode(users[user])
		var temp_link = document.createElement("a");
		temp_link.className = "btn btn-danger";
		temp_link.innerHTML = "Delete"
		temp_link.onclick = (function(i) {
			return function() {
				search_results.removeChild(i);
			}
		})(temp_div);
		temp_div_body.style = "font-size: 1vw; text-align: center";
		temp_div_body.className = "card-body";

		temp_div_body.append(temp_text_node);
		temp_div_body.append(document.createElement("br"));
		temp_div_body.append(temp_link);
		temp_div.appendChild(temp_img);
		temp_div.appendChild(temp_div_body);
		search_results.appendChild(temp_div);
	}
});
