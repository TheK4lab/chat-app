const mongoose = require('mongoose');

const { connectionURL } = require('../config');

mongoose.connect(connectionURL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})