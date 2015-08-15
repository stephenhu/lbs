# local blobstore (lbs)
simple blobstore that leverages the local file system to store blobs.  lbs is
written in nodejs and leverages sqlite3 for metadata.  lbs is meant as a library
within your nodejs application, not for individual users.

## design
all blobs are stored to the _blobs_ directory of the current working directory, the
sqlite3 index is stored at `blobs/.lbs`.

### blob keys
keys are based on a sha512 hash of the file contents and uses only the first 32
hexadecimal characters from the hash, this keeps keys short in case they're used
in urls.

### security
lbs leverages a very simple security mechanism, a random token is generated for each
blob that is 8 hexadecimal characters long.  the token does not expire, though
theoretically could be updated.

### api
1. init - initializes blob store
1. put - store blob onto filesystem returning the actual sqlite3 record
1. get - retrieve blob in buffer format, needs to be converted to string

## requirements
1. node 0.4.12
1. npm
1. sqlite3

## installation
1.  `npm install lbs`

## development
1.  `git clone git@github.com:stephenhu/lbs`
1.  `npm install`
1.  `mocha`

## usage

```javascript
var lbs = require("lbs");

lbs.init(function(done) {
});

lbs.put("path/to/file", "appname", function(err, res) {
  
  console.log(res);
  
  lbs.get(res.key, res.application, res.token, function(err, buf) {
    console.log(buf);
  });
  
});
```

### outputs
```javascript
{ id: "",
  key: "",
  filename: "",
  extension: "",
  bytes: 0,
  token: "",
  application: "",
  dirty: false,
  version: 0,
  properties: "",
  createdAt: "",
  updatedAt: ""
}

// TODO: get sample output from lbs.get
```


## faq
