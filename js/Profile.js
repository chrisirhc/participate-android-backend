/**
 * Contain the user ID and the name to display as well as photograph to display
 */
var Profile = new Resource("profile",
/** @lends Profile */
{
    /** @constructs */
    '@constructor' : function (userId, name, photograph) {
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
GET(/\/profile\/delete\/(.+)$/, function (profileId) {
    try {
        this.aprofile = Profile.get(profileId);
        this.aprofile.remove();
    } catch (e) {
    }
    redirect("/profile");
});

// Show edit form
GET(/\/profile\/(.+)$/, function (profileId) {
    try {
        this.aprofile = Profile.get(profileId);
    } catch (e) {
        this.aprofile = {
            userId : null,
            name : null,
            photograph : null
        };
    }
    return template("profileform.html");
});
// Save changes or create a new class
POST(/\/profile\/?/, function () {
    if (this.request.body.profileId) {
        try {
            var aprofile = Profile.get(this.request.body.profileId);
            aprofile.userId = this.request.body.userId;
            aprofile.name = this.request.body.name;
            aprofile.photograph = this.request.body.photograph;
            aprofile.save();
        } catch (e) {
            return;
        }
    } else {
        var aprofile = new Profile(this.request.body.userId,
                this.request.body.name, this.request.body.photograph);
        aprofile.save();
    }
    redirect("/profile");
});
GET(/\/profile\/?/, function () {
    var profiles = Profile.search( {}, {'sort': 'userId'});
    if (profiles.length) {
        this.profiles = profiles;
        return template("profilelist.html");
    } else {
        redirect("/profile/new");
    }
});
function putNames(obj) {
	obj.names = {};
	profiles = Profile.search({});
	for (var i in profiles) {
		obj.names[profiles[i].id] = profiles[i].name;
	}
}