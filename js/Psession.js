// Psession
var Psession = new Resource("psession", {
    /*
     * TODO May not have the endTime during the creation of this object
     */
    '@constructor' : function (participantId, classId, startTime, endTime) {
        this.participantId = participantId;
        this.classId = classId;
        this.startTime = startTime;
        this.endTime = endTime;
    }
});
Psession.transient = false;

// Start psession
GET(/\/psession\/start\/(.+)$/, function (profileId) {
    try {
        this.aprofile = Profile.get(profileId);
    } catch (e) {
        this.aprofile = {
            id : profileId,
            userId : "anonymous (" + profileId + ")",
            name : null,
            photograph : null
        };
    }
    // TODO get the class

        // only care about the last one
        var psessionList = Psession.search( {
            participantId : this.aprofile.id
        }, {
            sort : 'created'
        });

        if (psessionList.length
                && psessionList[psessionList.length - 1].endTime == "") {
            // shift forward the startTime
            psessionList[psessionList.length - 1].startTime = Date.now()
                    .toString();
            psessionList[psessionList.length - 1].save();
        } else {
            // create new psession
            this.apsession = new Psession(this.aprofile.id, "Demo", Date.now()
                    .toString(), "");
            this.apsession.save();
        }
        return JSON.stringify( {
            ok : true
        });
        // TODO Send out XML RPC method to the Push API to push to the Android
        // App
        /*
         * system.http.request("POST", "http://mp.labs.ericsson.net/mp/rpc", [],
         * <methodCall> <methodName>getApplicationList</methodName> <params>
         * <param> <value><string>3f73a881746726650649bba254ea00e0</string></value>
         * </param> </params> </methodCall>);
         */
    });
// Stop psession
GET(/\/psession\/stop\/(.+)$/, function (profileId) {
    try {
        this.aprofile = Profile.get(profileId);
    } catch (e) {
        this.aprofile = {
            id : profileId,
            userId : "anonymous (" + profileId + ")",
            name : null,
            photograph : null
        };
    }
    var psessionList = Psession.search( {
        participantId : this.aprofile.id
    }, {
        sort : 'created'
    });

    // Only if there is something to stop
        if (psessionList.length
                && psessionList[psessionList.length - 1].endTime == "") {
            // might want to use timestamp from the Android app instead
        psessionList[psessionList.length - 1].endTime = Date.now().toString();
        psessionList[psessionList.length - 1].save();
        // Remember threshold
        /*
         * if (Date.parse(first).add({seconds: 5}).isBefore(Date.parse(second)))
         * remove;
         */
    }
    return JSON.stringify( {
        ok : true
    });
    // Send out XML RPC method to the Push API for the teacher's app
});
// Delete psession
GET(/\/psession\/delete\/(.+)$/, function (psessionId) {
    try {
        Psession.remove(psessionId);
    } catch (e) {
    }
    redirect("/psession");
});

GET(/\/psession\/?/, function () {
    var psession = Psession.search( {});
    if (psession.length) {
        this.psessionList = psession;
        return template("psessionlist.html");
    } else {
        return "nothing here";
    }
});