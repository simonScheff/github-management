var express       = require('express'),
    bodyParser    = require('body-parser'),
    request       = require('request');
    server        = express(),
    authorize_url = 'https://github.com/login/oauth/authorize',
    token_url     = 'https://github.com/login/oauth/access_token',
    api_url       = 'https://api.github.com/user/repos',
    redirect_uri  = 'http://localhost:3000/callback',
    encoded_redirect_uri  = encodeURIComponent(redirect_uri), // GET params can't contain / and :, so use encodeURIComponent to encode it (http%3A%2F%2Flocalhost%3A3000%2Fcallback).
    client_id     ='aad96884d3f18597b0ed', // This is so bad.  Don't do it.  Store it in an environment variable
    client_secret ='4ac6ba809fb31bb7ea21184b8b0c0e3767a97f1e', // This is so bad.  Don't do it.  Store it in an environment variable
    access_token  =null; // This is so bad.  Don't do it.  Store it in a database for each user

    server.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

      next();
    });
    // parse application/x-www-form-urlencoded
    server.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
server.use(bodyParser.json())
    server.use(express.static('./public'));

// This function takes an express response object and sends it the data retrieved from github
var getAndDisplayData = function(res){
  request({
      uri: api_url + '?access_token=' + access_token,
      method: 'GET',
      headers: {
        'User-Agent':'testapp'
      }
    },
    function(error, response, body){
      res.send(body);
    },
  );
}

var firstContact = function(res, auth_code) {
  request({
    uri: token_url,
    method: 'POST',
    form: {
      client_id: client_id,
      client_secret: client_secret,
      code: auth_code,
      redirect_uri: redirect_uri
    }
  },
  function(error, response, body){ //don't confuse 'response' with 'res'.  'response' is what comes back from the server-side request to gitub.  We don't need that, just 'body'
    //once, the call to retrieve the access_token returns...
    access_token = body.split('&')[0].split('=')[1]; //in the real world, save this to the database and relate it to only one user.
    //the way I did it here, it is one token for all users.  Not good.  Just a demo.

    //send in 'res' so that it can send back a response to the user.
    //remember, 'res' is the response object for the /callback route
    console.log(body);
    getAndDisplayData(res);
  }
);
}

// Receives data from manage accounts page
server.post('/accounts', function(request, response){
  //make sure they checked the box next to github in the account management page
  //this is just part of the app, not official oauth.  It's meant to simulate an actual account management page
 
 console.log(request.body);
 console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
 //console.log(request);
  var auth_code = request.body.access_token;
  firstContact(response, auth_code)
  //Make request to retrieve access_token


// console.log('github', request);
//  getAndDisplayData(response, request.body.access_token);
  return;
  if(request.body.github){
    //if access_token is null, begin oauth flow
    //in reality, you would look in your database to find the access_token for the current user and use that
    //for brevity, I just saved one token for everyone as a global variable.  This is bad practice.
    if(access_token === null){
      console.log("Beginning Access Token Flow");
      response.redirect(authorize_url + '?scope=user%3Aemail&client_id=' + client_id + '&redirect_uri=' + encoded_redirect_uri);
    } else {
      //else just get the data
      console.log("I already have the token, just get the data");
      getAndDisplayData(response);
    }
  } else {
    //if they didn't check the box next to github in the account management page, redirect them to /
    //this is just part of the app, not official oauth.  It's meant to simulate an actual account management page
    response.redirect('/');
  } 
});

//The is the handler for route that gets hit once, the provider redirects the user back to the redirect_uri
server.get('/callback', function(req, res){
  var auth_code = req.query.code;
  //Make request to retrieve access_token
  request({
      uri: token_url,
      method: 'POST',
      form: {
        client_id: client_id,
        client_secret: client_secret,
        code: auth_code,
        redirect_uri: redirect_uri
      }
    },
    function(error, response, body){ //don't confuse 'response' with 'res'.  'response' is what comes back from the server-side request to gitub.  We don't need that, just 'body'
      //once, the call to retrieve the access_token returns...
      access_token = body.split('&')[0].split('=')[1]; //in the real world, save this to the database and relate it to only one user.
      //the way I did it here, it is one token for all users.  Not good.  Just a demo.

      //send in 'res' so that it can send back a response to the user.
      //remember, 'res' is the response object for the /callback route
      getAndDisplayData(res);
    }
  );
});


server.listen(3000, function(){
  console.log("Server is listening");
});
