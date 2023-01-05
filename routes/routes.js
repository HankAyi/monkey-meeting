
const { v4: uuidV4 } = require('uuid')
const dotenv = require("dotenv")
dotenv.config();

// schema
const mongoose = require("mongoose");

const meetingschema = new mongoose.Schema({
    name: String,
    password: String,
    link: String
});
const meetingdb = mongoose.model("meetings", meetingschema);

// ROUTE#1 Home page
exports.home = function (req, res) {
    res.render('home');
};

// ROUTE#2 create meeting
exports.createmeeting = function (req, res) {
    res.render('meetingauth', { state: "Create", banner :"" });
};

// ROUTE#3 join meeting
exports.joinmeeting = function (req, res) {
    res.render('meetingauth', { state: "Join" , banner :""});
};


// ROUTE#4 submit create meeting


const host = process.env.host;
exports.postcreatemeeting = async function (req, res) {
    const { name, password } = req.body
    let find = await meetingdb.findOne({ name })
    if (find) {
        res.render('meetingauth', { state: "Create" , banner :"A Meeting with this Meeting name already exists.Try Another One"});
    }else{
    const uuid = uuidV4();
    // console.log(req.body)

    toredirect = `${host}/meeting/${uuid}/${name}`
    

    const savetodb = new meetingdb({
        name: name,
        password: password,
        link: toredirect
    });

    await savetodb.save();

    res.redirect(toredirect)
}
};



// ROUTE#5 submit join meeting
exports.postjoinmeeting = async function (req, res) {

    const { name, password } = req.body
    try {
        let data = await meetingdb.findOne({ name })
        //    console.log(data.password)
        if (!data) {
            res.render('meetingauth', { state: "Join", banner:"Invalid Credentials" })
        }
        if (data) {
            if (data.password == password) {
                res.redirect(data.link)

            } else {
                res.render('meetingauth', { state: "Join", banner:"Invalid Credentials" })
            }
        }
    } catch (error) {
        res.send(error)
    }

};
const bodyParser = require('body-parser');

exports.deletemeeting = async function (req, res) {
    const {link} =  ( req.body)
    // console.log("called",link)
   
     d = await meetingdb.findOneAndDelete({ link })
    //  console.log(d)
}