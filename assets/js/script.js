var socket = io();
var search_username = document.getElementById('search_username');
var search_button = document.getElementById('search_button');
var search_results = document.getElementById('search_results');

search_username.addEventListener("keyup", function(e) {
	e.preventDefault();
	if (e.keyCode === 13) {
		search_button.click();
		search_button.focus();
	}
});

// Handle the user inputted search
function doSearch() {
	var username = search_username.value;
	socket.emit('get_search_results', {username: username});
}

socket.on('update_search_results', function(data) {
	var users = data.users;
	var result = "";
	for (var user in users) {
		result += users[user] + "<br>";
	}
	search_results.innerHTML = result;
});
