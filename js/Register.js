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
/**
 * Get all the psessions for the class, and all the
 * ratings for each psession (the sum will do)
 */
GET(/\/pclasspart\/(.+)?/, function(classId) {
	// get this class
	var pclass = Pclass.get(classId);
	// find all psessions under this class
	// TODO test whether this really works (the created thing)
	var ratingList;

	// find all psessions in the current slot
	var psessionList = Psession.search({'classId': classId,
					'startTime': {'>=': new Date.parse(pclass.startTime).getTime()},
					'endTime': {'<=' : new Date.parse(pclass.endTime).getTime()}});
	if (psessionList.length) {
		for (var i in psessionList) {
			ratingList = Rating.search({'psessionId': psessionList[i].id});
			psessionList[i].rating = 0;
			for (var j in ratingList) {
				psessionList[i].rating += ratingList[j].ratingPoints;
			}
		}
	}
	return JSON.stringify(psessionList);
	// forget about efficiency
});