'use strict';
var express = require('express'),
    app = express(),
    gcloud = require('gcloud'),
    bodyParser = require('body-parser'),
    mozjpeg = require('mozjpeg'),
    sharp = require('sharp'),
    Child_Process = require('duplex-child-process'),
    gcs = gcloud.storage({
        keyFilename: './CloudDicom-2467d1aee1c2.json',
        projectId: 'axiomatic-math-616'
    }),
    serverAddr = 'https://dicomwebpacs-tetraib-1.c9.io';
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.status('200').send('Running smoothly...');
});

app.post('/v1/images/', function(req, res) {
    console.log('New body : ', req.body);
    res.status('201').json({
        'Location': serverAddr + '/v1/images/' + req.body.SOPInstanceUID + '/'
    });

});

app.put('/v1/images/:Uid/', function(req, res) {
    var gcsbucket = gcs.bucket('dicom'),
        remoteWriteStream = gcsbucket.file(req.params.Uid + '.jpg').createWriteStream(),
        // Make a standard image
        remoteWriteStream2 = gcsbucket.file(req.params.Uid + '.std.jpg').createWriteStream(),
        resizeStandard = sharp()
        .sharpen()
        .withoutEnlargement()
        .resize(null, 1080)
        .on('error', function(err) {
            console.log('sharp', err);
        }),
        cjpeg = Child_Process.spawn(mozjpeg, ['-progressive', '-optimize', '-quality', '80']);
    cjpeg.on('error', function(err) {
        console.log('cjpeg', err);
    });
    remoteWriteStream.on('finish', function() {
        res.status('200').end();
        console.log('file uploaded');
    });
    remoteWriteStream2.on('finish', function() {
        console.log('file low uploaded');
    });
    remoteWriteStream.on('error', function(err) {
        console.log('remoteWriteStream', err);
    });
    remoteWriteStream2.on('error', function(err) {
        console.log('remoteWriteStream2', err);
    });
    req.pipe(resizeStandard).pipe(cjpeg).pipe(remoteWriteStream2);
    req.pipe(remoteWriteStream);
});

app.get('/v1/images/:Uid/', function(req, res) {
    var gcsbucket = gcs.bucket('dicom'),
        remoteReadStream = gcsbucket.file(req.params.Uid + '.jpg').createReadStream();

    remoteReadStream.on('error', function(err) {
        console.log('remoteReadStream', err);
    });
    // Activate browser cache
    res.set({
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31557600'
    });
    remoteReadStream.pipe(res);

});

app.get('/v1/images/:Uid/std', function(req, res) {
    var gcsbucket = gcs.bucket('dicom'),
        remoteReadStream = gcsbucket.file(req.params.Uid + '.std.jpg').createReadStream();

    remoteReadStream.on('error', function(err) {
        console.log('remoteReadStream', err);
    });
    // Activate browser cache
    res.set({
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31557600'
    });
    remoteReadStream.pipe(res);

});
console.log("SERVER STARTED...");
console.log('CI', process.env.CI);
console.log('TRAVIS', process.env.TRAVIS);
var test = process.env.CI;

if (process.env.CI === test) {
    console.log("IN CI...");
    app.listen(8080);
}
else {
    console.log("NOT IN CI...");
    app.listen(process.env.PORT, process.env.IP);
}
