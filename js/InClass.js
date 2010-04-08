// Who's in which class
var InClass = new Resource("inclass", {
    '@constructor' : function (profileId, classId) {
        this.profileId = profileId;
        this.classId = classId;
    }
});
InClass.transient = false;

// Show new form
GET("/inclass/new", function () {
    this.classes = Pclass.search( {});
    this.profiles = Profile.search( {});
    return template("inclassform.html");
});
// Delete. I didn't use a DELETE handler because we're making it super simple
GET(/\/inclass\/delete\/(.+)$/, function (inClassId) {
    try {
        InClass.remove(inClassId);
    } catch (e) {
    }
    redirect("/inclass");
});

// Show edit form
GET(/\/inclass\/(.+)$/, function (inClassId) {
    this.classes = Pclass.search( {});
    this.profiles = Profile.search( {});
    try {
        this.ainclass = InClass.get(inClassId);
    } catch (e) {
        this.ainclass = {
            classId : null,
            profileId : null
        };
    }
    return template("inclassform.html");
});

// Save changes or create a new inclass
POST(/\/inclass\/?/, function () {
    if (this.request.body.inClassId) {
        try {
            var ainclass = InClass.get(this.request.body.inClassId);
            ainclass.profileId = this.request.body.profileId;
            ainclass.classId = this.request.body.classId;
            ainclass.save();
        } catch (e) {
            return;
        }
    } else {
        var aclass = new InClass(this.request.body.profileId,
                this.request.body.classId);
        aclass.save();
    }
    redirect("/inclass");
});
GET(/\/inclass\/?/, function () {
    var inclasses = InClass.search( {});
    if (inclasses.length) {
        this.inclasses = inclasses;
        return template("inclasslist.html");
    } else {
        redirect("/inclass/new");
    }
});