// List of classes
var Pclass = new Resource("class", {
    /*
     * TODO For future use, this should also have a start and expiry date
     */
    '@constructor' : function (aClassTitle, aStartTime, aEndTime) {
        this.startTime = aStartTime;
        this.endTime = aEndTime;
        this.classTitle = aClassTitle;
    }
});
Pclass.transient = false;
// Show new form
GET("/class/new", function () {
    return template("classform.html");
});
// Delete. I didn't use a DELETE handler because we're making it super simple
GET(/\/class\/delete\/(.+)$/, function (classId) {
    try {
        this.aclass = Pclass.get(classId);
        this.aclass.remove();
    } catch (e) {
    }
    redirect("/class");
});

// Show edit form
GET(/\/class\/(.+)$/, function (classId) {
    try {
        this.aclass = Pclass.get(classId);
    } catch (e) {
        this.aclass = {
            classTitle : null,
            startTime : null,
            endTime : null
        };
    }
    return template("classform.html");
});
// Save changes or create a new class
POST(/\/class\/?$/, function () {
    if (this.request.body.classId) {
        try {
            var aclass = Pclass.get(this.request.body.classId);
            aclass.classTitle = this.request.body.classTitle;
            aclass.startTime = this.request.body.startTime;
            aclass.endTime = this.request.body.endTime;
            aclass.save();
        } catch (e) {
            return;
        }
    } else {
        var aclass = new Pclass(this.request.body.classTitle,
                this.request.body.startTime, this.request.body.endTime);
        aclass.save();
    }
    redirect("/class");
});
GET(/\/class\/?$/, function () {
    var classes = Pclass.search( {});
    if (classes.length) {
        this.classes = classes;
        return template("classlist.html");
    } else {
        redirect("/class/new");
    }
});