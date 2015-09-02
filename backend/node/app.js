
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , uid = require('uid2');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser('NOTHING'));
//app.use(express.session());
// This middleware adds _csrf to 
// our session
// req.session._csrf
//app.use(express.csrf());
app.use(express.methodOverride());
app.use(app.router);
app.use(function(req, res, next){
//	res.setHeader('X-CSRF-Token', req.session._csrf);
	next();
});
app.use(express.static(path.join(__dirname, 'public')));
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


/* ------------------------------------------------
	Application Routes
   ------------------------------------------------*/ 

//app.get("/", function(req, res){
//	//send and csrf token with frist request
//	//and assign it to a global csrf variable
//	//inside the template
//	res.render('index', {
//		csrf : req.session._csrf
//	});
//});

app.get("/csrf", function(req, res){
  res.json({ csrf: req.session._csrf });
});

app.get("/tree", function(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  res.json(Tree);
});

app.get("/message", function(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  res.json(Message);
});

app.options("/territory*", function(req, res){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.send(200);
});

app.options("/territories*", function(req, res){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.send(200);
});

app.get("/territories", function(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.json(Territories);
});

app.post("/territory", function(req, res){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  var status = ['', '', '', '', '', 'active', 'success', 'warning', 'danger', 'info'];
  var bool = [true, false];
  res.send(200, {
    id: Math.ceil((Math.random() * (1000 - 1) + 1)),
    "options": {
      "class": status[Math.floor(Math.random() * status.length)],
      "deletable": bool[Math.floor(Math.random() * bool.length)],
      "editables": [1]
    }
  });
});

app.put("/territory*", function(req, res){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  // console.log(res);
  // res.send(404, {name:'ari laakso'});
  res.send(200, {});
});

app.delete("/territory*", function(req, res){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.send(200, {});
});

app.get("/session", function(req, res){ 
	//Check for authentication
	if(req.session.user){
		res.send(200, {
			auth : true,
			user : req.session.user
		});
	}else{
		res.send(401, {
			auth : false,
			csrf : req.session._csrf
		});
	}
});

app.post("/session/login", function(req, res){ 
	var email = req.body.email;
	var password = req.body.password;
	for (var i = 0; i < Users.length; i++) {
		var user = Users[i];
		if(user.email == email && user.password == password){
			req.session.user = user;
			return res.send(200, {
				auth : true,
				user : user
			});
		}
	};
	return res.send(401);
});


app.del("/session/logout", function(req, res){ 
	//Sending new csrf to client when user logged out
	//for next user to sign in without refreshing the page
	req.session.user = null;
	req.session._csrf = uid(24);

	res.send(200, {
		csrf : req.session._csrf
	});
});

app.get('/users/:id', Auth, function(req, res){
	//Using the Auth filter for this route
	//to check for authentication before sending data
	var id = req.params.id;

	for (var i = 0; i < Users.length; i++) {
		if(id == Users[i].id){
			return res.send(Users[i]);
		}
	};
	return res.send(400);
});


/* ------------------------------------------------
	Route Filters
   ------------------------------------------------*/ 

//Authentication Filter
function Auth (req, res, next) {
	if(req.session.user){
		next();
	}else{
		res.send(401,{
			flash : 'Plase log in first'
		});
	}
}


/* ------------------------------------------------
	Dummy Database
   ------------------------------------------------*/ 

