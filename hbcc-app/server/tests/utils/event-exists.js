const Event = require('../../mongoose/model/event.model');
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

// TODO change name : get-event

/**
 * Check if the event exists: then of the returned promise is the success handler.
 *
 * @param {string} id Id of the event which should exist
 *
 * @return {Promise}
 */
function eventExists (id) {
    return new Promise((resolve) => {
        Event.find({ userId: ObjectId(id) }, (err, events) => {
            if (err || !events) {
                throw new Error('Fail find in db');
            }
            else {
                if (events.length === 1) {
                    resolve(events[0]);
                }
                else {
                    console.log(events);
                    throw new Error('Event not exists or too much events added.');
                }

            }
        });
    });
}

module.exports = eventExists;
