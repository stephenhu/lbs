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
    done();
  });
  
  it( "get non-existent blob should fail", function(done) {
   
    lbs.get( "abc", "myapp", "abc", function(err, buf) {
      assert.equal(null, buf);
      done();
    });
    
  });

  it( "put blob should succeed", function(done) {

    lbs.put(path.join(__dirname, "test.js"), "myapp", function(err, res) {
      assert.notEqual(null, res);
      console.log(res);
      done();
    });

  });

  it( "put existing blob should succeed", function(done) {
    
    lbs.put(path.join(__dirname, "test.js"), "myapp", function(err, res) {
      assert.notEqual(null, res);
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
                
        lbs.get(res.key, "myapp", res.token, function(err, buf) {
          assert.notEqual(null, buf);
        });
        
        done();        
      }
    
    });
    
  });
  
  it( "get blob with invalid token should fail", function(done) {
        
    lbs.put(path.join(__dirname, "../package.json" ), "myapp", function(err, res) {
      
      if(err) {
        done(err);
      }
      else {
        
        assert.notEqual(null, res);
                
        lbs.get(res.key, "myapp", "invalid", function(err, buf) {
          assert.notEqual(null, err);
        });
        
        done();   
      }
    
    });
    
  });

  it( "put same blob with different app", function(done) {
        
    lbs.put(path.join(__dirname, "../package.json" ), "myapp2", function(err, res) {
      
      if(err) {
        done(err);
      }
      else {
        
        assert.notEqual(null, res);
                
        lbs.get(res.key, "myapp2", res.token, function(err, buf) {
          assert.notEqual(null, buf);
        });
        
        done();
                
      }
    
    });
    
  });

  it( "store same blob with same app should not overwrite token", function(done) {
        
    lbs.put(path.join(__dirname, "../package.json" ), "myapp2", function(err, res) {
      
      if(err) {
        done(err);
      }
      else {
        
        var token = res.token;

        assert.notEqual(null, res);
                
        lbs.put(path.join(__dirname, "../package.json"), "myapp2", function(err, res2) {
          assert.notEqual(null, res2);
          asert.equal(token, res2.token);
        });
        
        done();
                
      }
    
    });
    
  });
   
});
