<b>TVPlayer</b>
</br>
</br>
A basic set top box emulator, that leverages the OAuth2, with the device flow use case, to deliver attribute data to the "device".
<br/>
</br>
The concept is to allow the the set top box, to be paired, out of band with a user managed via ForgeRock OpenAM.
<br/>
<br/>
<b>Installation</b>
<br/>
<br/>
This app is written in node.js, so node.js will need to be download and configured for your operating system. Once installed, clone 
the app locally.  Run "node install" from within this project directory to install dependencies
 from the package.json file.
<br/>
<br/>
<b>Usage</b>
<br/>
<br/>
Edit the necessary app.js global variables, for the specific OpenAM deployment you want to run against.
<br/>
To run enter <b>node app.js</b> and the app will start by default on port 3001.
<br/>
Selecting the "pair" icon will initiate the device flow - prompting the user to enter a user code out of band on another device (aka a laptop
or tablet).  Once paired and authorized, the set top box, will use the refresh_token / access_token paradigm to retrieve a list of favourite
TV channels stored in the postaladdress attribute in OpenAM.
<br/>
The app then saves the users givenname and refresh_token in a local JSON file for persistence.  Note, multiple users can be pairied with the
app, to simulate a household.  A logout button removes the locally stored refresh_token.
<br/>
Note - tested against OpenAM 13.0
