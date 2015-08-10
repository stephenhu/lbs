var crypto      = require("crypto");
var fs          = require("fs");
var mkdirp      = require("mkdirp");
var path        = require("path");

var Umzug       = require("umzug");

var models      = require("../models");

var home        = "./blobs";

//
// findBlob
//
function findBlob(h, next) {
  
  models.Blob
    .findOne({
      where: { key: h }
    }).then(function(blob) {
      next(blob);
    });
  
} // findBlob


//
// generateToken
//
function generateToken() {

  return crypto.randomBytes(8).toString("hex");

} // generateToken


//
// generateHash
//
function generateHash(file, next) {
     
  fs.readFile(file, function(err, buf) {
    
    if(err) {
      console.log(err);
    }
    else {
      
      var cryptolib = crypto.createHmac( "sha512", "" );
      var hash = cryptolib.update(buf.toString()).digest("hex");
      
      next(null, hash.substring(0,16));
    
    }
  
  });
    
} // generateHash


//
// getMigrations
//
function getMigrations(dir) {
  
  var migrations = [];
  
  fs.readdirSync(dir)
    .filter(function(file) {
      if(file.slice(-3) === ".js") {
        migrations.push(file);
      }
    });
    
  return migrations;

} // getMigrations


//
// migrate
//
function migrate(home) {

  var dir = path.join(__dirname, "../migrations");
  
  var umzug = new Umzug({
    migrations: {
      params: [ models.sequelize.getQueryInterface(), models.Sequelize ],
      path: dir
    },
    storage: "sequelize",
    storageOptions: {
      sequelize: models.sequelize
    },
    logging: console.log
  });
  
  umzug.execute({
    migrations: getMigrations(dir),
    method: "up"
  }).then(function(migrations) {
    console.log(migrations);
  });
  
} // migrate


//
// init
//
exports.init = function(home, next) {

  mkdirp(home, function(err) {

    if(err) {
      console.log(err);
    }
    else {
      migrate();
    }
    
  });
  
} // init


//
// delete
//
exports.delete = function(key, next) {
  
} // delete


//
// get
//
exports.get = function(key, next) {

  if(key.length < 1) {
    new Error("Invalid blob key.");
  }
  
  findBlob(key, function(b) {
    
    var dir   = path.join(HOME, key.substring(0,2));
    var file  = path.join(dir, key);
    
    fs.readFile(file, function(err, buf) {
      next(err,buf);
    });

  });
  
} // get


//
// put
//
exports.put = function(file, next) {

  generateHash(file, function(err, hash) {

    if(err) {
      next(err);
    }
    else {
      //var meta = fs.stat(file);
      
      models.Blob.findOrCreate({
        where: {key: hash},
        defaults: {
          filename: file,
          token: generateToken()
        }
      }).then(function(blob) {

        fs.readFile(file, function(err, buf) {
  
          var dir     = path.join(HOME, hash.substring(0,2));
          var f       = path.join(dir, hash);
          
          mkdirp(dir, function(err) {
            
            if(err === null) {
              
              fs.writeFile(f, buf, function(err) {
                
                if(err) {
                  next(err);
                }
                else {
                  console.log(f + " stored successfully.");
                }
                
              });
              
            }
            else {
              next(err);
            }
            
          });
            
        });
    
      });
      
    }
  
  });
  
} // put
