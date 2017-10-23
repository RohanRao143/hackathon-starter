const Venue = require('../models/Venue');
const crypto = require('crypto');

const storage = multer.diskStorage({
    filename:function (req,file,callback) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            if(err) return callback(err)
            callback(null, raw.toString('hex')+path.extname(file.originalname))
        })
    }});

const upload = multer({ dest: path.join(__dirname, 'uploads'), storage:storage });



/*
* Creates a venue
*/
exports.createVenue = (req,res) => {
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
        photos:[req.body.photo],
        timings:req.body.timings,
        prices: req.body.price,
        description:req.body.description,
        review:[req.body.comment]
    });
    // Venue.findOne({});
    venue.save((err) => {
        if (err) {
            return res.json({errors:err , msg:'sportcannot be saved'});
        }
        return res.json({venue:venue});
    });

    }


};

/*
*Updates a venue
*/
exports.updateVenue = (req,res) => {
    req.checkBody("email","please enter a valid email address").isEmail();
    req.checkBody("phone","please enter a valid phone number").optional().isMobilePhone("en-gb");

    var validationErrors = req.validationErrors();
    if(validationErrors){
        res.send(validationErrors);
        return;
    }
    else{
        Venue.findOneAndUpdate({_id:req.params.id},req.body,{new:true},(err,venue)=>{
            if(err){
                return res.json({errors:err,msg:'venue cannot be updated'});
            }
            return res.json({updatedVenue:venue});
        });
    }

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
* listing all sport subdocs of al docs
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


exports.uploadImage=(req,res)=>{
    upload.single('images')
  if(req.file){
     console.dir(req.file);
     req.file.filename= req.file.filename+'.jpg';

     console.log(req.file.filename);
     return res.end("thanku")
  }
  else{
      res.end("missing file");
  }
};

