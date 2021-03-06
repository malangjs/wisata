var express = require('express');
var router  = express.Router();
var async   = require('async');

/* GET places listing. */
router.get('/:city', function(req, res, next) {
	var db      = req.db;
	var place   = db.get('place');
	var city    = db.get('city');

	// Fetch database
	var cityName = req.params.city;
	async.parallel({

		// Load kota
		city : function( cb ) {
			city.findOne({ name : cityName }, function( err, cityResult ) {
				if(err) return cb( err ); //console.error(err);

				cb( null, cityResult );
			});
		},
		// Load tempat
		places : function( cb ) {
			place.find({ city : cityName }, function( err, placesResult ) {
				if(err) return cb( err ); //console.error(err);

				cb( null, placesResult );
			});
		}

	}, function( err, results ) {
		if (err) console.log(err); //return next(err);

		return res.json( results );
	});

});

module.exports = router;