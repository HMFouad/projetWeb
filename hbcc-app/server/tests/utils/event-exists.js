const Event = require('../../mongoose/model/event.model');
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * Check if the event exists: then of the returned promise is the success handler.
 *
 * @param {string} userId Id of the user which have add the event which should exist
 *
 * @return {Promise}
 */
function eventExists (userId) {
    return new Promise((resolve) => {
        Event.find({ userId: userId }, (err, events) => {
            if (err || !events) {
                throw new Error('Fail find in db');
            }
            else {
                if (events.length === 1) {
                    resolve(events[0]);
                }
                else {
                    throw new Error('Event not exists or too much events added.');
                }

            }
        });
    });
}

module.exports = eventExists;
