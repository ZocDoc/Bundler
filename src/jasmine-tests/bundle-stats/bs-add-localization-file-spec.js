var exec = require('child_process').exec,
      fs = require('fs'),
      bundleStats = require('../../bundle-stats.js');

describe("BundleStatsCollector - Adds localized strings to the localizedStrings collection: ", function() {

    var validateBundle,
        getLocalizedString = function(ls) {
            return '{{# i18n }}' + ls+ '{{/ i18n }}';
        },
        getMultiLineLocalizedString = function(ls) {
            return getLocalizedString('\n' + ls + '\n');
        },
        bundle1 = 'bundle1',
        string1 = 'A localized string',
        ls1 = getLocalizedString(string1),
        bundle2 = 'bundle2',
        string2 = 'A different string.',
        ls2 = getLocalizedString(string2),
        bundle3 = 'bundle3',
        string3 = 'A third string.',
        ls3 = getLocalizedString(string3),
        stats;

  beforeEach(function () {

      stats = new bundleStats.BundleStatsCollector(null);
      stats.LocalizedStrings = {};
      validateBundle = function(bundleName, localizedStrings)
      {
          expect(stats.LocalizedStrings[bundleName].length).toBe(localizedStrings.length);

          for(var i=0; i<localizedStrings.length; i++) {
              expect(stats.LocalizedStrings[bundleName][i]).toBe(localizedStrings[i]);
          }
      };
  });

  it("Adds files to the collection.", function() {

      stats.AddLocalizedString(bundle1, ls1);

      validateBundle(bundle1, [ string1 ]);

      stats.AddLocalizedString(bundle1, ls2);

      validateBundle(bundle1, [ string1, string2 ]);

      stats.AddLocalizedString(bundle1, ls3);

      validateBundle(bundle1, [ string1, string2, string3 ]);
  });

    it("Text with multiple localized strings adds them all.", function() {

        stats.AddLocalizedString(bundle1, ls1 + ls2 + ls3);
        validateBundle(bundle1, [ string1, string2, string3 ]);
    });

    it("Adds localized strings defined across multiple lines.", function() {

        stats.AddLocalizedString(bundle1, getMultiLineLocalizedString(string1));
        validateBundle(bundle1, [ string1 ]);
    });

    it("Clearing a bundle removes all LocalizedStrings.", function() {

        stats.AddLocalizedString(bundle1, ls1);
        stats.AddLocalizedString(bundle1, ls2);

        validateBundle(bundle1, [ string1, string2 ]);

        stats.ClearLocalizedStrings(bundle1);

        validateBundle(bundle1, [ ]);
    });


    it("Duplicate LocalizedStrings are not added.", function() {

        stats.AddLocalizedString(bundle1, ls1);

        validateBundle(bundle1, [ string1 ]);

        stats.AddLocalizedString(bundle1, ls1);

        validateBundle(bundle1, [ string1 ]);

        stats.AddLocalizedString(bundle1, ls1);

        validateBundle(bundle1, [ string1 ]);
    });


    it("LocalizedStrings added are isolated to their collection.", function() {

        stats.AddLocalizedString(bundle1, ls1);
        stats.AddLocalizedString(bundle2, ls2);
        stats.AddLocalizedString(bundle3, ls3);

        validateBundle(bundle1, [ string1 ]);
        validateBundle(bundle2, [ string2 ]);
        validateBundle(bundle3, [ string3 ]);
    });

});