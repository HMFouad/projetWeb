const express = require('express');
const router = express.Router();
const fs = require('fs');
const icalParser = require('ical');
const Event = require('../mongoose/model/event.model');

// get static file
const FILE_PATH = "../Master2_4TGL901S_iCalendar.ics";


// Get student events
router.get('/', (req, res, next) => {
    console.log ('Api service call: GET events');
    const ICS_TYPE_WANTED = 'VEVENT';

    fs.readFile(FILE_PATH, {encoding: "utf8"}, (err, data) => {
        if (err) return next(err);

        const events = [];

        const parsedEvents = icalParser.parseICS(data);

        for (const indexEvent in parsedEvents) {
            if (parsedEvents.hasOwnProperty(indexEvent) &&
                parsedEvents[indexEvent].type === ICS_TYPE_WANTED) {
                const currentEvent = new Event();

                // TODO parse description ?
                if (parsedEvents[indexEvent].description) {
                    currentEvent.title = parsedEvents[indexEvent].description;
                }

                if (parsedEvents[indexEvent].start) {
                    currentEvent.beginDate = new Date(parsedEvents[indexEvent].start);
                }

                if (parsedEvents[indexEvent].end) {
                    currentEvent.endDate = new Date (parsedEvents[indexEvent].end);
                }

                if (parsedEvents[indexEvent].location) {
                    currentEvent.location = parsedEvents[indexEvent].location;
                }

                events.push(currentEvent);
            }
        }

        // send result
        res.json (events);
    });

});

module.exports = router;
