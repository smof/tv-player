exports.render = function(req,res){

	//Workflow name
	workflowId="accessRequest";
	//Retrieve username from submission
	submittedUserName=req.body.userName;
	console.log("Submitted user for /requestWaterShedAccess: "+ submittedUserName)

	
	//Make a call to exchange refresh_token for an access token
	//HTTP stuff
	var http = require('http');

	//Create HTTP request to initiate workflow request in IDM
	var options = {
			  host: 'identity.example.com',
			  path: '/openidm/workflow/processinstance?_action=create',
			  port: '8081',
			  method: 'POST',
			  headers: {'X-OpenIDM-Username' : 'openidm-admin', 'X-OpenIDM-Password': 'Passw0rd', 'Content-Type' : 'application/json'}
	};
	
	//Call back function to handle response from OpenAM
	accessRequestCallback = function(response) {
		  
		  var str = '';
		  response.on('data', function (chunk) { //What to do with the data that is returned
		    
			  str += chunk;
			  console.log(str); //Print out the response to the console
			  accessRequestResponse=JSON.parse(str);
			  
			  //Send something back to caller
			  res.status(200).json(accessRequestResponse);
			  
		  }); //close response.on
		  
	} //close accessRequestCallback
	
	//JSON object to be sent to IDM to instantiate the workflow.  Needs the workflow name the user to apply the request to
	payload = JSON.parse({"_key" : workflowId, "userName": submittedUserName});
	
	//HTTP Post payload data
	var accessRequest = http.request(options, accessRequestCallback);
	accessRequest.write(payload);
	accessRequest.end();
	
}
