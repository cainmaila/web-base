const path = require('path');
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cors = require('cors');
const https = require('https');
const config = require('../config.json');
const sslOptions = require('./sslLicense.js');
const port = process.env.PORT || config.port || 80;
const app = express();
const server = https.createServer(sslOptions.options, app);

app.use(methodOverride());
app.use(compression());
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', '..', 'web')));

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);
app.use(status404);
server.listen(port, function() {
    console.log('runing Web Server in ' + port + ' port...');
});

/**
 * 錯誤輸出
 */
function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}

/**
 * 500錯誤
 */
function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.status(500).send({
            error: 'Something failed!'
        });
    } else {
        next(err);
    }
}

/**
 * 500錯誤
 */
function errorHandler(err, req, res, next) {
    res.status(500);
    res.render('error', {
        error: err
    });
}

/**
 * 404錯誤
 */
function status404(req, res) {
    res.status(404).send('404 error');
}
