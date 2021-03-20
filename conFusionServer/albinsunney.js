const express = require('express');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Favorites = require('../models/favorites');
const { set } = require('../app');
const e = require('express');

const favRouter = express.Router();
favRouter.use(bodyParser.json());

favRouter.route('/')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200);})
.get(cors.cors,authenticate.verifyUser, (req,res,next) => {
    // console.log(req.user._id);
    Favorites.find( {user:req.user._id} )
    .populate('dishes')
    .populate('user')
    .then((fav) => {
        // console.log(fav);  
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(fav); 
    })
    .catch((err)=> next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id}).then((fav) => {
        if(fav){
            // console.log("IN IF ",...new Set([...req.body,...fav.dishes]))
            IdSet = new Set();
            var IdArr = req.body;
            IdArr.forEach(element => {
                IdSet.add(element._id);
            });
            IdSet.add(String(...fav.dishes));
            // console.log("In If ",IdSet);
            fav.dishes = [...IdSet];
            console.log("final: ",fav.dishes);
            fav.save()
            .then((fav)=> {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fav);
            });
        }
        else{
            newfav = new Favorites({user:req.user._id});
            IdSet = new Set();
            var IdArr = req.body;
            IdArr.forEach(element => {
                IdSet.add(element._id);
            });
            // console.log("In Else ",IdSet);
            // console.log("IN ELSE ",...new Set([(...req.body)]));
            newfav.dishes.push(...IdSet);
            newfav.save()     
            .then((newfav)=> {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(newfav);
            });
        }
    }).catch((err)=> next(err));
    // for(i =0;i< req.body.length; i++){
    //     req.body[]
    // }
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported ');
})
.delete(cors.corsWithOptions,authenticate.verifyUser, (req,res,next) => {
    Favorites.deleteOne({user:req.user._id}).then((result) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);   
    }).catch((err)=> next(err));
});



favRouter.route('/:dishId')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200);})
.get(cors.cors,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported here');
})
.post(cors.corsWithOptions,authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id}).then((fav) => {
        if(fav){
            if(fav.dishes.indexOf(req.params.dishId) == -1){
                fav.dishes.push(req.params.dishId)
                fav.save()
                .then((fav)=> {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(fav);
                });
            }
            else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fav);
            }
        }
        else{
            newfav = new Favorites({user:req.user._id});
            newfav.dishes.push(req.params.dishId);
            newfav.save()     

            .then((newfav)=> {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(newfav);
            });
        }

    }).catch((err)=> next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported');
})
.delete(cors.corsWithOptions,authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user:req.user._id}).then((fav) => {
            indexOfFav = fav.dishes.indexOf(req.params.dishId);
            console.log(indexOfFav);
            if(indexOfFav != -1){
                //Element is present
                if(fav.dishes.length == 1){
                    Favorites.deleteOne({user:req.user._id}).then((result) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(result);   
                    }).catch((err)=> next(err));
                }
                else{
                    fav.dishes.splice(indexOfFav,1);
                    fav.save().then((newfav)=> {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(newfav); 
                    }).catch((err)=>next(err));
                }
               
            }
            else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fav); 
            }
            
            
                 
    }) 
    .catch((err)=>next(err));
});
module.exports = favRouter;