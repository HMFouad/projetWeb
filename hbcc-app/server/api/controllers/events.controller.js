const express = require('express');
const router = express.Router();
const icalParser = require('ical');
const Event = require('../../mongoose/model/event.model');
const User = require('../../mongoose/model/user.model');
const Speciality = require('../../mongoose/model/speciality.model');
const statusCodes = require('../../status-codes');
const checkAuth = require ('../utils/check-auth');
const throwInternalServerError = require("../utils/throw-internal-server-error");

/**
 * Get student events,
 * Select events according to the given date: events should take place in the given period
 * Request GET params should contain:
 *  * beginDate (ISO Date) (optional)
 *  * endDate (ISO Date) (optional)
 */
router.get('/events', (req, res) => {
    console.log('Api service call: GET events');

    const ICS_TYPE_WANTED = 'VEVENT';

    // TODO GET User events
    checkAuth(req).then((user) => {
        const beginRequestedDate = new Date(req.query.beginDate);
        const endRequestedDate = new Date(req.query.endDate);

        // if beginRequestedDate given, check if it is valid
        if (typeof req.query.beginDate === typeof '' &&
            (!(beginRequestedDate instanceof Date) || isNaN(beginRequestedDate.getTime()))) {
            res.status(statusCodes.BAD_REQUEST)
                .json({
                    success: false,
                    message: `'beginDate' parameter should follow ISO standard.`
                });
        }
        // if endRequestedDate given, check if it is valid
        else if (typeof req.query.beginDate === typeof '' &&
            (!(endRequestedDate instanceof Date) || isNaN(endRequestedDate.getTime()))) {
            res.status(statusCodes.BAD_REQUEST)
                .json({
                    success: false,
                    message: 'endDate parameter should follow ISO standard.'
                });
        }
        else {
            Speciality.findOne({ _id: user.speciality }, (speErr, speciality) => {
                if (speErr || !speciality) {
                    throwInternalServerError(res);
                }
                else {
                    icalParser.fromURL(speciality.url, {}, (errIcs, parsedEvents) => {
                        if (errIcs) {
                            throwInternalServerError(res);
                        }
                        else {
                            const events = [];

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
                            res.json(events);
                        }
                    });
                }
            });
        }
    }).catch((throwErr) => {
        throwErr(res);
    });

});



router.post('/events', (req, res) => {
    console.log ('Api service call: POST events');
    if (!req.body.description || !req.body.start || !req.body.end ) {
        res.status(statusCodes.BAD_REQUEST)
            .json({
                success: false,
                message: "Mauvaise réception des données de l'évènement."
            });
    }
    else {
        checkAuth(req)
            .then((user) => {
                //Create event
                User.findOne({ _id: user._id }, (userErr, user) => {
                    if (userErr) {
                        throwInternalServerError(res);
                    }
                    else if (!user) {
                        res.status(statusCodes.BAD_REQUEST)
                            .json({ success: false, message: "L'utilisateur auquel atitré l'évènement est inconnu." });
                    }
                    else {
                        const event = new Event({
                            description: req.body.description,
                            location: req.body.location,
                            start: req.body.start,
                            end: req.body.end,
                            userId: user._id
                        });
                        console.log(user);
                        console.log(event);
                        //Insert in db
                        event.save(function (err) {
                            if (err) {
                                throwInternalServerError(res);
                            }
                            else {
                                res.status(statusCodes.SUCCESS)
                                    .json({
                                        success: true,
                                        message: "SUCCESS"
                                    });
                            }
                        });
                    }
                });
            })
            .catch((throwError) => {
                throwError(res);
            });
    }
});



module.exports = router;
