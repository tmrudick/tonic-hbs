var path = require('path');

module.exports = {
    init: function(tonic) {
        tonic.jobs(path.join(__dirname, 'jobs.js'));
    }
};