var crypto      = require("crypto");
var fs          = require("fs");
var mkdirp      = require("mkdirp");
var path        = require("path");

var Umzug       = require("umzug");

var models      = require("../models");

var HOME        = "./blobs";

//
// findBlob
//
function findBlob(h, app, token, next) {
  
  models.Blob
    .findOne({
      where: { key: h, application: app, token: token }
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
      
      var cryptolib = crypto.createHmac("sha512", "");
      var hash = cryptolib.update(buf.toString()).digest("hex");
      
      next(null, hash.substring(0, 32));
    
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
function migrate(next) {

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
    next();
  });
  
} // migrate



//
// store
//
function store(file, blob, next) {

  console.log(blob.key);
  
  fs.readFile(file, function(err, buf) {

    var dir     = path.join(HOME, blob.key.substring(0,2));
    var f       = path.join(dir, blob.key);
    
    mkdirp(dir, function(err) {
      
      if(err) {
        next(err, null);
      }
      else {

        fs.writeFile(f, buf, function(err) {
          
          if(err) {
            console.log(err);
            next(err, null);
          }
          else {
            console.log(f + " stored successfully.");
            next(null, blob);
          }
          
        });
        
      }
      
    });
      
  });
  
} // store


exports.init = function(next) {

  mkdirp(HOME, function(err) {
    migrate(next);
  });
  
} // init


//
// init
//
exports.init = function(next) {

  mkdirp(HOME, function(err) {
    migrate(next);
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
exports.get = function(key, app, token, next) {

  if(key.length < 1) {
    next(new Error("Invalid blob key."), null);
  }
  
  if(token === null || token === "") {
    next(new Error("Invalid token."), null);
  }

  findBlob(key, app, token, function(b) {

    if(b) {
      
      var dir   = path.join(HOME, b.dataValues.key.substring(0,2));
      var file  = path.join(dir, b.dataValues.key);

      fs.readFile(file, function(err, buf) {
        next(err, buf);
      });

    }
    else {
      next(new Error("Blob does not exist."), null);
    }

  });
  
} // get


//
// put
//
exports.put = function(file, app, next) {
  
  generateHash(file, function(err, hash) {

    if(err) {
      console.log(err);
      next(err, null);
    }
    else {
      
      fs.stat(file, function(err, stats) {
        
        var size      = 0;
        var token     = generateToken();
        var appName   = "";
        
        size = stats.size;
        
        if(app) {
          appName = app;
        }
        else {
          appName = "pool";
        }
    
        models.Blob.findOrCreate({
          where: {key: hash, application: appName},
          defaults: {
            filename: path.basename(file),
            extension: path.extname(file),
            application: appName,
            bytes: size,
            token: token
          }
        }).then(function(blob) {
  
          if(blob[1]) {
  
            store(file, blob[0].dataValues, function(err, res) {
  
              if(err) {
                next(err, null);
              }
              else {
                next(null,blob[0].dataValues);
              }
              
            });        
  
          }
          else {
            next(null,blob[0].dataValues);
          }
      
        }); // then
        
      }); // fs.stats
      
    }
  
  }); // generateHash
  
} // put
