/*
 * Ratings
 */
var Rating = new Resource("rating", {
    '@constructor' : function (profileId, psessionId, ratingPoints, timestamp) {
    }
});
Rating.transient = false;