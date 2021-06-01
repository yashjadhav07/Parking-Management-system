const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require('cors');

const API_PORT = 3005;
const app = express();

//Modals
const user = require('./modal/user');
const vehicle_parking = require('./modal/vehicle_parking');
const parking_space = require('./modal/parking_space');
const parking_zone = require('./modal/parking_zone');
const feedback = require('./modal/feedback');

//false mangoose pluralize
mongoose.pluralize(null);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const router = express.Router();

// MongoDB Connection
const dbUri = "mongodb+srv://Yash:9Zx26NvyJAjmmqTR@cluster0.78u6r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(dbUri, { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;


// connect through mongo client this is optional npm
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(dbUri, { useNewUrlParser: true });


db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

db.once('open', function () {
    console.log("MongoDB database connection established successfully");
})

router.get("/", (req, res) => {
    res.json({ message: "HELLOW WORLDUUHHHH" });
console.log("hello");
});

// Login Auth Route & New User Registration
router.post("/register", (req,res) => {
    console.log('req',req.body);
    entry = {
      _userId: req.body._userId,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      type: req.body.type
    };

    new user(entry).save((err, data) => {
        console.log("entry ", data);
        console.log("data error", err);
        if (err || !data) return res.status(400).json({
            success: false,
            message: "Unable to update"
        });

        user.create(entry, (err, data) => {
            console.log("data ", data)
            if (err || !data) return res.status(400).json({
                success: false,
                message: "Unable to insert"
            });

            return res.json({ success: true, data });
        });
    });
});

router.post("/login", (req, res) => {
    console.log('req ', req.body);
    let previlage = {
        canInitialize: true,
        canBookParking: true,
        canSeeReports: true,
        canSeeFeedbacks: true,
        canGiveFeedback: false,
        canSeeMyFeedbacks: false,
    };
    const { email, password } = req.body;
    user.findOne({ email }, (err, data) => {
        if (err || !data) return res.status(400).json({
            success: false,
            message: "User Not Exist"
        });
        if (password !== data.password) return res.status(400).json({
            success: false,
            message: "Password is not correct"
        });
        if (data.type === 'agent') {
            Object.assign(previlage, { canInitialize: false, canBookParking: true, canSeeFeedbacks: false, canGiveFeedback: true, canSeeMyFeedbacks: true });
        }
        let users = {
            u_id: data._userId,
            u_name: data.name,
            u_email: data.email,
            u_type: data.type,
            previlage
        }
        return res.json({ success: true, users });
    });
});

router.get("/getDashboard", (req, res) => {
    console.log('req ', req.body);
    parking_space.find({}, (err, data) => {
        if (err || !data) return res.status(400).json({
            success: false,
            message: "No Data Exist"
        });
        console.log(data)
        let dashboard = [];
        for (var i = 0; i < data.length; i++) {
            dashboard[i] = {
                title: data[i].parking_space_title,
                is_available: data[i].is_available,
                vehicle_no: data[i].vehicle_no || "",
                zone_id: data[i].parking_zone_id,
                vehicle_transaction_id: data[i].vehicle_transaction_id || ''
            }
        }

        return res.json({ success: true, dashboard });
    });
});

router.get("/getReport", (req, res) => {
    console.log('req ', req.body);
    vehicle_parking.find({}, (err, data) => {
        if (err || !data) return res.status(400).json({
            success: false,
            message: "No Data Exist"
        });
        console.log(data);
        let report = [];
        for (let d of data) {
            report.push({
                parking_zone_id: d.parking_zone_id,
                parking_space_id: d.parking_space_id,
                booking_date_time: d.booking_date_time,
                release_date_time: d.release_date_time,
                vehicle_no: d.vehicle_no
            })
        }
        return res.json({ success: true, report });
    });
});

router.get("/getZone", (req, res) => {
    console.log('req ', req.body);
    parking_zone.find({}, (err, data) => {
        if (err || !data) return res.status(400).json({
            success: false,
            message: "No Data Exist"
        });
        console.log("get zone: ", data);
        return res.json({ success: true, data });
    });
});

router.get("/createZone", (req, res) => {
    console.log('req ', req.body);

    function nextChar(c) {
        return String.fromCharCode(c.charCodeAt(0) + 1);
    }

    parking_zone.find({}, {}, {}, function (err, zone) {
        console.log("zone", zone);
        console.log(zone.length);
        if (err || !zone) return console.error(err);

        //let block = nextChar(zone.parking_zone_id);
        let block = String.fromCharCode(65 + zone.length);

        console.log('block', block);

        new parking_zone({
            parking_zone_id: block, parking_zone_title: block
        })
            .save((err, data) => {
                if (err) return console.error(err);
                console.log(data.parking_space_title + " saved to parkingMgmt collection.");

                for (let i = 1; i <= 10; i++) {
                    let par = new parking_space({
                        is_available: true, parking_space_id: `${block}${i == 10 ? i : '0' + i}`, parking_space_title: `${block}${i == 10 ? i : '0' + i}`,
                        parking_zone_id: block, vehicle_no: '', vehicle_transaction_id: ''
                    });
                    par.save((err, data) => {
                        if (err) return console.error(err);
                        console.log(data.parking_space_title + " saved to parkingMgmt collection.");
                    });
                }

                return res.json({ success: true, data })
            });
    });

});

router.get("/deleteZone", (req, res) => {
    console.log('req ', req.body);
    parking_zone.find({}, {}, {}, function (err, zone) {
        console.log("zone", zone);
        console.log(zone.length);
        if (err || !zone) return console.error(err);
        let block = String.fromCharCode(65 + (zone.length - 1));
        console.log('delete block', block);

        parking_space.deleteMany({ parking_zone_id: block }, function (err) { });
        parking_zone.deleteOne({ parking_zone_id: block }, function (err, data) {
            if (err) return console.error(err);
            console.log(data + " delete parking_zone from parkingMgmt collection.");
            return res.json({ success: true, data })
        })
    })
});

