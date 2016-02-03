exports.render = function(req,res){

	//For reading favs out of local JSON file
	var fileManager = require('./fileManager.js');
	
	//Read in the user list
	dataStore=fileManager.readFile();
	pairedUsers=dataStore.users;
		
	//Placeholder
	refreshToken='';
	favourites='';
	
	//Retrieve username from submission
	submittedUserName=req.body.userName;
	console.log("Submitted user for /favourites: "+ submittedUserName)

	//Find favourites for the submitted user -> this needs to use the refresh_token to get new access_token and retrieve recent favourites
	for (user in pairedUsers){
		
		if (submittedUserName == pairedUsers[user].userName){
			
			refreshToken = pairedUsers[user].refresh_token;
		}

	}

	//Make a call to exchange refresh_token for an access token
	//HTTP stuff
	var http = require('http');

	//OAuth2 client details
	var CLIENTID="TVPlayer";
	var CLIENTSECRET="Passw0rd";
	var RESPONSE_TYPE="token";
	var SCOPE="postaladdress%20givenname";
	//Base64 encoded OAuth2 client credentials
  	var CLIENTCREDS = CLIENTID + ":" + CLIENTSECRET;
	var B64CLIENTCREDS = new Buffer(CLIENTCREDS).toString('base64');
	
	//Create HTTP request to exchange refresh_token for access_token
	var options = {
			  host: 'openam.example.com',
			  path: '/openam/oauth2/access_token',
			  port: '8080',
			  method: 'POST',
			  headers: {'Authorization' : 'Basic ' + B64CLIENTCREDS, 'Content-Type' : 'application/x-www-form-urlencoded'}
	};
	
	//Call back function to handle response from OpenAM
	accessTokenCallback = function(response) {
		  
		  var str = '';
		  response.on('data', function (chunk) { //What to do with the data that is returned
		    
			  str += chunk;
			  console.log(str); //Print out the response to the console
			  bearerToken=JSON.parse(str); //new bearer token payload
			  
			  //Check contents of the response to see if access_token is present.  If access_token present..use it and store in local JSON
			  if(bearerToken.access_token != undefined){
		    	  
				//Create new HTTP request to exchange access_token for scope data...need to over options object   
				options.path='/openam/oauth2/tokeninfo';
				options.headers={'Authorization' : 'Bearer ' + bearerToken.access_token};
				options.method="GET"
				
				//Another callback to handle the userinfo response
				userInfoCallback = function(response){
					
					var str = '';
					response.on('data', function (chunk) {
						
						str += chunk;
						var userInfoResponseObj=JSON.parse(str);
						console.log(userInfoResponseObj)
						
						//Send result back to the UI to be rendered for notification
						//res.json({paired: paired})
						res.status(200).json({favourites:userInfoResponseObj.postaladdress})
						
					});
				}
											
				//Send request for the user info with the newly acquired access_token
				var userInfoRequest = http.request(options, userInfoCallback);
				userInfoRequest.end();
				
			  }
			  
			  else { //access_token not found as request has not been authorized
		    					  
				    //Update the paired to true for the user notification
					console.log("access_token not re-issued")
					res.status(200).json({favourites:''})
				  
		    } //close else
		    
		  }); //close response.on
		  
	} //close accessTokenCallback
	
	
	//HTTP Post payload data
	payload='grant_type=refresh_token&refresh_token='+refreshToken+'&scope='+SCOPE;
	
	var refreshTokenRequest = http.request(options, accessTokenCallback);
	refreshTokenRequest.write(payload);
	refreshTokenRequest.end();
	
	
}


