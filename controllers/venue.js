const Venue = require('../models/Venue');




/*
* Creates a venue
*/
exports.createVenue = (req,res) => {
    const venue = new Venue({
        name: req.body.name,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
        sport:[req.body.sport],
        prices: req.body.price,
        description:req.body.description
    });
    // Venue.findOne({});
    venue.save((err) => {
        if (err) {
            return res.json({errors:err , msg:'sportcannot be saved'});
        }
        return res.json({venue:venue});
    });

};

/*
*Updates a venue
*/
exports.updateVenue = (req,res) => {
    Venue.findOneAndUpdate({_id:req.params.id},req.body,(err,venue)=>{
        if(err){
            return res.json({errors:err,msg:'venue cannot be updated'});
        }
        return res.json({updatedVenue:venue});
    });
};

/*
* lists all venues
*/
exports.venueList =(req,res) => {
    Venue.find({},(err,venues)=>{
        if(err){
            return res.json({errors:err});
        }

        return res.json({venuelist:venues});
    })
};

/*
* deletes a venue
*/
exports.deleteVenue =(req,res)=>{
    Venue.deleteOne({_id:req.params.id},(err,venue)=>{
        if(err){
           return res.json({errors:err,msg:'venue cannot be deleted'});
        }
        return res.json({deletedvenue:venue});
    })
};