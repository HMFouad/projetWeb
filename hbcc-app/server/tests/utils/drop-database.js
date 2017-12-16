const AllModels = require('../../mongoose/all-models');

/**
 * Drop all the database.
 * @param {function} done Done function of mocha.
 */
function dropDatabase (done) {
    let droppedModel = 0;

    const allModelsKeys = Object.keys(AllModels);

    for (const ModelKey of allModelsKeys) {
        AllModels[ModelKey].remove({}, () => {
            droppedModel++;
            if (droppedModel >= allModelsKeys.length) {
                done();
            }
        });
    }
}


module.exports = dropDatabase;
