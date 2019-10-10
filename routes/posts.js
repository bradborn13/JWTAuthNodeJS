const router = require('express').Router();
const verifyJWT = require('./verifyToken');
router.get('/', verifyJWT, (req, res) => {
    res.json({
        posts: {
            title: 'my first post',
            description: 'random data you should get'
        }
    });
});

module.exports = router;