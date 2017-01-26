var router = require('express').Router();
var User = require('../schemas/userSchema');
var bcrypt = require('bcryptjs');

// these are the endpoints and their related functions
router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

function createUser(req, res, next) {
    User.findOne({ email: req.body.email }, function (err, existingUser) {
        if (existingUser) {
            return res.status(400).send('A user with that email already exists.');
        } else {
            // encrypt the user's password before creating user
            bcrypt.hash(req.body.password, 10, function(err, hash) {
                if (err) {
                    return res.status(400).send('Could not encrypt password.');
                } else {
                    req.body.password = hash;
                    User.create(req.body, function (err, user) {
                        if (err) {
                            return res.status(400).send(err);
                        }
                        return res.status(201).send(user);
                    });
                }
            });
        }
    });
}

// get all users
function getUsers(req, res, next) {
    User.find({}, function (err, users) {
         if (err) {
             return res.status(500).send(err);
         } else {
             return res.status(200).send(users);
         }
    });
}

// get a specific user
function getUser(req, res, next) {
    User.findOne({_id: req.params.id}, function (err, user) {
        if (err) {
            return res.status(400).send(err);
        } else if (user == null) {
            return res.status(404).send({});
        } else {
            return res.status(200).send(user);
        }
    });
}

function updateUser(req, res, next) {
    User.findByIdAndUpdate(req.params.id, req.body, {runValidators: true}, function (err, user) {
        if (err) {
            return res.status(400).send(err);
        } else if (user == null) {
            return res.status(404).send({});
        } else {
            return res.status(200).send(user);
        }
    });
}

function deleteUser(req, res, next) {
    User.remove({_id: req.params.id}, function (err, ret) {
         if (err) {
             return res.status(400).send(err);
         } else if (ret.result.n == 0) {
             return res.status(404).send(ret);
         } else {
             return res.status(200).send(ret);
         }
    });

}

// Make these endpoints available
module.exports = router;
