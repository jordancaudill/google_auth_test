(function() {
    var mongoose = typeof require !== 'undefined' ? require('mongoose') : window.mongoose;
    var Schema = mongoose.Schema;

    var logSchema = new Schema({
        'url': String,
        'date': Number,
        'method': String,
        'path': String
    });

    module.exports = mongoose.model('logs', logSchema);
})();
