var express = require('express'),
    app = express(),
    gcloud = require('gcloud'),
    bodyParser = require('body-parser'),
    mozjpeg = require('mozjpeg'),
    sharp = require('sharp'),
    Child_Process = require('duplex-child-process'),
    gcs = gcloud.storage({
        keyFilename: './CloudDicom-1f0d0f461c12.json',
        projectId: 'axiomatic-math-616'
    });
app.use(bodyParser.json());


// Function to make standard image from google cloud storage
var makestdimage = function(fileIn, fileOut, bucket, quality, sharpen, callback) {
    // Define the bucket to use
    var gcsbucket = gcs.bucket(bucket),
        // Resize image
        resizeStandard = sharp()
        .withoutEnlargement()
        .resize(null, 1080)
        .on('error', function(err) {
            callback(err);
        }),
        cjpeg = Child_Process.spawn(mozjpeg, ['-progressive', '-optimize', '-quality', quality]),
        // Read from gcs file
        remoteReadStream = gcsbucket.file(fileIn).createReadStream(),
        // Write to gcs file
        remoteWriteStream = gcsbucket.file(fileOut).createWriteStream();
    // Apply sharpen if asked
    if (sharpen) {
        resizeStandard.sharpen();
    }
    // Pipe image
    remoteReadStream.pipe(resizeStandard).pipe(cjpeg).pipe(remoteWriteStream);

    // Error management
    remoteWriteStream.on('finish', function() {
        callback(null);
    });
    cjpeg.on('error', function(err) {
        callback(err);
    });
    remoteReadStream.on('error', function(err) {
        callback(err);
    });
    remoteWriteStream.on('error', function(err) {
        callback(err);
    });
};

// makestdimage('1.2.392.200036.9107.500.305.0.20150811.102846.281.100_90.jpg', 'test.jpg', 'dicom', '80', false, function(err) {
//     if (err) {
//         console.log(err);
//     }
//     else {
//         console.log("ok");
//     }
// });



// 
app.post('/v1/images/', function(req, res) {
    console.log('New body : ', req.body);
    res.status('201').end();

});

app.put('/v1/images/:Uid/', function(req, res) {
    var gcsbucket = gcs.bucket('dicom'),
        remoteWriteStream = gcsbucket.file('test4.jpg').createWriteStream();

    remoteWriteStream.on('finish', function() {
        res.status('200').end();
        console.log('file uploaded');
    });

    req.pipe(remoteWriteStream);
});
app.listen(process.env.PORT, process.env.IP);