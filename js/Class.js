// List of classes
var Class = new Resource("class", {
    /*
     * TODO For future use, this should also have a start and expiry date
     */
    '@constructor' : function (aClassTitle, aStartTime, aEndTime) {
        this.startTime = aStartTime;
        this.endTime = aEndTime;
        this.classTitle = aClassTitle;
    }
});
Class.transient = false;
// Show new form
GET("/class/new", function () {
    return template("classform.html");
});
// Delete. I didn't use a DELETE handler because we're making it super simple
GET(/\/class\/delete\/(.+)$/, function (classId) {
    try {
        this.aclass = Class.get(classId);
        this.aclass.remove();
    } catch (e) {
    }
    redirect("/class");
});

// Show edit form
GET(/\/class\/(.+)$/, function (classId) {
    try {
        this.aclass = Class.get(classId);
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
POST(/\/class\/?/, function () {
    if (this.request.body.classId) {
        try {
            var aclass = Class.get(this.request.body.classId);
            aclass.classTitle = this.request.body.classTitle;
            aclass.startTime = this.request.body.startTime;
            aclass.endTime = this.request.body.endTime;
            aclass.save();
        } catch (e) {
            return;
        }
    } else {
        var aclass = new Class(this.request.body.classTitle,
                this.request.body.startTime, this.request.body.endTime);
        aclass.save();
    }
    redirect("/class");
});
GET(/\/class\/?/, function () {
    var classes = Class.search( {});
    if (classes.length) {
        this.classes = classes;
        return template("classlist.html");
    } else {
        redirect("/class/new");
    }
});