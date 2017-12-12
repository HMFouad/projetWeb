const express = require('express');
const router = express.Router();

const Speciality = require('../mongoose/model/speciality.model');

// Get users
router.get('/specialities', (req, res, next) => {
    console.log("On essaye de récup les spe");

    Speciality.find(function (err, specialities) {
        // TODO gestion d'erreur
        if (err) {
            console.log("err");
            return next(err);
        }

        const returned = [];

        for (const spe of specialities) {
            returned.push({
                name: spe.name,
                _id: spe._id
            });
        }

        res.json(returned);
    });
});
/*
router.post('/specialities',(req,res)=>{
    const tab = [ { name: "4TGL901S", url: "https://hackjack.info/et/Master2_4TGL901S/ical" },
                  { name: "INF501 A", url: "https://hackjack.info/et/INF501_A/ical" },
                  { name: "INF501 A1 ", url: "https://hackjack.info/et/INF501_A1/ical" },
                  { name: "INF501 A2", url: "https://hackjack.info/et/INF501_A2/ical" },
                  { name: "INF501 A3", url: "https://hackjack.info/et/INF501_A3/ical" },
                  { name: "INF501 A4", url: "https://hackjack.info/et/INF501_A4/ical" },
                  { name: "INF501 A5 ", url: "https://hackjack.info/et/INF501_A5/ical" },
                  { name: "4TGI901S", url: "https://hackjack.info/et/Master2_4TGI901S/ical" },
                  { name: "4TEM901S", url: "https://hackjack.info/et/Master2_4TEM901S/ical" },
                  { name: "4TIS901S  ", url: "https://hackjack.info/et/Master2_4TIS901S/ical" },
                  { name: "4TOV901S ", url: "https://hackjack.info/et/Master2_4TOV901S/ical" } ];

        let spe;
        for (const indexSpe in tab) {
            if (Object.prototype.hasOwnProperty.call(tab, indexSpe)) {
                spe = new Speciality({name: tab[indexSpe].name, url: tab[indexSpe].url});
                console.log(spe);
                //On insère
                spe.save(function (err) {
                    if (err) {
                        throw err;
                    }
                });
            }
        }
        res.status(200).json({success: true, message: "SUCCESS" });

});*/


module.exports = router;
