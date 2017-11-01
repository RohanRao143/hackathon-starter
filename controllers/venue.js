const Venue = require('../models/Venue');
const crypto = require('crypto');
const path = require('path');
const multer = require('multer');
const readChunk = require('read-chunk');
const fileType = require('file-type');
const fileSystem = require('fs');
const replaceExt= require('replace-ext');

const storage = multer.diskStorage({
    destination: function (req,file,callback) {
        callback(null,'./uploads/venueImages');
    },
    filename:function (req,file,callback) {

        crypto.pseudoRandomBytes(16, function (err, raw) {
            if(err) return callback(err);
            callback(null, raw.toString('hex'));
        })
    }});

var  upload = multer({storage:storage });



var upload1 = upload.array('images',8);
/*
* Creates a venue
*/
exports.createVenue = (req,res) => {

    var venueImages = [];
    upload1(req,res, function(err){

      if(req.files){
        var files  = req.files;
        for(var i = 0; i<files.length;i++){
            const buffer = readChunk.sync('./uploads/tmp/'+files[i].originalname,0,4100);
            var fType=fileType(buffer);
            path1 = replaceExt(files[i].path , '.'+fType.ext);
            fileSystem.rename(req.files[i].path , path1, (err)=>{
                if(err){
                    console.log(err);
                }
                //console.log(files)
            });
            var pathExtName = path.extname(path1);
            if(!pathExtName==('.jpg'||'.png')){
                fileSystem.unlink(path1);
            }
            venueImages[i] = {path:path1};

        }
        console.log(venueImages);
        if(err){
                    res.end('error');
                }
      }


    req.checkBody("email","enter a valid email address").isEmail();
    req.checkBody("phone","enter a valid mobile number").optional().isMobilePhone("en-gb");

    var validationErrors = req.validationErrors();
    if(validationErrors) {
        res.send(validationErrors);
        return;
    }
    else{

    const venue = new Venue({
        name: req.body.name,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
        sport:[req.body.sport],
        photos:venueImages,
        timings:req.body.timings,
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

    }
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
*Updates a venue
*/
exports.updateVenue = (req,res) => {
    req.checkBody("email","please enter a valid email address").optional().isEmail();
    req.checkBody("phone","please enter a valid phone number").optional().isMobilePhone("en-gb");

    var validationErrors = req.validationErrors();
    if(validationErrors){
        res.send(validationErrors);
        return;
    }
    else{
        // req.body.review =[]
        Venue.findOneAndUpdate({_id:req.params.id},req.body,{new:true},(err,venue)=>{
            if(err){
                return res.json({errors:err,msg:'venue cannot be updated'});
            }
            return res.json({updatedVenue:venue});
        });
    }
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


/*
* create a sport sub documnet in venue document
*/
exports.createsporttype =(req,res)=>{
  Venue.findOneAndUpdate({_id:req.params.id},{$push:{sport:{name:req.body.name}}},{returnNewDocument:true},
      (err,venue)=>{
          if(err){
              res.json({errors:err});
          }
          res.json({sportTypes:venue.sport});
      })
};

/*
* delete a sport sub document in venue document
*/
exports.deleteSportType=(req,res) =>{
  Venue.findOne({_id:req.params.id},(err, venue)=>{

      if(err){
          return res.json({error:err});
      }
      venue.sport.id(req.params.sportid).remove();
      venue.save(function(err) {
         if(err)
             return res.json({savederror:err,msg:'subdoc wasnt deleted'});
      });
      return res.json({venue:venue})


  })
};

/*
* lists all sport subdocs of al docs
*/
exports.listAllSportTypes=(req,res)=>{
  Venue.findOne({_id:req.params.id},(err,venue)=>{
     if(err){
         return res.json({Error:err});
     }
     // var listsport =[];
     // var x = function () {
     //     for(var i=0;i<venues.length;i++){
     //         for(var sport in venues[i]){
     //             listsport[i] = venues[i].sport;
             // }
         // }
     //};
     // x();
     res.json({SportTypes:venue[0].sport});
  });
};

/*
*
*/



















/*
Reviews
*/
exports.createReview = (req,res)=>{
    Venue.findOneAndUpdate({_id:req.params.id},
        {$push:{'review':{
            'username':req.body.username,
            'rating':req.body.rating,
            'feedback':req.body.feedback
        }
        }},
        {returnNewDocument:true},(err,venue)=>{
        if(err){
            res.json({errors:err});
        }
        res.json({venue:venue});

    });
};

exports.deleteReview =(req,res)=>{
    Venue.findOneAndUpdate({_id:req.params.id},{$pull:{'review':{'_id':req.params.reviewid}}},
        {returnNewDocument:true},(err,venue)=>{
        if(err){
            res.json({errors:err});
        }
        res.json({venue:venue});
        }

    );
};

exports.updateReview = (req,res)=>{
    Venue.update({_id:req.params.id,"review._id":req.params.reviewid},
        {'$set':{'review.$.username':req.body.username,
               'review.$.rating':req.body.rating,
               'review.$.feedback':req.body.feedback}},
        {returnNewDocument:true},
        (err,venue)=>{
                       if(err){
                           res.json({errors:err});
                       }
                       res.json({venue:venue});
        });
};

exports.listreviews =(req, res)=>{
  Venue.findOne({_id:req.params.id},(err, venue)=>{
      if(err){
        res.json({errors:err});
      }
      res.json({reviews:venue.review});
  })
};


/*
photos
 */
//create photo
exports.createvenuephoto = (req,res)=>{

    var venueImages = [];
    upload1(req,res, function(err) {
        if (req.files) {
            var files = req.files;
            for (var i = 0; i < files.length; i++) {
                const buffer = readChunk.sync('./uploads/tmp/' + files[i].originalname, 0, 4100);
                var fType = fileType(buffer);
                path1 = replaceExt(files[i].path, '.' + fType.ext);
                fileSystem.rename(req.files[i].path, path1, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    //console.log(files)
                });
                var pathExtName = path.extname(path1);
                if (!pathExtName == ('.jpg' || '.png')) {
                    fileSystem.unlink(path1);
                }
                venueImages[i] = {path: path1};

            }
            console.log(venueImages);
            if (err) {
                res.end('error');
            }
        }
        for(var i = 0; i<venueImages.length; i++) {
            Venue.findOneAndUpdate({_id: req.params.id}, {$push: {'photos': venueImages[i]}},
                {returnNewDocument:true},
                (err,venue)=>{
                if(err){
                    res.json({error:err});
                }
                res.json({venue:venue.photos});
            });
        }
    });
};

//list photos
exports.listVenuePhotos = (req,res)=>{
    Venue.findOne({_id:req.params.id},(err,venue)=>{
       if(err){
           res.json({errors:err});
       }
       res.json({VenuePhotos:venue.photos})
    });
};

//del photo
exports.deleteVenuePhoto = (req,res) =>{
    console.log("got it");
    Venue.findOne({_id:req.params.id},(err,venue)=> {
        if(err){
            res.json({error:err});
        }

        console.log(venue.photos.id(req.params.photoid));
        fileSystem.unlink(venue.photos.id(req.params.photoid).path);
        venue.photos.id(req.params.photoid).remove();
        venue.save(function (err) {
            if(err){
                res.json({photoDelError:err,msg:"photo aint dele"})
            }
            res.json({venue:venue});
        });
    });
};

//