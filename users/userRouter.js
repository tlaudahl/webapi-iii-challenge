const express = require('express');

const router = express.Router();

const userDb = require('./userDb');
const postDb = require('../posts/postDb');

router.use(express.json());

router.post('/', (req, res) => {
    if(!req.body.name) {
        res.status(400).json({ error: "Please provide a name for the user" })
    } else {
        userDb.insert(req.body)
        .then(user => {
            res.status(201).json(user)
        })
        .catch(err => res.status(500).json({ error: "Could not add the user to the database" }))
    }
});

router.post('/:id/posts', validatePost, (req, res) => {
    const id = req.params.id;
    postDb.insert(req.body)
    .then(post => {
        res.status(201).json(post)
    })
    .catch(err => res.status(500).json({ error: "Could not add the post to the database" }))
});

router.get('/', (req, res) => {
    userDb.get()
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(err => res.status(500).json({ error: "The posts could not be retrieved" }))
});

router.get('/:id', validateUserId, (req, res) => {
    const id = req.params.id
    userDb.getById(id)
    .then(user => {
        if(user){
            res.status(200).json(user)
        } else {
            res.status(404).json({ error: "User with that ID could not be found"})
        }
    })
    .catch(err => res.status(500).json({ error: "User could not be fetched" }))
});

router.get('/:id/posts', validateUserId, (req, res) => {
    const id = req.params.id;
    userDb.getUserPosts(id)
    .then(user => {
        if(user) {
            res.status(200).json(user)
        } else {
            res.status(404).json({ error: "User not found" })
        }
    })
    .catch(err => res.status(500).json({ error: "Could not get the posts for that user" }))
});

router.delete('/:id', validateUserId, (req, res) => {
    const id = req.params.id;
    userDb.remove(id)
    .then(user => {
        if(user) {
            res.status(200).json(user)
        } else {
            res.status(404).json({ error: "User with specified ID does not exist" })
        }
    })
    .catch(err => res.status(500).json({ error: "Error deleting the user from the database" }))
});

router.put('/:id', validateUser, (req, res) => {
    const id = req.params.id;
    if(!req.body.name) {
        res.status(400).json({ error: "Please include a name to update" })
    } else {
        userDb.update(id, req.body)
        .then(user => {
            if(user) {
                res.status(200).json(user)
            } else {
                res.status(404).json({ error: "User with that ID could not be found" })
            }
        })
        .catch(err => res.status(500).json({ error: "Could not update user" }))
    }
});

//custom middleware

function validateUserId(req, res, next) {
    const id = req.params.id;
    userDb.getById(id)
    .then(user => {
        if(user) {
            req.user = user;
            next();
        } else {
            res.status(400).json({ message: "Invalid user id" })
        }
    })
};

function validateUser(req, res, next) {
    if(!req.body) {
        res.status(400).json({ message: "missing user data" })
    } else if (!req.body.name) {
        res.status(400).json({ message: "missing required name field" })
    } else {
        next();
    }
};

function validatePost(req, res, next) {
    if(!req.body) {
        res.status(400).json({ message: "missing post data" })
    } else if (!req.body.text || !req.body.user_id) {
        res.status(400).json({ message: "missing required text field and/or user id" })
    } else {
        next();
    }
};

module.exports = router;
