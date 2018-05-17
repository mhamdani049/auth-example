module.exports = {
    fileCheckAndDelete: function (file, callback) {
        const fs = require('fs');
        fs.exists(file, (exists) => {
            if (exists) {
                fs.unlink(file, (err) => {
                    if (err) throw err;
                    callback();
                });
            } else {
                callback();
            }
        });
    }
}