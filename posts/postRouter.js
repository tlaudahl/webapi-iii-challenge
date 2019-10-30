const express = require('express');

const router = express.Router();

const postDb = require('../posts/postDb');

router.use(express.json());

router.get('/', (req, res) => {
    postDb.get()
    .then(posts => res.status(200).json(posts))
    .catch(err => res.status(500).json({ error: "Could not retrieve posts" }))
});

router.get('/:id', (req, res) => {
    const id = req.params.id;

    postDb.getById(id)
    .then(post => {
        if(post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ error: "Post with specified ID could not be found" })
        }
    })
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;

    postDb.remove(id)
    .then(post => {
        if(post){
            res.status(200).json(post);
        } else {
            res.status(404).json({ error: "Post with that ID could not be found"} )
        }
    })
});

router.put('/:id', (req, res) => {
    const id = req.params.id;
    if(!req.body) {
        res.status(400).json({ message: "missing post data" })
    } else if (!req.body.text || !req.body.user_id) {
        res.status(400).json({ message: "missing required text field and/or user id" })
    } else {
        postDb.update(id, req.body)
        .then(post => {
            if(post) {
                res.status(200).json({post})
            } else {
                res.status(404).json({ error: "Post with that ID could not be found" })
            }
        })
        .catch(err => res.status(500).json({ error: "Could not update the post" }))
    }
});

// custom middleware

function validatePostId(req, res, next) {
    const id = req.params.id;
    postDb.getById(id)
    .then(post => {
        if(post) {
            req.post = post;
            next();
        } else {
            res.status(400).json({ message: "Invalid user id" })
        }
    })
};

module.exports = router;