system.use("com.joyent.Sammy");
system.use("com.joyent.Resource");
system.use("com.google.code.date");

// our objects (MODEL)
system.use("Class");

system.use("Profile");

// also contains control logic inside
system.use("Psession");

system.use("Rating");

system.use("InClass");

// actions (CONTROL)
// Take care of registering teacher / student
system.use("Register");

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


GET("/pushout", function() {
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