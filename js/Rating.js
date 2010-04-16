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

GET(/\/rate\/(.+)\/(.+)$/, function (rater, psessionId) {
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
	return JSON.stringify({ok: true});
});

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