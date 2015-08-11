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
  
  after(function(done) {
  
    rimraf(HOME, done);
     
  });
  
  it( "get non-existent blob should fail", function(done) {
    lbs.get( "abc", function(err, buf) {
      assert.equal(null, buf);
      done();
    });
    
  });

  it( "put blob should succeed", function(done) {

    lbs.put( path.join( __dirname, "test.js" ), function(h) {
      assert.notEqual(null, h);
      done(); 
    });

  });

  it( "store existing blob should succeed", function(done) {
    
    lbs.put( path.join( __dirname, "test.js" ), function(h) {
      assert.notEqual(null, h);
      done(); 
    });
    
  });

  it( "get blob should succeed", function(done) {
        
    lbs.put(path.join(__dirname, "../package.json" ), function(h) {
      
      assert.notEqual(null, h);
      
      lbs.get(h, function(err, buf) {
        assert.notEqual(null, buf);
      });
    
    });

    done();
    
  });
  
});
