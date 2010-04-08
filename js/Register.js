// No error checking...
GET(/\/register\/(.+)$/, function (profileId) {
    var aprofile;
    try {
        aprofile = Profile.get(profileId);
    } catch (e) {
        return JSON.stringify({ok: false});
    }
    var classList = InClass.search({'profileId': profileId});
    var aclass, i;
    for (i in classList) {
        try {
            aclass = Pclass.get(classList[i].classId); 
            if (Date.now().between(Date.parse(aclass.startTime), Date.parse(aclass.endTime))) {
                return JSON.stringify({ok: true, pclass: aclass});
            }
        } catch(e) {
            // do nothing
        }
    }
    return JSON.stringify({ok: true});
});