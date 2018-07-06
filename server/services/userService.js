var User = require('../models/user');
var Shelf = require('../models/shelf');
var mongoose = require('mongoose');
const jwt=require('jsonwebtoken');

var _this = this;


exports.signup = async function (user) {

    var user = new User({
        _id:new mongoose.Types.ObjectId(),
        name:user.name,
        email:user.email,
        password:user.password,
        profilePic:user.profilePic,
        shelves:[],
        friends:[]
       });

    try 
    {
        var newUser= await user.save();
        console.log(newUser);
        return newUser;
    }

    catch (e) {
        throw Error("Error while creating user");
    }
}

exports.login = async function (user) {
    console.log(user);
  
    var user= await User.find({email:user.email,password:user.password});
    if(user[0])
    {
        const token = jwt.sign(
            {
                user_id:user[0]._id,
            },
            "racoon",
            {
                expiresIn:'2h'
            }
        );
        var userInfo=[{
            user:user[0],
            token:token
        }]
        return userInfo;
    }

    else return user;
}

exports.getShelves = async function (userId) {
    var response = await User.find({_id: userId},{shelves: 1});
    var shelfIds = response[0].shelves;
    var shelves = await Shelf.find({_id: {$in:shelfIds}}, {_id:1,shelfName: 1});
    return shelves;
}

exports.getUserById = async function(id){
    var user = await User.findById(id);
    return user;
}