var Territories = [
  {"id": 1, "name": "Afghanistan", "url": "http://en.wikipedia.org/wiki/Afghanistan", "population": 25500101, "date": "2013-01-01", "percentage": 0.36, "options": {"class": "item-1", "deletable": true, "editables": [1,2]}},
  {"id": 2, "name": "Albania", "url": "http://en.wikipedia.org/wiki/Albania", "population": false, "date": "2011-10-01", "percentage": 0.04, "options": {"class": "item-2", "deletable": true, "editables": [1,3]}},
  {"id": 3, "name": "Algeria", "url": "http://en.wikipedia.org/wiki/Algeria", "population": 37100000, "date": "2012-01-01", "percentage": 0.53, "options": {"class": "item-3", "deletable": true, "editables": [1,3]}},
  {"id": 4, "name": "American Samoa (USA)", "url": "http://en.wikipedia.org/wiki/American_Samoa", "population": 55519, "date": "2010-04-01", "percentage": 0.00079, "options": {"class": "item-4", "deletable": true, "editables": [1]}},
  {"id": 5, "name": "Andorra", "url": "http://en.wikipedia.org/wiki/Andorra", "population": 78115, "date": "2011-07-01", "percentage": 0.0011, "options": {"class": "item-5", "deletable": true, "editables": [1]}},
  {"id": 6, "name": "Angola", "url": "http://en.wikipedia.org/wiki/Angola", "population": 20609294, "date": "2012-07-01", "percentage": 0.29, "options": {"class": "item-6", "deletable": true, "editables": [1,2]}},
  {"id": 7, "name": "Anguilla (UK)", "url": "http://en.wikipedia.org/wiki/Anguilla", "population": 13452, "date": "2011-05-11", "percentage": 0.00019, "options": {"class": "item-7", "deletable": true, "editables": [1,2]}},
  {"id": 8, "name": "Antigua and Barbuda", "url": "http://en.wikipedia.org/wiki/Antigua_and_Barbuda", "population": 86295, "date": "2011-05-27", "percentage": 0.0012, "options": {"class": "active item-8", "deletable": true, "editables": [1,3]}},
  {"id": 9, "name": "Argentina", "url": "http://en.wikipedia.org/wiki/Argentina", "population": 40117096, "date": "2010-10-27", "percentage": 0.57, "options": {"class": "active item-9", "deletable": true, "editables": [1]}},
  {"id": 10, "name": "Armenia", "url": "http://en.wikipedia.org/wiki/Armenia", "population": 3275700, "date": "2012-06-01", "percentage": 0.046, "options": {"class": "active item-10", "deletable": true, "editables": [1]}},
  {"id": 11, "name": "Equatorial Guinea", "url": "http://en.wikipedia.org/wiki/Equatorial_Guinea", "population": 740000, "date": "2012-07-01", "percentage": 0.01, "options": {"class": "item-11", "deletable": true, "editables": [1]}},
  {"id": 12, "name": "Eritrea", "url": "http://en.wikipedia.org/wiki/Eritrea", "population": 5581000, "date": "2012-07-01", "percentage": 0.079, "options": {"class": "success item-12", "deletable": true, "editables": [1]}},
  {"id": 13, "name": "Honduras", "url": "http://en.wikipedia.org/wiki/Honduras", "population": 8385072, "date": "2012-07-01", "percentage": 0.12, "options": {"class": "warning item-13", "deletable": true, "editables": [1]}},
  {"id": 14, "name": "Hungary", "url": "http://en.wikipedia.org/wiki/Hungary", "population": 9957731, "date": "2012-01-01", "percentage": 0.14, "options": {"class": "warning item-14", "deletable": true, "editables": [1]}},
  {"id": 15, "name": "Iceland", "url": "http://en.wikipedia.org/wiki/Iceland", "population": 320060, "date": "2012-04-01", "percentage": 0.0045, "options": {"class": "danger item-15", "deletable": true, "editables": [1]}},
  {"id": 16, "name": "India", "url": "http://en.wikipedia.org/wiki/India", "population": 1210193422, "date": "2011-03-01", "percentage": 17.16, "options": {"class": "info item-16", "deletable": true, "editables": [1]}},
  {"id": 17, "name": "Serbia", "url": "http://en.wikipedia.org/wiki/Serbia", "population": 7120666, "date": "2011-10-01", "percentage": 0.1, "options": {"class": "item-17", "deletable": true, "editables": [1]}},
  {"id": 18, "name": "Seychelles", "url": "http://en.wikipedia.org/wiki/Seychelles", "population": 90945, "date": "2010-08-26", "percentage": 0.0013, "options": {"class": "item-18", "deletable": true, "editables": [1]}}
];

var Users = [
	{
		firstName : 'Danial',
		lastName : 'Khosravi',
		password : 'pass',
		email : 'backbone@authentication.com',
		id : 1
	},
	{
		firstName : 'John',
		lastName : 'Doe',
		password : 'jd',
		email : 'john@doe.com',
		id : 2
	},
	{
		firstName : 'm',
		lastName : 'm',
		password : 'm',
		email : 'm',
		id : 2
	}
];

var Message =
  {
    message: {
      type: 'warning',
      title: 'Success',
      description: 'Your data was saved'
    }
  }
;

var Tree = [
  {
    id: '1',
    parent: '#',
    text: 'Item 1',
  },
  {
    id: '2',
    parent: '#',
    text: 'Item 2',
    state: {
      opened: true,
      disabled: false,
      selected: false,      
    },
    li_attr: {
      class: 'testclass',
      'data-level': 1
    },
    a_attr: {
      href: 'http://www.google.com'
    }
  },
  {
    id: '3',
    parent: '#',
    text: 'Item 3'
  },
  {
    id: '4',
    parent: '2',
    text: 'Item 4'
  },
  {
    id: '5',
    parent: '2',
    text: 'Item 5'
  },
  {
    id: '6',
    parent: '2',
    text: 'Item 6'
  },
];

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
