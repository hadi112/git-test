const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate'); 
const cors = require('./cors');

const Favourites = require('../models/favourite');

const favouriteRouter = express.Router();

favouriteRouter.use(bodyParser.json());

favouriteRouter.route('/')
.get(cors.cors,authenticate.verifyUser,(req,res,next) => {
	Favourites.find({})
	.populate('dish')
	.populate('user')
	.then((favourite) => {
		res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favourite);
	}, (err) => next(err))
	.catch( (err) => next(err))
})
.post(cors.cors,authenticate.verifyUser,(req,res,next) => {
	Favourites.findOne({user:req.user._id})
	.then((favourite) => {
		if(favourite == null){
			Favourites.create()
			.then((favourite) => {
				for(var i = ((req.body.length)-1) ; i>=0 ; i--)
				{
					favourite.dish.push(req.body[i]);
				}
				favourite.save()
				res.statusCode = 200;
        		res.setHeader('Content-Type', 'application/json');
				res.json(favourite);
			},(err) => next(err))
		}
		else if(favourite !== null){
			Favourites.findOne({user: req.user._id})
			.then((favourite) => {
				for(var i = (req.body.length-1) ; i>=0 ; i--)
				{
					if(favourite.dish.indexOf(req.body[i]) == -1)
					{
						favourite.dish.push(req.body[i]);
					}
					else{
						err = new Error('Cannot Post duplicate favourite dishes');
            			err.status = 403;
            			return next(err);
					}
					favourite.save();
					res.statusCode = 200;
        			res.setHeader('Content-Type', 'application/json');
					res.json(favourite)
				}
			},(err) => next(err))
		}
		else{
			err = new Error('Cannot Post multiple favourite dishes');
            err.status = 403;
            return next(err);
		}
	},(err) => next(err))
	.catch((err) => next(err))
})
.delete(cors.cors,authenticate.verifyUser,(req,res,next) => {
	Favourites.remove()
	.then((resp) => {
		  	res.statusCode = 200;
        	res.setHeader('Content-Type', 'application/json');
        	res.json(resp);
	},(err) => next(err))
	.catch((err) => next(err))
})
.put(cors.cors,authenticate.verifyUser,(req,res,next) => {
	 res.statusCode = 403;
     res.end('PUT operation not supported');
})


/////////////////////////////



favouriteRouter.route('/:dishId')
.get(cors.cors,authenticate.verifyUser,(req,res,next) => {
	 res.statusCode = 403;
     res.end('PUT operation not supported');
})
.put(cors.cors,authenticate.verifyUser,(req,res,next) => {
	 res.statusCode = 403;
     res.end('GET operation not supported');
})
.post(cors.cors,authenticate.verifyUser,(req,res,next) => {
	Favourites.findOne(req.body._id)
	.then((favourite) => {
		if(favourite == null){
			let favid = {};
			favid.user = req.user._id;
			Favourites.create(favid)
			.then((favourite) => {
				if(Array.isArray(favourite.dish))
				{favourite.dish.push(req.params.dishId)}
				else{
					favourite.dish = [req.params.dishId];
				}
				favourite.save()
				.then((favourite) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(favourite);
				},(err) => next(err))
			},(err) => next(err))
			.catch((err) => next(err))
		}
		else if(favourite !== null){
			Favourites.findOne({user:req.user._id})
			.then((favourite) => {
				if(Array.isArray(favourite.dish))
				{favourite.dish.push(req.params.dishId)}
				else{
					favourite.dish = [req.params.dishId];
				}
				favourite.save()
				.then((favourite) => {
					res.statusCode = 200;
        			res.setHeader('Content-Type', 'application/json');
					res.json(favourite);
				},(err) => next(err))
			},(err) => next(err))
			.catch((err) => next(err))
		}
		else{
			err = new Error('Cannot Post multiple favourite dishes');
            err.status = 403;
            return next(err);
		}
	},(err) => next(err))
	.catch((err) => next(err))
})
.delete(cors.cors,authenticate.verifyUser,(req,res,next) => {
	Favourites.findOne({user: req.user._id})
	.then((favourite) => {
		if(favourite !== null){
			Favourites.findOne({user: req.user._id})
			.then((favourite) => {
				favourite.dish.remove(req.params.dishId);
				favourite.save()
				.then((favourite) => {
					Favourites.findOne({user: req.user._id})
					.populate('dish')
					.then((favourite) => {
						res.statusCode = 200;
                    	res.setHeader('Content-Type', 'application/json');
                    	res.json(favourite);
					},(err) => next(err))
				})
				.catch((err) => next(err))
			},(err) => next(err))
			.catch((err) => next(err))
		}
		else if(favourite == null){
			err = new Error('Favourite dish does not exists!!');
            err.status = 403;
            return next(err);
		}
	},(err) => next(err))
	.catch((err) => next(err))
})


module.exports = favouriteRouter;