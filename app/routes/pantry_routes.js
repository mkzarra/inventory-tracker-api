// Express docs: http://expressjs.com/en/api.html
const express = require('express');
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport');

// pull in Mongoose model for pantries
const Pantry = require('../models/pantry');

// we'll use this to intercept any errors that get thrown and send them
// back to the client with the appropriate status code
const handle = require('../../lib/error_handler');

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const { handle404, requireOwnership } = require('../../lib/custom_errors');
// we'll use handle404 to send 404 when non-existant document is requested
// we'll use requireOwnership to send 401 when a user tries to modify a resource
// that's owned by someone else

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `res.user`
const requireToken = passport.authenticate('bearer', { session: false });

// instantiate a router (mini app that only handles routes)
const router = express.Router();

// INDEX
// GET /pantry
router.get('/pantry', (req, res) => {
  console.log(res, req);
  Pantry.find()
    .then(pantry => {
      // `pantry` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return pantry.map(pantry => pantry.toObject());
    })
    // respond with status 200 and JSON of the pantry
    .then(pantry => res.status(200).json({ pantry: pantry }))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res));
});

// SHOW
// GET /pantry/5a7db6c74d55bc51bdf39793
router.get('/pantry/:id', (req, res) => {
  // req.params.id will be set based on the `:id` in the route
  Pantry.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "pantry" JSON
    .then(pantry => res.status(200).json({ pantry: pantry.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res));
});

// CREATE
// POST /pantry
router.post('/pantry/new', requireToken, (req, res) => {
  // set owner of new pantry to be current user
  console.log(req.body);
  req.body.pantry.owner = req.user.id;

  Pantry.create(req.body.pantry)
    // respond to succesful `create` with status 201 and JSON of new "pantry"
    .then(pantry => {
      res.status(201).json({ pantry: pantry.toObject() });
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(err => handle(err, res));
});

// UPDATE
// PATCH /pantry/5a7db6c74d55bc51bdf39793
router.patch('/pantry/:id', requireToken, (req, res) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.pantry.owner;

  Pantry.findById(req.params.id)
    .then(handle404)
    .then(pantry => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, pantry);

      // the client will often send empty strings for parameters that it does
      // not want to update. We delete any key/value pair where the value is
      // an empty string before updating
      Object.keys(req.body.pantry).forEach(key => {
        if (req.body.pantry[key] === '') {
          delete req.body.pantry[key]
        }
      });

      // pass the result of Mongoose's `.update` to the next `.then`
      return pantry.update(req.body.pantry);
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res));
});

// DESTROY
// DELETE /pantry/5a7db6c74d55bc51bdf39793
router.delete('/pantry/:id', requireToken, (req, res) => {
  Pantry.findById(req.params.id)
    .then(handle404)
    .then(pantry => {
      // throw an error if current user doesn't own `pantry`
      requireOwnership(req, pantry);
      // delete the pantry ONLY IF the above didn't throw
      pantry.remove();
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res));
});

module.exports = router;
