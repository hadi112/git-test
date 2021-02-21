const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the promotions to you!');
})
.post((req, res, next) => {
    res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete((req, res, next) => {
    res.end('Deleting all promotions');
});


promoRouter.route('/:promotionsId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send the promotions: ' + req.params.promotionsId);
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /:promotionsId');
})
.put((req, res, next) => {
	res.write('Updating the promotions: ' + req.params.promotionsId + '\n');
	res.end('Will add the promotions: ' + req.body.name + ' with details: ' + req.body.description);
})
.delete((req, res, next) => {
    res.end('Deleting the promotions: ' + req.params.promotionsId);
});

module.exports = promoRouter;