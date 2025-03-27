const express = require('express');
const router = express.Router();
const {
    addComment,
    deleteComment,
    getPopularComments 
} = require('../controllers/commentController');

router.post('/add', addComment);


router.get('/popular', getPopularComments);

router.delete('/:id', deleteComment);

module.exports = router;