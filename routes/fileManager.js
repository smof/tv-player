//Used to manage the read/write process of saving tokens to local JSON for persistence

//Requires
var fs = require('fs');

//User database
var file = "/users.json"
var usersFile = __dirname + file; //file path

//Reads files
exports.readFile = function() {

	var contents;
	contents = fs.readFileSync(usersFile, "utf8");
	
	//send back JSON of file
	return JSON.parse(contents);	
	 	
};

exports.writeFile = function(contents){
	
	//write file back down
	fs.writeFileSync(usersFile, JSON.stringify(contents), "utf8");
	
}