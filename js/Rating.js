/*
 * Ratings
 */
var Rating = new Resource("rating", {
    '@constructor' : function (profileId, psessionId, ratingPoints, timestamp) {
		this.profileId = profileId;
		this.psessionId = psessionId;
		this.ratingPoints = ratingPoints;
		this.timestamp = timestamp;
    }
});
Rating.transient = false;
/**
 * Creates a new rating
 * @param {Object} rater
 * @param {Object} psessionId
 */
function createRating(rater, psessionId) {
	/*
	 * Originally, thought about rating without knowing the psessionId.
	 * But I guess that might be bad.
	 */
	/*
    Psession apsession =
        Psession.search({'profileId': ratee}, {'sort': 'createdBy'}).reverse()[0];
        */

    // might want to perform checks on whether they're in the same class? but nah

    var newrating = new Rating(rater, psessionId, 1, Date.now().toString());
    newrating.save();

	// notify the my comet server (optional, don't care if fail) NOT OPTIMISED
	try {
		this.apsession = Psession.get(psessionId);
		var ratingList = Rating.search({'psessionId': psessionId});
		var rating = 0;
		for (var j in ratingList) {
			rating += ratingList[j].ratingPoints;
		}
		return system.http.request("POST", "http://participate.vorce.net:9090/Psession", ["Accept", "application/json"],
     	JSON.stringify({'pid' : this.apsession.id, 'classId': this.apsession.classId, 'rating': rating})); // 1 point added
	} catch(e) {}

	return JSON.stringify({ok: true});
}

GET(/\/rate\/(.+)\/(.+)$/, createRating);
POST(/\/rate\/(.+)\/(.+)$/, createRating);
GET(/\/rate\/(.+)$/, function(psessionId) { return createRating("0", psessionId);} );
POST(/\/rate\/(.+)$/, function(psessionId) { return createRating("0", psessionId);} );

GET(/\/ratedelete\/(.+)$/, function (rateId) {
    try {
        Rating.remove(rateId);
    } catch (e) {
    }
    redirect("/rate");
});

GET(/\/rate\/?/, function () {
    var rating = Rating.search( {});
    if (rating.length) {
        this.ratingList = rating;
        return template("ratinglist.html");
    } else {
        return "nothing here";
    }
});