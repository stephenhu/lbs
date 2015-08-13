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
   
    lbs.get( "abc", "myapp", "abc", function(err, buf) {
      assert.equal(null, buf);
      done();
    });
    
  });

  it( "put blob should succeed", function(done) {

    lbs.put(path.join(__dirname, "test.js"), "myapp", function(err, h) {
      assert.notEqual(null, h);
      done();
    });

  });

  it( "store existing blob should succeed", function(done) {
    
    lbs.put(path.join(__dirname, "test.js"), "myapp", function(err, h) {
      assert.notEqual(null, h);
      done();
    });
    
  });

  it( "get blob should succeed", function(done) {
        
    lbs.put(path.join(__dirname, "../package.json" ), "myapp", function(err, res) {
      
      if(err) {
        done(err);
      }
      else {
        
        assert.notEqual(null, res);
                
        lbs.get(res[0], "myapp", res[1], function(err, buf) {
          assert.notEqual(null, buf);
          done();
        });
                
      }
    
    });
    
  });
  
});
