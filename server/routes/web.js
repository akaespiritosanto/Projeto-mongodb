var express = require('express'),
    router = express.Router(),
    path = require('path'),
    fs = require('fs');

var appHtmlPath = path.resolve(__dirname, '../../app/app.html');

if (!fs.existsSync(appHtmlPath)) {
    console.error('ERROR: app.html not found at:', appHtmlPath);
    console.error('Current __dirname:', __dirname);
} else {
    console.log('✓ app.html found at:', appHtmlPath);
}

router.get('*', function(req, res, next) {
    if (req.path.startsWith('/api')) {
        return next();
    }
    
    if (req.path.startsWith('/node_modules')) {
        return next();
    }
    
    if (req.path.match(/\.(js|css|html|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|map)$/)) {
        return next();
    }
    
    if (req.path.startsWith('/assets')) {
        return next();
    }
    
    res.sendFile(appHtmlPath, function(err) {
        if (err) {
            console.error('Error sending app.html:', err);
            res.status(500).send('Error loading application: ' + err.message);
        }
    });
});

module.exports = router;

