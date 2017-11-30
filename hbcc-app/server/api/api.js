const express = require('express');
const router = express.Router();
const fs = require('fs');


// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};




// Get student events
router.get('/events', function(req, res, next) {
  //On récupère le fichier ICS (ici local) et on le lit
  var filePath="../Master2_4TGL901S_iCalendar.ics";
	fs.readFile(filePath, {encoding: "utf8"}, function(err, data){
		if (err) return next(err);
    //On découpe le fichier pour récupérer les valeurs qui nous interessent
    var blocks= data.split("DTEND");
    var cours= [];
    for (i = 0, len = blocks.length; i < len; i++) {
      var splited= blocks[i].split("DESCRIPTION:");
      cours.push(splited[1]);
    }
    var description=[];
    var date=[];
    //Récupération de la description et des dates
    for (i = 0, len = cours.length; i < len-1; i++) {
      //console.log(cours[i]);
      var splited= cours[i].split('\\n');
      var descr=(splited[0]+splited[2]+splited[3]).split("\n");
      description.push(descr[0]);
      date.push(splited[1]);
    }
    //Découpage des dates pour récupérer date de début et date de fin
    var beginDate=[];
    var endDate=[];
    for (i = 0, len = date.length; i < len; i++) {
      var splited= date[i].split(" ");
      beginDate.push({jour:splited[3],heure:splited[5]});
      endDate.push({jour:splited[3],heure:splited[7]});
    }


    //Récupération de la localisation
    var blocks= data.split("SEQUENCE");
    var location= [];
    for (i = 0, len = blocks.length; i < len-1; i++) {
      var splited= blocks[i].split("LOCATION:");
      location.push(splited[1]);
    }
    console.log("Description : "+description[0]);
    console.log("Date de début : "+beginDate[0].jour + " " + beginDate[0].heure);
    console.log("Date de fin : "+endDate[0].jour + " " + endDate[0].heure);
    console.log("Localisation : "+location[0]);

    var events = {description : description,
                  beginDate : beginDate,
                  endDate : endDate,
                  location : location};

    res.json(events);
	});

});


module.exports = router;
