const express = require('express');
const router = express.Router();


const API_PATH = "/api/";


router.get(API_PATH + "*", (req, res, next) => {
    res.send('Hello from API!');
});


module.exports = router;