'use strict';

const express = require('express');
var cp = require('child_process');
const ecstatic = require('ecstatic');
const fileUpload = require('express-fileupload');
const http = require('http');

const app = express();

app.use(ecstatic({
  root: `${__dirname}/public`,
  showdir: true,
}));

app.use(fileUpload({
	createParentPath: true,
    useTempFiles : true,
    safeFileNames: true,
    tempFileDir : __dirname+'/tmp'
}));

app.post('/upload', function(req, res) {
    let sampleFile;
    let uploadPath;
    if (Object.keys(req.files).length === 0) {
        res.status(400).send('No files were uploaded.');
        return;
    }
    console.log('req.files >>>', req.files); // eslint-disable-line
    for(var file in req.files) {
        console.log(file);
        sampleFile = req.files[file];
        uploadPath = __dirname + '/uploads/' + file;
        sampleFile.mv(uploadPath, function (err) {
            if (err) {
                return res.status(500).send(err);
            }
        });
    }
    process.nextTick(function(){
        var ls = cp.spawn('bash',[__dirname+'/lcov.sh'],[]);
        ls.stdout.on('data', function (data) {
            console.log('stdout: ' + data);
        });

        ls.stderr.on('data', function (data) {
            console.log('stderr: ' + data);
        });

        ls.on('exit', function (code) {
            console.log('child process exited with code ' + code);
        });

        ls.on('error', function (error) {
            console.log(error);
        });
    });
});

http.createServer(app).listen(8080);

console.log('Listening on :8080');