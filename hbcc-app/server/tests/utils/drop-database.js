const AllModels = require('../../mongoose/all-models');

/**
 * Drop all the database.
 *
 */
function dropDatabase () {
    let droppedModel = 0;

    const allModelsKeys = Object.keys(AllModels);

    return new Promise((resolve) => {
        for (const ModelKey of allModelsKeys) {
            AllModels[ModelKey].remove({}, () => {
                droppedModel++;
                if (droppedModel >= allModelsKeys.length) {
                    resolve();
                }
            });
        }
    });
}


module.exports = dropDatabase;
