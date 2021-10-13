const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment, Vote } = require('../models');

// get all posts for homepage
router.get('/', (req, res) => {
    Post.findAll({
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal(`(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id`), 'vote_count']
        ],
        include: [
            {
                model: Comment, // includes comments in posts
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username'] // includes the user of each comment
                }
            },
            {
                model: User, // includes the user of each post 
                attributes: ['username']
            }
        ]
    }).then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true})); // loops and maps each object into a serialized version -> saving results in a new posts array
        res.render('homepage', { posts });
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;  