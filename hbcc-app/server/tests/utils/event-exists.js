const Event = require('../../mongoose/model/event.model');

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
        Event.findAll({ userId: id }, (err, event) => {
            if (err || !event) {
                throw new Error('Event not exists');
            }
            else {
                resolve(event);
            }
        });
    });
}

module.exports = eventExists;
