const express = require('express');
const router = express.Router();
const fs = require('fs');
const icalParser = require('ical');
const Event = require('../../mongoose/model/event.model');
const status_code = require('../../status-codes');
const checkAuth = require ('../utils/check-auth');
const internalServerError = require("../utils/internal_server_error");

// get static file
const FILE_PATH = "Master2_4TGL901S_iCalendar.ics";

/**
 * Get student events,
 * Select events according to the given date: events should take place in the given period
 * Request GET params should contain:
 *  * beginDate (ISO Date) (optional)
 *  * endDate (ISO Date) (optional)
 */
router.get('/events', (req, res, next) => {
    console.log ('Api service call: GET events');

    const ICS_TYPE_WANTED = 'VEVENT';

    fs.readFile(FILE_PATH, { encoding: "utf8" }, (err, data) => {
        if (err) {
            return next(err);
        }

        const events = [];

        const parsedEvents = icalParser.parseICS(data);

        const beginRequestedDate = new Date (req.query.beginDate);
        const endRequestedDate = new Date (req.query.endDate);

        // if beginRequestedDate given, check if it is valid
        if (typeof req.query.beginDate === typeof '' &&
            (!(beginRequestedDate instanceof Date) || isNaN(beginRequestedDate.getTime()))) {
            res.status(status_code.BAD_REQUEST)
               .json({
                   success: false,
                   message: `'beginDate' parameter should follow ISO standard.`
               });
        }
        // if endRequestedDate given, check if it is valid
        else if (typeof req.query.beginDate === typeof '' &&
                 (!(endRequestedDate instanceof Date) || isNaN(endRequestedDate.getTime()))) {
            res.status(status_code.BAD_REQUEST)
               .json({
                   success: false,
                   message: 'endDate parameter should follow ISO standard.'
               });
        }
        else {
            for (const indexEvent in parsedEvents) {
                if (parsedEvents.hasOwnProperty(indexEvent) &&
                    parsedEvents[indexEvent].type === ICS_TYPE_WANTED) {

                    const eventBeginDate = new Date(parsedEvents[indexEvent].start);
                    const eventEndDate = new Date(parsedEvents[indexEvent].end);

                    if ((typeof req.query.beginDate !== typeof '' || eventEndDate.getTime() > beginRequestedDate.getTime()) &&
                        (typeof req.query.endDate !== typeof '' || eventBeginDate.getTime() < endRequestedDate.getTime())) {
                        const currentEvent = new Event();

                        if (parsedEvents[indexEvent].description) {
                            const splittedDescription = parsedEvents[indexEvent].description.split('\n');
                            currentEvent.description = splittedDescription[0];
                        }

                        if (parsedEvents[indexEvent].location) {
                            currentEvent.location = parsedEvents[indexEvent].location;
                        }

                        currentEvent.start = eventBeginDate;
                        currentEvent.end = eventEndDate;

                        events.push(currentEvent);
                    }
                }
            }

            // send result
            res.json (events);
        }
    });

});



router.post('/events', (req, res) => {
    console.log ('Api service call: POST events');
    if (!req.body.description || !req.body.start || !req.body.end ){
        res.status(status_code.BAD_REQUEST)
            .json({
                success: false,
                message: "Mauvaise réception des données de l'évènement."
            });
    }
    else {
        checkAuth(req, res, (user) => {
            //Create event
            const event = new Event({
                description: req.body.description,
                location: req.body.location,
                start: req.body.start,
                end: req.body.end,
                userId: user._id
            });
            //Insert in db
            event.save(function (err) {
                if (err) {
                    internalServerError(res);
                }
                else {
                    res.status(status_code.SUCCESS)
                        .json({
                            success: true,
                            message: "SUCCESS" } );
                }
            });
        });
    }
});



module.exports = router;
