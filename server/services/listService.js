const Book = require('../models/book');

var getTrendingList = async function getTrendingList() {
    var trending = await Book.find({isTrending: true},{frontCover:1,title:1,author:1,averageRating:1}).limit(12);
    return trending;
}

var getTopRatedList = async function getTopRatedList() {
    var topRated = await Book.find({averageRating: {$gte : 4}},{frontCover:1,title:1,author:1,averageRating:1}).limit(12);
    return topRated;
}

var getNewlyReleasedList = async function getNewlyReleasedList() {
    var newReleases = await Book.find({},{frontCover:1,title:1,author:1,averageRating:1}).limit(12);
    return newReleases;
}

module.exports = {
    getNewlyReleasedList : getNewlyReleasedList,
    getTrendingList : getTrendingList,
    getTopRatedList : getTopRatedList,
}