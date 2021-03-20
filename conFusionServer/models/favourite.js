const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favouriteSchema = new Schema({

	dish:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:'Dish'
	}],

	user:{
		type:mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},

},
	{
		timeStamps:true
	});

var Favourites = mongoose.model('Favourite',favouriteSchema);
module.exports = Favourites;