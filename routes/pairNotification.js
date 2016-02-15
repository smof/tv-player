exports.render = function(req,res){

	var paired=false;
	
	//HTTP stuff
	var http = require('http');

	//For saving stuff back to local JSON file
	var fileManager = require('./fileManager.js');
	
	//OAuth2 client details
	var CLIENTID="TVPlayer";
	var CLIENTSECRET="Passw0rd";
	var RESPONSE_TYPE="token";
	var SCOPE="description%20givenname%20postaladdress";
	//Base64 encoded OAuth2 client credentials
  	var CLIENTCREDS = CLIENTID + ":" + CLIENTSECRET;
	var B64CLIENTCREDS = new Buffer(CLIENTCREDS).toString('base64');
	
	//Variable sent in the post request
	deviceCode=req.body.deviceCode;
	console.log("DeviceCode: " + deviceCode);
	
	
	//Create HTTP request to query OpenAM to see if authorization has taken place
	var options = {
			  host: 'openam.example.com',
			  path: '/openam/oauth2/access_token',
			  port: '8080',
			  method: 'POST',
		      headers:  {'Content-Type' : 'application/x-www-form-urlencoded'}
	};
	
	//Call back to handle the polling response back from OpenAM
	pollingCallback = function(response) {
		  
		  var str = '';
		  response.on('data', function (chunk) { //What to do with the data that is returned
		    
			  str += chunk;
			  console.log(str); //Print out the response to the console
			  bearerToken=JSON.parse(str);
			  
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
						
						//Update the paired to true for the user notification
						paired=true;
						console.log("Paired: " + paired)
						
						//Send result back to the UI to be rendered for notification
						//res.json({paired: paired})
						res.status(200).json({paired:paired})
						
						//Need to save access_token, refresh_token, givenname and postaladdress
						newUser={}
						newUser.refresh_token=bearerToken.refresh_token;
						newUser.userName=userInfoResponseObj.givenname;
						
						//Read in existing users to append to
						dataStore = fileManager.readFile();
						//console.log("DataStore: " + dataStore)

						//Save back to disk
						dataStore.users.push(newUser);
						fileManager.writeFile(dataStore);
						
					});
				}
											
				//Send request for the user info with the newly acquired access_token
				var userInfoRequest = http.request(options, userInfoCallback);
				userInfoRequest.end();
				
				
			  }
			  
			  else { //access_token not found as request has not been authorized
		    					  
				    //Update the paired to true for the user notification
					paired=false;
					console.log("Paired: " + paired)
					
					//Send result back to the UI to be rendered for notification
					res.json({paired: paired})
					
				  
		    } //close else
		    
		  }); //close response.on
		  
	} //close pollingCallback
		
    //HTTP Post payload data
	payload='client_id='+CLIENTID+'&client_secret='+CLIENTSECRET+'&grant_type=http://oauth.net/grant_type/device/1.0&code='+deviceCode
	
	var pollingRequest = http.request(options, pollingCallback);
	pollingRequest.write(payload);
	pollingRequest.end();
		
}



