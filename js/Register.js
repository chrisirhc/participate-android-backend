// No error checking...

/**
 * Get the profileId given the userId
 */
GET(/\/getProfileId\/(.+)$/, function (userId) {
    var aprofile = Profile.search({'userId': userId});

    if (aprofile.length)
        aprofile = aprofile[0];
    else
        return JSON.stringify({ok: true,
            profile: {id: "0", name: "anonymous" + userId, 'userId': userId, photograph: null } } );

    return JSON.stringify({ok: true, profile: aprofile});
});

/**
 * The functionality for registering a user...
 */
GET(/\/register\/(.+)$/, function(profileId){
	return JSON.stringify({ok: true, pclass: getClassFromProfile(profileId)});
});

/**
 * The functionality for registering a user...
 */
POST(/\/register\/(.+)$/, function(profileId){
	return JSON.stringify({ok: true, pclass: getClassFromProfile(profileId)});
});

/**
 * Always returns a class that the profileId is currently attending
 * If there is no such class, it will return the "DEMO class"
 * @param {Object} profileId
 * @return {Object} pclass The current class that the student is attending
 */
function getClassFromProfile(profileId) {
    if (profileId != "0") {
		// check whether such a profile exists
	    var aprofile;
        try {
            aprofile = Profile.get(profileId);
        } catch (e) {
			// do nothing if there isn't since i'll check later
        }

		if (aprofile != null) {
	        var classList = InClass.search({'profileId': profileId});
	        var aclass, i;
	        for (i in classList) {
	            try {
	                aclass = Pclass.get(classList[i].classId);
	                if (Date.now()
	                        .between( // in sg
	                                Date.parse(aclass.startTime).setTimezoneOffset(+0800),
	                                Date.parse(aclass.endTime).setTimezoneOffset(+0800))
	                ) {
	                    return aclass;
	                }
	            } catch(e) {
					// even if he has a profile, throw him to the DEMO class
	            }
	        }
		}
    }
    return {id: "0", classTitle: "DEMO Class"};
}

/*
 *  Get the ClassId given the ClassTitle or if this is the ClassId, return it as well
 *  return ok:false when it is neither
 */
GET(/\/getClassIdFromTitle\/?$/, function() {
	var pclass;
	try {
		pclass = Pclass.search({'classTitle': this.request.query.classTitle})[0];
	} catch (e) {
	}
	if (pclass != undefined) {
		return JSON.stringify({ok: true, classId: pclass.id});
	}
	try {
		pclass = Pclass.get(this.request.query.classTitle)[0];
	} catch (e) {
	}
	if (pclass != undefined) {
		return JSON.stringify({ok: true, classId: pclass.id});
	}
	return JSON.stringify({
		ok: false
	});
});

/**
 * Get all the psessions for the class, and all the
 * ratings for each psession (the sum will do)
 * If the classId is invalid, it will output sessions from
 * DEMO class
 */
function getPsessionforClass (classId) {
	// get this class
	var pclass;
	try {
		pclass = Pclass.get(classId);
	} catch (e) {
	}
	// find all psessions under this class
	// TODO test whether this really works (the created thing)
	var ratingList;

	// find all psessions in the current slot
	var psessionList;

	// if a class was found
	if (pclass != null && pclass != undefined) {
		psessionList = Psession.search({
			'classId': classId,
			'startTime': {
				'>=': Date.parse(pclass.startTime).setTimezoneOffset(+0800).getTime()
			},
			'endTime': {
				'<=': Date.parse(pclass.endTime).setTimezoneOffset(+0800).getTime()
			}
		}, {sort: 'created'});

		// find previous sessions if empty?
		/* disabled by default
		var i = -1;
		while (!psessionList.length) {
			psessionList = Psession.search({
				'classId': classId,
				'startTime': {
					'>=': Date.parse(pclass.startTime).add(i).week().getTime()
				},
				'endTime': {
					'<=': Date.parse(pclass.endTime).add(i).week().getTime()
				}
			});
			i--;
		}
		*/
	} else {
		// make sure it has already ended to allow consolidation of the ratings
		psessionList = Psession.search({
			'classId': "0",
			'endTime': {"<=": new Date().getTime()}
			},
			{sort: 'created'});
	}
	// Compact result, reduce load time..
	var result = [];
	if (psessionList.length) {
		for (var i in psessionList) {
			// take only what you need...
			result[i] = {};
			result[i].pid = psessionList[i].id;
			result[i].rating = 0;
			ratingList = Rating.search({'psessionId': psessionList[i].id});
			psessionList[i].rating = 0;
			for (var j in ratingList) {
				result[i].rating += ratingList[j].ratingPoints;
			}
		}
	}
	return result;
	// forget about efficiency
}
GET(/\/pclasspart\/(.+)$/, function(classId){
	return JSON.stringify(getPsessionforClass(classId));
});
POST(/\/pclasspart\/(.+)$/, function(classId){
	return JSON.stringify(getPsessionforClass(classId));
});
// so that /pclasspart/0 is caught. This might be a bug. since /pclasspart/1 is caught by above
GET(/\/pclasspart\/?/, function() {return JSON.stringify(getPsessionforClass("0"));});
POST(/\/pclasspart\/?/, function() {return JSON.stringify(getPsessionforClass("0"));});

GET(/\/classpart\/(.+)$/, nicepage);
GET(/\/classpart\/?$/, function (){return nicepage("0")});

function nicepage(classTitle) {
	try {
		pclass = Pclass.search({'classTitle': classTitle})[0];
	} catch (e) {}
	if (pclass != undefined) {
		this.classTitle = classTitle;
		classId = pclass.id;
	} else {
		this.classTitle = "DEMO Class";
		classId = "0";
	}

	psessions = getPsessionforClass(classId);
	this.psessions = psessions;
	var apsession, currp;
	var i;
	for(i in this.psessions) {
		currp = this.psessions[i];
		apsession = Psession.get(currp.pid);
		try {
			if (apsession.participantId != "0") {
				currp.name = Profile.get(apsession.participantId).name;
			}
		} catch(e) {
			currp.name = "anonymous";
		}
		currp.time = (new Date(apsession.endTime)).setTimezoneOffset(+0800).toString();
	}
	return template("nicepage.html");
}