var fs = require('fs');

// Constructor
var File = function () {
    this.move = function (oldPath, newPath, callback) {
        fs.rename(oldPath, newPath, function (err) {
            if (err) {
                if (err.code === 'EXDEV') {
                    copy();
                } else {
                    callback(err);
                }
                return;
            }
            callback();
        });

        function copy() {
            var readStream = fs.createReadStream(oldPath);
            var writeStream = fs.createWriteStream(newPath);

            readStream.on('error', callback);
            writeStream.on('error', callback);
            readStream.on('close', function () {

                fs.unlink(oldPath, callback);
            });

            readStream.pipe(writeStream);

        }
    };

    this.createDummy = function (name, content, callback) {
        fs.writeFile(name, content, function (err) {
            if (err) {
                console.error("Error creating file");
            }
            callback();
        });
    }
};

module.exports = File;
