const express = require('express');
const router = express.Router();

router.get("/", (req, res, next) => {
    res.render('vote_create');
});
router.get("/*", (req, res, next) => {
    res.render('vote');
});


module.exports = router;