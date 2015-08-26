var express = require('express');
var app = express();
app.get('/api/', function(req, res){
  res.send('hello world');
});

app.listen(process.env.PORT, process.env.IP);