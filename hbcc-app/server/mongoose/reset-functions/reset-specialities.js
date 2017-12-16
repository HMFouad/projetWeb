const Speciality = require('../model/speciality.model');
const defaultSpecialities = require('../default-data/specialities');

/**
 * Remove all specialities and insert all default specialities.
 *
 * @return {Promise}
 */
function resetSpecialities () {
    return new Promise((resolve, reject) => {
        let nbSpeInserted = 0;

        for (const speciality of defaultSpecialities) {
            const newSpe = new Speciality({ name: speciality.name, url: speciality.url });

            // insert new speciality
            newSpe.save((err) => {
                if (err) {
                    reject(err);
                }
                else {
                    nbSpeInserted++;
                    if (nbSpeInserted >= defaultSpecialities.length) {
                        resolve(true);
                    }
                }
            });
        }
    });
}

module.exports = resetSpecialities;
