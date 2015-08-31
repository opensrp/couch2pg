var common = require('../common');
var expect = common.expect;
var Promise = common.Promise;

var couchiter = require('../../couchiter');

var pgsql = {
  insertIntoColumn: function(x) {
    return '6bc4365c-b874-45' + x + '33-9daf-4554bed1019a';
  }
};

// https://github.com/medic/medic-data/blob/master/data/generic-anc/demos/
// formated to looks like it came from CouchDB _all_docs
// some revs are missing from deeply nested areas, but it should not matter.
var topLevelObjectFixture = JSON.stringify({
  'total_rows': 3,
  'offset': 0,
  'rows': [
    {
      'id': '0abf501d3fbeffaf98bae6c9d6014545',
      'key': '0abf501d3fbeffaf98bae6c9d6014545',
      'value': {
        'rev':'1-196dbfdfd80564b4f765f2f9c63df7c0'
      },
      'doc': {
        'phone': '+2810258186',
        '_id': '0abf501d3fbeffaf98bae6c9d6014545',
        '_rev':'1-196dbfdfd80564b4f765f2f9c63df7c0',
        'name': 'Wayne Witmer',
        'parent': {
          '_id': 'eeb17d6d-5dde-c2c0-7de966dc2dc1dbef',
          'name': 'Rosemist',
          'parent': {
            '_id': 'eeb17d6d-5dde-c2c0-8a899c4fe9db6ba9',
            'name': 'District 1',
            'parent': {
              
            },
            'type': 'district_hospital',
            'contact': {
              'phone': '+2812635438',
              'name': 'Thalia Timmins'
            }
          },
          'type': 'health_center',
          'contact': {
            'phone': '+2810258186',
            'name': 'Wayne Witmer'
          }
        },
        'type': 'person'
      }
    },
    {
      'id': '0abf333c3fbeffaf33bae3c3d6333333',
      'key': '0abf333c3fbeffaf33bae3c3d6333333',
      'value': {
        'rev':'1-196dbfdfd33333b3f363f3f3c33df3c3'
      },
      'doc': {
        'meta': {
          'code': 'P',
          'label': {
            'en': 'Pregnancy Registration LMP'
          }
        },
        'fields': {
          'last_menstrual_period': {
            'labels': {
              'tiny': {
                'en': 'LMP'
              },
              'description': {
                'en': 'Weeks since last menstrual period'
              },
              'short': {
                'en': 'Weeks since LMP'
              }
            },
            'position': 0,
            'type': 'integer',
            'length': [1, 2],
            'range': [0, 40],
            'required': true,
            'validations': {},
            'flags': {}
          },
          'patient_name': {
            'labels': {
              'tiny': {
                'en': 'N'
              },
              'description': {
                'en': 'Patient Name'
              },
              'short': {
                'en': 'Name'
              }
            },
            'position': 0,
            'type': 'string',
            'length': [1, 30],
            'required': true
          } 
        },
        'public_form': true,
        'use_sentinel': true
      }
    },
    {
      'id': '0abf777d7fbeffaf77bae7c7d6077775',
      'key': '0abf777d7fbeffaf77bae7c7d6077775',
      'value': {
        'rev':'1-196dbf7fd8077774f767f7f9c7377770'
      },
      'doc': [
        {
          'message': 'P 6 Aurelia Acord',
          'from': '+2856368560',
          'sent_timestamp': '105 days ago at 15:51',
          'meta': {
            'type': 'registration',
            'invalid': false,
            'description': 'Valid LMP Registration'
          }
        },
        {
          'message': 'V {{patient_id}}',
          'from': '+2856368560',
          'sent_timestamp': '14 days ago at 09:57',
          'meta': {
            'type': 'visit',
            'description': 'Visit 1'
          }
        },
      ]
    }
  ]
});

var objectFixtures = [
  {
    'phone': '+2810258186',
    '_id': '0abf501d3fbeffaf98bae6c9d6014545',
    '_rev':'1-196dbfdfd80564b4f765f2f9c63df7c0',
    'name': 'Wayne Witmer',
    'parent': {
      '_id': 'eeb17d6d-5dde-c2c0-7de966dc2dc1dbef',
      'name': 'Rosemist',
      'parent': {
        '_id': 'eeb17d6d-5dde-c2c0-8a899c4fe9db6ba9',
        'name': 'District 1',
        'parent': {
          
        },
        'type': 'district_hospital',
        'contact': {
          'phone': '+2812635438',
          'name': 'Thalia Timmins'
        }
      },
      'type': 'health_center',
      'contact': {
        'phone': '+2810258186',
        'name': 'Wayne Witmer'
      }
    },
    'type': 'person',
  },
  {
    'meta': {
      'code': 'P',
      'label': {
        'en': 'Pregnancy Registration LMP'
      }
    },
    'fields': {
      'last_menstrual_period': {
        'labels': {
          'tiny': {
            'en': 'LMP'
          },
          'description': {
            'en': 'Weeks since last menstrual period'
          },
          'short': {
            'en': 'Weeks since LMP'
          }
        },
        'position': 0,
        'type': 'integer',
        'length': [1, 2],
        'range': [0, 40],
        'required': true,
        'validations': {},
        'flags': {}
      },
      'patient_name': {
        'labels': {
          'tiny': {
            'en': 'N'
          },
          'description': {
            'en': 'Patient Name'
          },
          'short': {
            'en': 'Name'
          }
        },
        'position': 0,
        'type': 'string',
        'length': [1, 30],
        'required': true
      } 
    },
    'public_form': true,
    'use_sentinel': true
  },
  [{
    'message': 'P 6 Aurelia Acord',
    'from': '+2856368560',
    'sent_timestamp': '105 days ago at 15:51',
    'meta': {
      'type': 'registration',
      'invalid': false,
      'description': 'Valid LMP Registration'
    }
  },
  {
    'message': 'V {{patient_id}}',
    'from': '+2856368560',
    'sent_timestamp': '14 days ago at 09:57',
    'meta': {
      'type': 'visit',
      'description': 'Visit 1'
    }
  }]
];

describe('iterator of couchdb data', function() {

  describe('extractFromCouchDump()', function() {

    it('breaks apart each top-level object', function() {
      var efcdPromise = couchiter.extractFromCouchDump(topLevelObjectFixture);
      return expect(efcdPromise).to.eventually.deep.equal(objectFixtures);
    });

  });

  describe('insertListToPG()', function() {
    var db;
    var promise;
    var submitted;

    before(function(done) {
      submitted = '';
      db = {'query': function(sql) {
        submitted = submitted + sql.toString();
        // accept anything passed
        return new Promise(function (resolve) {
          resolve();
        });
      }};

      promise = couchiter.insertListToPG(db, pgsql, objectFixtures);
      promise.finally(function () {
        // execute tests only after the promise has completed one way
        // or the other.
        done();
      });
    });

    it('calls db.query to INSERT each object', function() {
      var counter = 0;
      objectFixtures.forEach(function (thisFixture) {
        if (submitted.indexOf(pgsql.insertIntoColumn(JSON.stringify(thisFixture))) >= 0) {
          counter = counter + 1;
        }
      });
      return expect(counter).to.equal(objectFixtures.length);
    });

    /* No known materialized views yet
    it('refreshes all known materialized views', function() {
      return expect(false).to.be.true;
    });
    */

    // TODO what behavior should occur if db.query fails?

  });

});