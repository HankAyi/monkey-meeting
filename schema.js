const mongoose = require("mongoose");


const Meetingschema = new mongoose.Schema({
    name : {type: String  },
    password : {type:String},
    // link : {type:String,required:true}
})
module.exports = mongoose.model("Meetings", Meetingschema )