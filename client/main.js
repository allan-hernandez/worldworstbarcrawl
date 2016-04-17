

Emails = new Meteor.Collection("emails")

EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Github account usernames of admin users
var ADMIN_USERS = ['allan-hernandez'];
function isAdmin(userId) {
  var user = Meteor.users.findOne({_id: userId});
  try {
    return ADMIN_USERS.indexOf(user.services.github.username) !== -1
  } catch(e) {
    return false;
 }
}
  
if (Meteor.isClient) {

  Meteor.subscribe('userData');
  Meteor.subscribe('emails');
  Template.footer.events({
    'click .login' : function(evt, tmpl){
      Meteor.loginWithGithub();
      return false;
    },

    'click .admin' : function(evt, tmpl){
      Session.set("showAdmin", !Session.get("showAdmin"));
    }
   })

  Template.signup.events({
    'submit form' : function (evt, tmpl) {
    	console.log('clicked');

      var email = tmpl.find('input').value
      , doc = {email: email, referrer: document.referrer, timestamp: new Date()}

      if (EMAIL_REGEX.test(email)){
        Session.set("showBadEmail", false);
        Meteor.call("insertEmail", doc);
        Session.set("emailSubmitted", true);
      } else {
        Session.set("showBadEmail", true);
      }
      return false;
    }
  });

  Template.signup.helpers({
  	showBadEmail: function () {
    	return Session.get("showBadEmail");
   	}
  });

  Template.signup.helpers({
  	emailSubmitted: function () {
  		return Session.get("emailSubmitted");
  	}
  });

  Template.footer.helpers({
  	isAdmin: function () {
  		return isAdmin();
  	}
  });



  Template.main.helpers({
  	showAdmin: function() {
    	return Session.get("showAdmin");
  	}
  });

  Template.admin.helpers({
  	emails: function() {
  		return Emails.find().fetch();
  	}
  });
}

if (Meteor.isServer) {
  
  Meteor.publish("userData", function () {
    return Meteor.users.find({_id: this.userId},
      {fields: {'services.github.username': 1, 'username':1}});
  });

  Meteor.publish("emails", function() {
    if (isAdmin(this.userId)) {
      return Emails.find();
    }
  });
  
  Meteor.methods({
      insertEmail: function(doc) {
          Emails.insert(doc);
      }
  });
}



$( document ).ready(function() {
	var w = document.getElementById('welcome');
	var i = document.getElementById('initial');
	var s = document.getElementById('second');

	$(w).hide();
	$(i).hide();
	$(s).hide();

   cycleText();
});

var nIntervId;
var curr = 0;

function cycleText() {
 	nIntervId = setInterval(next, 2000);
}

function next() {
	var w = document.getElementById('welcome');
	var i = document.getElementById('initial');
	var s = document.getElementById('second');
	if (curr === 2) {
		$(i).show();
	}
	else if (curr === 3) {
		$(s).show();
	}
	else if (curr ===4) {
		$(i).hide();
		$(s).hide();
		$(w).show();
		stopText;
	}
	curr++;
}
 
function stopText() {
  clearInterval(nIntervId);
}