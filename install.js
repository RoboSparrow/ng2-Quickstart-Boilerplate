#! /usr/bin/env node

var rl = require('readline');
var fs = require('fs');
var exec = require('child_process').exec;

var prompts = rl.createInterface(process.stdin, process.stdout);

// abort if node_modules exists already
try {
    fs.accessSync('./node_modules', fs.F_OK);
    console.log('\x1b[31m\x1b[1mAbort: Folder "node_modules" exists.\x1b[0m This app has been installed before.');
    process.exit();
} catch (e) {
    // GOOD!
}

// read package.json
try{
    var package = require('./package.json');
}catch(e){
    console.log('\x1b[31m\x1b[1mError\x1b[0m reading package.json');
    console.log(e);
    process.exit();
}

console.log('\x1b[33mPrepare your NPM package.\x1b[0m');
console.log('------------------------ ');

// package name
prompts.question('\x1b[33m[package.json] \x1b[0mPlease name your project (current: ' + package.name + '): ', function (projectName) {
    projectName = projectName || package.name;
    package.name = projectName;

    // package version
    prompts.question('\x1b[33m[package.json] \x1b[0mVersion (semver valid - current: ' + package.version + '): ', function (projectVersion) {
        projectVersion = projectVersion || '0.0.1';
        package.version = projectVersion;

        // package license
        prompts.question('\x1b[33m[package.json] \x1b[0mLicense (current: ' + package.license + '): ', function (projectLicense) {
            projectLicense  = projectLicense || 'MIT';
            package.license = projectLicense;

            //all done. save and exit
            savePackageJson(package);
            console.log('--------------------');
            console.log('Now run: npm install');
            console.log('--------------------');
            process.exit();
        });

    });
});

function savePackageJson(package, callback){
    try{
        var contents = fs.writeFileSync('./package.json', JSON.stringify(package, null, 4), 'utf-8');
        console.log('\x1b[32mSuccess:\x1b[0m package.json updated');
    }catch(e){
        console.log('\x1b[31m\x1b[1mError:\x1b[0m writing package.json');
        console.log(e);
        process.exit();
    }

}
