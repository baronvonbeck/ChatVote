const express = require('express');
const router = express.Router();

// GET - /*
router.get('/*', (req, res, next) => {
    res.render('index');
});

router.post('/*', (req, res, next) => {
    // res.render('/api/something/params)

    //res.json(req.body);
    console.log(req.body);
    res.render('index');
    //do stuff here
    // redirect (main page wherever)
});

// //  user enters info
// //  user hits submit
// //  application compiles data
// { search-str: "abcdefg",
//   twitter-user: "user id here",
//   instagram-user: blah
// }
// //  server side makes request to API
//     if twitter user 
//         get twitter info
//     if instagram
//         get insta info....
// //  application displays return data from API to user

module.exports = router;