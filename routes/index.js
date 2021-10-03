const router = require('express').Router();
const apiRputes = require('./api');

router.use('/api', apiRputes);

router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;