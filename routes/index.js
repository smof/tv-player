exports.render = function(req,res){

	//For saving stuff back to local JSON file
	var fileManager = require('./fileManager.js');
	
	//Read in the user list
	dataStore=fileManager.readFile();
	
	//Array of previously paired users
	pairedUsers=dataStore.users;
	//Iterate over each pairedUser object and pull out the userName
	pairedUserNames=[];
		
	for (user in pairedUsers){
		
		pairedUserNames.push(pairedUsers[user].userName)
		
	}
	
	console.log("Paired Users: " + pairedUserNames)
	
	//Send back to the UI
	res.render('index', {pairedUserNames: pairedUserNames});
	
}


