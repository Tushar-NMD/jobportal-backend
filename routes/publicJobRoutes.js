const express = require('express');
// const { getAllJobsForUsers } = require('../controllers/jobController');
const { getAllJobsForUsers, getSingleJob } = require('../controllers/jobController');
const router = express.Router();

router.get('/', getAllJobsForUsers);

router.get('/:id', getSingleJob);

module.exports = router;
