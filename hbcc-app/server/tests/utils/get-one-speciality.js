const Speciality = require('../../mongoose/model/speciality.model');

function getOneSpeciality() {
    return new Promise((resolve) => {
        Speciality.find({}, (speErr, specialities) => {
            if (specialities.length > 0) {
                resolve(specialities[0]);
            }
            else {
                throw Error('Error for get one speciality');
            }
        });
    });
}

module.exports = getOneSpeciality;
