var api = {}; 
global.api = api; 
api.net = require('net'); 
api.os = require('os'); 

var task = [2, 17, 3, 2, 5, 7, 15, 22, 1, 14, 15, 9, 0, 11]; 
var cpuNumber = api.os.cpus().length; 
var parts = []; 
var clients = []; 
var result = []; 
var part = task.length / cpuNumber; 
var server = api.net.createServer(function(socket) { 

	socket.id = clients.length; 
	var count = clients.length; 
	
	var startIndex = 0; 
	clients.push(socket); 
	if (clients.length == cpuNumber) { 
		for (var i = 0; i < clients.length; i++) { 
			clients[i].write(JSON.stringify(task.slice(startIndex, startIndex + part)));  
			startIndex = part * (i+1); 
		} 
	} 

	socket.on('data', function(data) { 
		console.log('Result recieved by server:' + data); 
		var res = {}; 
		res.data = JSON.parse(data); 
		res.id = socket.id; 
		parts[count] = res; 
		result = [];
		parts.sort(function(a, b) { 
			if (a.id < b.id) {
				return -1; 
			} else { 
				return 1;
			} 
		}).forEach(function(res) { 
			result = result.concat(res.data); 
		}); 
		console.log("General result is: " + result); 
	}); 
}).listen(2000);