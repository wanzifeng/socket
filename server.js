var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.header("Content-Type", "text/html");
    res.sendFile( __dirname + "/public/" + "index.html" );
});
app.listen(8000);
