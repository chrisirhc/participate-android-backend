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

/**
 * Start a session given the profileId
 * @param {Object} profileId
 */
function startPsession(profileId) {
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
	// This is from the Register.js always returns a class, whether invalid ("DEMO class") or not
	var pclass = getClassFromProfile(profileId);

    // only care about the last one
    var psessionList = Psession.search( {
        participantId : this.aprofile.id
    }, {
        sort : 'created'
    });

    if (psessionList.length
            && psessionList[psessionList.length - 1].endTime == "") {
        // shift forward the startTime
        psessionList[psessionList.length - 1].startTime = Date.now().getTime();
        psessionList[psessionList.length - 1].save();
		this.apsession = psessionList[psessionList.length - 1];
    } else {
        // create new psession
        this.apsession = new Psession(this.aprofile.id, pclass.id, Date.now().getTime(), "");
        this.apsession.save();
    }
    return JSON.stringify( {
        ok : true, 'psession': this.apsession
    });
}
// Start psession
GET(/\/psession\/start\/(.+)$/, startPsession);
POST(/\/psession\/start\/(.+)$/, startPsession);

function stopPsession (profileId) {
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
            // TODO might want to use timestamp from the Android app instead
        psessionList[psessionList.length - 1].endTime = Date.now().getTime();
        psessionList[psessionList.length - 1].save();
		this.apsession = psessionList[psessionList.length - 1];

		// TODO possibly add this as a security feature in the future
        // enforce threshold
        /*
         * if (Date.parse(first).add({seconds: 5}).isBefore(Date.parse(second)))
         * remove;
         */
    }
    return JSON.stringify( {
        ok : true,
		'psessionId': this.apsession.id
    });
    // Send out XML RPC method to the Push API for the teacher's app
}
// Stop psession
GET(/\/psession\/stop\/(.+)$/, stopPsession);
// Post is used for webhooks
POST(/\/psession\/stop\/(.+)$/, stopPsession);

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