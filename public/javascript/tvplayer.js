//General client side JavaScript

//Request water shed content access
function requestWaterShedContentAccess(){
	
	alert("Request Sent");
	
}

//Interacts with /logout endpoint to remove user from the datastore
function logout(userName){
	
	//Create a basic HTTP request..
	var xhr = new XMLHttpRequest();
	
	//Send a post to the /pairNotification endpoint with the deviceCode that was collected on the initial page render
	xhr.open('POST', '/logout', true);
	xhr.setRequestHeader('Content-type', 'application/json');
	xhr.send(JSON.stringify({userName: userName}));
	
	//Wait until the request has completed then ping response back to the ui
	xhr.onreadystatechange = function () {
	    var DONE = this.DONE || 4;
	    if (this.readyState === DONE){
	    	
	    	window.location="/"; //redirect back to index
	    }
	}
}

//Interacts with getFavourites endpoint to find refresh_token, exchange for access_token and retrieve favourites
function getFavourites(userName){
	
	//Create a basic HTTP request..
	var xhr = new XMLHttpRequest();
	
	//Send a post to the /pairNotification endpoint with the deviceCode that was collected on the initial page render
	xhr.open('POST', '/favourites', true);
	xhr.setRequestHeader('Content-type', 'application/json');
	xhr.send(JSON.stringify({userName: userName}));

	//Wait until the request has completed then ping response back to the ui
	xhr.onreadystatechange = function () {
	    var DONE = this.DONE || 4;
	    if (this.readyState === DONE){
	    	
	    	//Checks if the pairing has taken place...
	    	if (JSON.parse(xhr.response).favourites != ''){
	    		
	    		//Update UI with favourites
	       		document.getElementById("favouritesLabel").style.display='block'
	    		document.getElementById("favouritesData").style.display='block'
	    		document.getElementById("favouritesData").innerHTML=JSON.parse(xhr.response).favourites;
	       		
	       		//Update UI with username data
	       		document.getElementById("userNameLabel").style.display='block';
	       		document.getElementById("userNameData").style.display='block';
	       		document.getElementById("userNameData").innerHTML=userName;
	       		
	       		//Update UI with waterShedContent response
	       		document.getElementById("waterShedContentLabel").style.display='block';
	       		document.getElementById("waterShedContentData").style.display='block';
	       		
	       		//Pull in boolean and update icon accordingly
	       		waterShedContentResponse=JSON.parse(xhr.response).waterShedContent;
	       		
	       		if(waterShedContentResponse == 'true'){
	       		
	       			document.getElementById("waterShedContentData").innerHTML="<img src='./images/true.png' height='40' width='40'/>"
	       			
	       		}else {
	       			
	       			document.getElementById("waterShedContentData").innerHTML="<img src='./images/false.png' height='40' width='40'/>"
	       			document.getElementById("waterShedContentRequest").innerHTML="<a href='#' onclick='requestWaterShedContentAccess()'>Request Access</a>"	
	       		}
	       		
	       		
	    	}
	    	
	    	//No favourites returned
	    	else {
	    		
	    		//Updated UI with favourites
	    		document.getElementById("favouritesLabel").style.display='block';
	    		document.getElementById("favouritesData").style.display='block';
	    		document.getElementById("favouritesData").innerHTML='No favourites found';
	    		
	    		document.getElementById("userNameLabel").style.display='block';
	       		document.getElementById("userNameData").style.display='block';
	       		document.getElementById("userNameData").innerHTML=userName;
	       		
	    	}
	    	
	    	document.getElementById("logout").innerHTML="<a href='#' onclick=\"logout('" + userName + "');\"><img src='./images/logout.png' height='40' width='40'/></a>"
	    	
	    	//Update the logout button link
	    	console.log("Username: " + userName);
	    	
	    	 	
	    }
	};
	
	
}


//Interacts with server side /pairNotification endpoint to see if the pairing has been authorized by the end user in OpenAM
function pollPairing(deviceCode){
	
	//Create a basic HTTP request..
	var xhr = new XMLHttpRequest();
	
	//Send a post to the /pairNotification endpoint with the deviceCode that was collected on the initial page render
	xhr.open('POST', '/pairNotification', true);
	xhr.setRequestHeader('Content-type', 'application/json');
	xhr.send(JSON.stringify({deviceCode: deviceCode}));
	
	//Wait until the request has completed then ping response back to the ui
	xhr.onreadystatechange = function () {
	    var DONE = this.DONE || 4;
	    if (this.readyState === DONE){
	    	
	    	//Checks if the pairing has taken place...
	    	if (JSON.parse(xhr.response).paired==true){
	    		
	    		//Alter the display in the UI so that the correct icon appears
	    		document.getElementById("paired").style.display='block'
	    		document.getElementById("pairing").style.display='none'
	    		
	    		//Clear down the interval that is checking if the pairing has taken place
	    		clearInterval(pollInterval)
	    		
	    	}
	    	
	    	//No pairing has taken place...so do nothing, carry on polling
	    	else {
	    		
	    	}
	    }
	};
	
}