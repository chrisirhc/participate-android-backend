system.use("com.joyent.Sammy");
system.use("com.joyent.Resource");
system.use("com.google.code.date");

// our objects

// List of classes
var Class = new Resource("class",
{
    /*
     * TODO For future use, this should also have a start and expiry date
     */
    '@constructor': function (aClassTitle, aStartTime, aEndTime) {
        this.startTime = aStartTime;
        this.endTime = aEndTime;
        this.classTitle = aClassTitle;
    }
}
);
Class.transient = false;
// Show new form
GET("/class/new", function () {
    return template("classform.html");
});
// Delete. I didn't use a DELETE handler because we're making it super simple
GET(/\/class\/delete\/(.+)$/, function ( classId ) {
try {
   this.aclass = Class.get( classId );
   this.aclass.remove();
} catch(e) {
}
redirect("/class");
});

// Show edit form
GET(/\/class\/(.+)$/, function ( classId ) {
    try {
        this.aclass = Class.get( classId );
    } catch(e) {
        this.aclass = { classTitle: null, startTime: null, endTime: null};
    }
    return template("classform.html");
});
// Save changes or create a new class
POST(/\/class\/?/, function () {
    if (this.request.body.classId) {
        try {
            var aclass = Class.get(this.request.body.classId);
            aclass.classTitle = this.request.body.classTitle;
            aclass.startTime = this.request.body.startTime;
            aclass.endTime = this.request.body.endTime;
            aclass.save();
        } catch(e) {
            return;
        }
    } else {
        var aclass = new Class(
                this.request.body.classTitle,
                this.request.body.startTime,
                this.request.body.endTime);
        aclass.save();
    }
    redirect("/class");
});
GET(/\/class\/?/, function () {
    var classes = Class.search({});
    if (classes.length) {
        this.classes = classes;
        return template("classlist.html");
    } else {
        redirect("/class/new");
    }
});

/** Contain the user ID and the name to display as well as photograph to display */
var Profile = new Resource("profile",
{
    '@constructor': function (userId, name, photograph) {
        this.userId = userId;
        this.name = name;
        this.photograph = photograph;
    }
});
Profile.transient = false;

// Show new form
GET("/profile/new", function () {
    return template("profileform.html");
});
// Delete. I didn't use a DELETE handler because we're making it super simple
GET(/\/profile\/delete\/(.+)$/, function ( profileId ) {
    try {
        this.aprofile = Profile.get( profileId );
        this.aprofile.remove();
    } catch(e) {
    }
    redirect("/profile");
});

// Show edit form
GET(/\/profile\/(.+)$/, function ( profileId ) {
    try {
        this.aprofile = profile.get( profileId );
    } catch(e) {
        this.aprofile = { userId: null, name: null, photograph: null};
    }
    return template("profileform.html");
});
// Save changes or create a new class
POST(/\/profile\/?/, function () {
    if (this.request.body.profileId) {
        try {
             var aprofile = Profile.get(this.request.body.profileId);
             aprofile.userId = this.request.body.userId;
             aprofile.name= this.request.body.name;
             aprofile.photograph = this.request.body.photograph;
             aprofile.save();
         } catch(e) {
             return;
         }
     } else {
         var aprofile = new Profile(
                 this.request.body.userId,
                 this.request.body.name,
                 this.request.body.photograph);
         aprofile.save();
     }
     redirect("/profile");
});
GET(/\/profile\/?/, function () {
    var profiles = Profile.search({});
    if (profiles.length) {
         this.profiles = profiles;
         return template("profilelist.html");
     } else {
         redirect("/profile/new");
     }
});


// Psession
var Psession = new Resource("psession",
{
    /*
     * TODO May not have the endTime during the creation of this object
     */
    '@constructor': function(participantId, startTime, endTime) {

    }
}
);
Psession.transient = false;

GET(/\/psession\/?/, function () {
    var psession = Psession.search({});
    if (psession.length) {
        this.psession = psession;
        return template("psessionlist.html");
    } else {
        return "nothing here";
    }
});
// Start psession
GET(/\/psession\/start\/(.+)$/, function ( profileId ) {
    try {
        this.aprofile = profile.get( profileId );
    } catch(e) {
        this.aprofile = { userId: null, name: null, photograph: null};
    }
    Psession.search({participantId: this.aprofile.userId}, {limit: 1, sort: created});

    // Send out XML RPC method to the Push API to push to the Android App
});
// Stop psession
GET(/\/psession\/stop\/(.+)$/, function ( profileId ) {
    try {
        this.aprofile = profile.get( profileId );
    } catch(e) {
        this.aprofile = { userId: null, name: null, photograph: null};
    }
    return template("profileform.html");
});

/*
 * Ratings
 */
var Rating = new Resource("rating",
{
    '@constructor': function(raterId, psessionId, ratingPoints, timestamp) {
    }
}
);
Rating.transient = false;

// Timeslot
var StudentClass = new Resource("studentclass",
{
    '@constructor': function(userID, classId) {

    }
}
);
StudentClass.transient = false;

// var Class ratings?

// var Class = new Resource("Class");
GET("/date", function() {
    var b = Date.parse("Monday 3:00pm"),
    a = Date.parse("Monday 4:00pm");
    return Date.now().between(b, a) + "";
});

// Testing the XML-RPC into the Ericsson Push API
GET("/push", function() {
    // testing the XML-RPC
    return JSON.stringify(system.http.request("POST", "http://mp.labs.ericsson.net/mp/rpc", [],
    <methodCall>
      <methodName>getApplicationList</methodName>
      <params>
        <param>
            <value><string>3f73a881746726650649bba254ea00e0</string></value>
        </param>
      </params>
    </methodCall>).headers);
    // .content
});

// Profile functions
// I think we might need to prepoulate this

/*
 * function main(aRequest) { return "hi participate!"; }
 */

// Ambient Display Retrieve
GET(/\/user\/(.+)$/, function(userId) {
    this.response.mime = 'application/json';
    var json = {};
    try {
        // this.profile = Profile.get( userId );
        /*
         * find all the ratings under this user
         */
        var ratings = Rating.search({ratee: userId}, {limit: 10});
        for (var x in ratings) {
            json[x] = ratings[x];
        }
    } catch(e) {
        return true;
    }
    return json;
});

// Rating a user
PUT(/\/user\/(.+)$/, function(userId) {
    this.response;
});