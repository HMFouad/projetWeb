const mongoose = require('mongoose');

module.exports = (closure) => {
    return mongoose.connect('mongodb://hmfouad:hbcc2017@ds145230.mlab.com:45230/hbcc_db', (err, db) => {
        if (err) return console.log(err);

        closure(db);
    });
};