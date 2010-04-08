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
            if (Date.now()
                    .between( // in sg
                            Date.parse(aclass.startTime).setTimezoneOffset(+0800),
                            Date.parse(aclass.endTime).setTimezoneOffset(+0800))
                            ) {
                return JSON.stringify({ok: true, pclass: aclass});
            }
        } catch(e) {
            return JSON.stringify(e);
            // do nothing
        }
    }
    return JSON.stringify({ok: true});
});