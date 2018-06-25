const Book = require('../models/book');

var getBookByName= async function getBookByName(searchQuery){
    var book = await Book.find(
        {
            $or: [
                {title: {$regex: searchQuery, $options: 'i'}},
                {author: {$regex: searchQuery, $options: 'i'}},
                {publisher: {$regex: searchQuery, $options: 'i'}},
            ]
        },
        {
            frontCover: 1,
            title: 1,
            author: 1,
            averageRating: 1
        }
    ).limit(12);
    console.log(book);
    return book;
}

var getBookSuggestions= async function getBookSuggestions(searchQuery){
    var searchRegex = new RegExp("^"+searchQuery);
    var titles = await Book.find({title: {$regex:searchRegex , $options: 'i'}},{title: 1,}).limit(5);
    var searchSuggestions=[];
    for(index in titles)
    {
        searchSuggestions.push(titles[index].title);
    }
    return searchSuggestions;
}

module.exports={
    findBookByName:getBookByName,
    getBookSuggestions:getBookSuggestions
}