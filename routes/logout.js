//Kills existing user access tokens and reloads index page
exports.render = function(req,res){

	//User to logout
	userToLogout=req.body.userName;
	console.log("/logout called with " + userToLogout);
	
	//For reading and saving stuff back to local JSON file
	var fileManager = require('./fileManager.js');
	
	//Read in the user list
	dataStore=fileManager.readFile();
	
	//Array of previously paired users
	pairedUsers=dataStore.users;
		
	//Iterate over the user store
	for (user in pairedUsers){
		
		//If the submitted user is found
		if (userToLogout == pairedUsers[user].userName) {
			
			//Some array shizzle to find the index of the user to remove, then splice out..
			index=pairedUsers.indexOf(user);
			pairedUsers.splice(index, 1);
			//Save back the user store
			dataStore.users=pairedUsers;
			console.log("Datastore after logout: " + dataStore);
			fileManager.writeFile(dataStore);
			res.status(200).json({"Logout":"Completed"})
			
		} else {
			
			console.log("User not found in datastore..");
			res.status(200).json({"Logout":"User not found"})
			
		}
	}

}


