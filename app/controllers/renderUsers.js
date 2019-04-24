const _array = require("lodash/array");
const _collection = require("lodash/collection");
const fetch = require("node-fetch");
const User = require("../models/User");
const convertToObject = require("../helpers/convertToObject");

async function renderUsers(req, res, next) {
    const { personid, min, max, gender } = req.query;
    const notLikedUsers = [];
    const userImages = [];

    try {
        const loggedInUser = await User.findOne({
            "username": req.session.user.username
        });
        const extractIds = [];
        await User.find({}, (err, data) => {
          if (err) console.log(err);

          for (var i = 0; i < req.session.user.beers.length; i++) {

            for (var j = 0; j < data.length; j++) {

              // console.log(data[j].beers);

              if (data[j].beers != null) {

                for (var k = 0; k < data[j].beers.length; k++) {
                  // console.log(data[j].beers[k].beer);

                  if (_collection.includes([data[j].beers[k].beer.bid], req.session.user.beers[i].beer.bid) == true) {
                    const matchUser = data[j]._id.toString();

                    if (matchUser != loggedInUser._id.toString()) {
                      extractIds.push(matchUser)
                    }
                  }
                }

              }

            }
          }
        });


        // const extractIds = users.map(user => user.id);

        // if (personid) {
        //     loggedInUser.likedpersons.push(personid);
        //     loggedInUser.save();
        // }
        //
        // for (let i = 0; i < loggedInUser.likedpersons.length; i++) {
        //     _array.pull(extractIds, loggedInUser.likedpersons[i]);
        // }

        convertToObject(_array.uniq(extractIds), notLikedUsers);

        for (let i = 0; i < 430; i++) {
            // const imageUrl = fetch ("https://source.unsplash.com/collection/181462/480x480");
            const imageUrl = ""
            userImages.push(imageUrl);
        }

        const promisedUsers = await Promise.all(notLikedUsers);
        const filteredUsers = promisedUsers.filter(user => user.age >= min && user.age <= max && user.gender === gender);

        await Promise.all(userImages)
            .then(userImages => {
                if (!min && !max && !gender) {
                    res.status(200).render("users", { users: promisedUsers, userImages: userImages });
                } else {
                    res.status(200).render("users", { users: filteredUsers, userImages: userImages });
                }
            });
    }
    catch(error) {
        next(error);
    }
}
module.exports = renderUsers;
