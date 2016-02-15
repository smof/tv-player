//Initiates the device flow to link to new user
exports.render = function(req,res){

		
		var http = require('http');
		
		//OAuth2 client details
		var CLIENTID="TVPlayer";
		var CLIENTSECRET="Passw0rd";
		var RESPONSE_TYPE="token";
		var SCOPE="description%20givenname%20postaladdress";
		//Base64 encoded OAuth2 client credentials
	  	var CLIENTCREDS = CLIENTID + ":" + CLIENTSECRET;
		var B64CLIENTCREDS = new Buffer(CLIENTCREDS).toString('base64');
		
		//var for the pairing notification
		var paired=false;
		console.log("Paired: " + paired)
		
		//Setup for initial device flow details
		var options = {
				  host: 'openam.example.com',
				  //The path to start the device code flow
				  path: '/openam/oauth2/device/code?response_type='+RESPONSE_TYPE+'&scope='+SCOPE+'&client_id='+CLIENTID+'&nonce=1234',
				  port: '8080',
				  method: 'POST'
		};
			
		//Initial callback function for the device flow starting request 
		userCodeCallback = function(response) {
			  var str = '';
			  response.on('data', function (chunk) {
			    str += chunk;
			    responseObj=JSON.parse(str);
			    
			    //Split out object into specific attributes
			    deviceCode=responseObj.device_code;
			    verifyURL=responseObj.verification_url;
			    userCode=responseObj.user_code;
			    expiresIn=responseObj.expires_in;
			    interval=responseObj.interval;
			    
			    //Render pair page and pass in the stripped out response attrs from OpenAM
			    res.render('pair', {interval: interval, deviceCode: deviceCode, userCode: userCode, verifyURL: verifyURL, expiresIn: expiresIn});
			    
			  });

			  response.on('end', function () {
			    console.log(str);
			  });
			  		  
		}

		var req = http.request(options, userCodeCallback);
		var payload = "";
		req.write("");
		req.end();
	
}