router.post("/bookParking", (req, res) => {
    console.log('req ', req.body);

    const { title, is_available, vehicle_no, zone_id } = req.body;

    let update = {
        is_available: false,
        vehicle_no: vehicle_no,
    },
    vehicle = {
        parking_zone_id: zone_id,
        parking_space_id: title,
        booking_date_time: new Date(),
        release_date_time: null,
        vehicle_no: vehicle_no
    };

    new vehicle_parking(vehicle).save((err, veh) => {
        console.log("veh ", veh);
        console.log("data error", err);
        if (err || !veh) return res.status(400).json({
            success: false,
            message: "Unable to update"
        });


        update.vehicle_transaction_id = veh._id;

        console.log("update ", update)
        parking_space.findOneAndUpdate({ parking_space_title: title }, update, { new: true, upsert: true, returnNewDocument: true }, (err, data) => {
            console.log("data ", data)
            if (err || !data) return res.status(400).json({
                success: false,
                message: "Unable to update"
            });
            return res.json({ success: true, data });
        });
    });
});

router.post("/releaseParking", (req, res) => {
    const { title, vehicle_transaction_id, is_available, vehicle_no, zone_id } = req.body;
    let update = {
        is_available: true,
        vehicle_no: '',
        vehicle_transaction_id: ''
    },
    vehicle = {
        release_date_time: new Date(),
    };

    vehicle_parking.findOneAndUpdate({ _id: mongoose.Types.ObjectId(vehicle_transaction_id) }, vehicle, (err, veh) => {
        if (err || !veh) return res.status(400).json({
            success: false,
            message: "Unable to update"
        });

        parking_space.findOneAndUpdate({ parking_space_title: title }, update, { new: true, upsert: true, returnNewDocument: true }, (err, data) => {
            console.log("data ", data)
            if (err || !data) return res.status(400).json({
                success: false,
                message: "Unable to update"
            });

            return res.json({ success: true, data });
        });
    });
});

router.get("/insert", (req, res) => {
    for (let i = 1; i <= 10; i++) {
        let par = new parking_space({
            is_available: true, parking_space_id: `A${i == 10 ? i : '0' + i}`, parking_space_title: `A${i == 10 ? i : '0' + i}`,
            parking_zone_id: "A", vehicle_no: '', vehicle_transaction_id: ''
        });
        par.save((err, data) => {
            if (err) return console.error(err);
            console.log(data.parking_space_title + " saved to parkingMgmt collection.");
        });
    }
    for (let i = 11; i <= 20; i++) {
        let par = new parking_space({
            is_available: true, parking_space_id: `B${i == 20 ? i - 10 : '0'.concat(i - 10)}`, parking_space_title: `B${i == 20 ? i - 10 : '0'.concat(i - 10)}`,
            parking_zone_id: "B", vehicle_no: '', vehicle_transaction_id: ''
        });
        par.save((err, data) => {
            if (err) return console.error(err);
            console.log(data.parking_space_title + " saved to parkingMgmt collection.");
        });
    }
    for (let i = 21; i <= 30; i++) {
        let par = new parking_space({
            is_available: true, parking_space_id: `C${i == 30 ? i - 20 : '0'.concat(i - 20)}`, parking_space_title: `C${i == 30 ? i - 20 : '0'.concat(i - 20)}`,
            parking_zone_id: "C", vehicle_no: '', vehicle_transaction_id: ''
        });
        par.save((err, data) => {
            if (err) return console.error(err);
            console.log(data.parking_space_title + " saved to parkingMgmt collection.");
            return "inserted";
        });
    }
});

router.get("/feedback", (req,res) => {
    console.log('req ', req.body);
    feedback.find({}, (err, data) => {
        if (err || !data) return res.status(400).json({
            success: false,
            message: "No Data Exist"
        });
        console.log(data)
        let feedback = [];
        for (var i = 0; i < data.length; i++) {
            feedback[i] = {
                id: data[i]._id,
                title: data[i].title,
                description: data[i].description,
                byuser: data[i].byuser,
                reply: data[i].reply,
            }
        }

        return res.json({ success: true, feedback });
    });
});

router.get("/myfeedback/:uname", (req,res) => {
    console.log('req ', req.body);
    feedback.find({ byuser: req.params.uname }, (err, data) => {
        if (err || !data) return res.status(400).json({
            success: false,
            message: "No Data Exist"
        });
        let feedback = [];
        for (var i = 0; i < data.length; i++) {
            feedback[i] = {
                title: data[i].title,
                description: data[i].description,
                byuser: data[i].byuser,
                reply: data[i].reply,
            }
        }
        console.log(feedback)
        return res.json({ success: true, feedback });
    });
});

router.post("/givefeedback", (req,res) => {
    const {title, description, byuser} = req.body;
    let fback = new feedback({
        title: title,
        description: description,
        byuser: byuser,
        reply: ""
    })
        .save(err => {
            if (err) return console.error(err);
            console.log("saved to feedback collection.");
            return "inserted";
        })
});

router.put("/givefeedback/reply", (req,res) => {
    const {id, reply} = req.body;

    let update = {
        reply: reply
    }
    feedback.findOneAndUpdate({ _id: id }, update, { new: true, upsert: true, returnNewDocument: true }, (err, data) => {
        console.log("data ", data)
        if (err || !data) return res.status(400).json({
            success: false,
            message: "Unable to update"
        });

        return res.json({ success: true, data });
    });
});

app.use("/api", router);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
