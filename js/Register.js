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
GET(/\/register\/(.+)$/, function (profileId) {
    var aprofile;
    if (profileId != "0") {
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
    }
    return JSON.stringify({ok: true, pclass: {id: "0", classTitle: "DEMO Class"}});
});