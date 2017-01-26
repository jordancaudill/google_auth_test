(function() {
    var mongoose = typeof require !== 'undefined' ? require('mongoose') : window.mongoose;
    var Schema = mongoose.Schema;

    var userSchema = new Schema({
        'email': {
            type: String,
            required: [true, 'Required']
        },
        'password': {
            type: String,
            required: [true, 'Required']
        },
        'firstName': {
            type: String,
            required: [true, 'Required']
        },
        'lastName': {
            type: String,
            required: [true, 'Required']
        },
        'accessToken': String,
        'refreshToken': String,
        'accessTokenExpires': Number,
        'refreshTokenExpires': Number,
    });

    module.exports = mongoose.model('user', userSchema);
})();
