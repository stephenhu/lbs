// mocha tests

var lbs   = require("../lib/lbs");

var mkdirp = require("mkdirp");
var path   = require("path");
var rimraf = require("rimraf");

var assert  = require("assert"),
    request = require("supertest");

var HOME = "blobs";

describe( "lbs", function() {

  before(function(done) {
    lbs.init(done);
  });
  
  /*
  after(function() {
  
    rimraf(HOME, function(err) {
      
      if(err) {
        console.log(err);
        console.log("Unable to remove testing directory.");
      }
      else {
        console.log(".tests/blobs deleted.");
      }
      
    });
     
  });
  */
  
  it( "get non-existent blob should fail", function(done) {
    lbs.get( "abc", function(err, buf) {
      assert.equal(null, buf);
      done();
    });
    
  });

  it( "put blob should succeed", function(done) {

    lbs.put( path.join( __dirname, "test.js" ), done );

  });

  it( "get blob should succeed", function() {  
  });
  
});
