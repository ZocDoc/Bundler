var bundlefiles = require('../../src/bundle-files.js');

Array.prototype.contains = function (item) {
    return this.indexOf(item) !== -1;
};

Array.prototype.printAll = function () {
    this.forEach(function (f) { console.log(f) });
}

describe("BundleFiles.", function () {

    var files,
        fileSet1 = [
            "/tests/test1/test1.js.bundle",
            "/tests/test1/file.js",
            "/tests/test1/file.mustache",
            "/tests/test1/file.json",
            "/tests/test1/file.min.js",
            "/tests/test1/file.txt",
            "/tests/test1/file.css",
            "/tests/test1/file.less",
            "/tests/test2/file.css",
            "/tests/test2/test2.css.bundle",
            "/tests/test2/file.less",
            "/tests/test2/file.min.css",
            "/tests/test2/file.js",
            "/tests/test2/file.txt"
        ],
        fileSet2 = [
            "/tests/test3/test3.css.bundle",
            "/tests/test3/file.css",
            "/tests/test4/test4.js.bundle",
            "/tests/test4/file.js"
        ],
        fileSet3 = [
            "/casing/Tests/File.js",
            "/casing/Tests/File.css"
        ],
        jsBundle = "/tests/test5/test5.js.bundle",
        jsFile = "/tests/test5/file.mustache",
        jsonFile = "/tests/test5/file.json",
        cssBundle = "/tests/test6/test6.css.bundle",
        cssFile = "/tests/test6/file.css";

  beforeEach(function () {

      files = new bundlefiles.BundleFiles();

      //add a couple sets
      files.addFiles(fileSet1);
      files.addFiles(fileSet2);
      files.addFiles(fileSet3);

      //add some individually
      files.addFiles(jsBundle);
      files.addFiles(cssBundle);
      files.addFile(jsFile);
      files.addFile(jsonFile);
      files.addFile(cssFile);

      files.Index();
  });

  describe("getBundles: ", function () {

      it("Gets all javascript bundles", function () {

          var jsBundles = files.getBundles(bundlefiles.BundleType.Javascript);

          expect(jsBundles.length).toBe(3);
          expect(jsBundles.contains("/tests/test1/test1.js.bundle")).toBe(true);
          expect(jsBundles.contains("/tests/test4/test4.js.bundle")).toBe(true);
          expect(jsBundles.contains("/tests/test5/test5.js.bundle")).toBe(true);
      });

      it("Gets all css bundles", function () {

          var jsBundles = files.getBundles(bundlefiles.BundleType.Css);

          expect(jsBundles.length).toBe(3);
          expect(jsBundles.contains("/tests/test2/test2.css.bundle")).toBe(true);
          expect(jsBundles.contains("/tests/test3/test3.css.bundle")).toBe(true);
          expect(jsBundles.contains("/tests/test6/test6.css.bundle")).toBe(true);
      });
  });

  describe("getFilesInDirectory: - Javascript: ", function () {

      it("Gets only .js file types", function () {

          var jsFilesInDir = files.getFilesInDirectory(bundlefiles.BundleType.Javascript,
                                  "/tests/test1",
                                  "",
                                  {}
                              );

          expect(jsFilesInDir.length).toBe(3);
          expect(jsFilesInDir.contains("/file.js")).toBe(true);
          expect(jsFilesInDir.contains("/file.mustache")).toBe(true);
          expect(jsFilesInDir.contains("/file.json")).toBe(true);
      });

      it("Gets only .js and .min.js file types given webpack bundle", function () {

          var jsFilesInDir = files.getFilesInDirectory(bundlefiles.BundleType.Javascript,
              "/tests/test1",
              "",
              { webpack: true }
          );

          expect(jsFilesInDir.length).toBe(4);
          expect(jsFilesInDir.contains("/file.js")).toBe(true);
          expect(jsFilesInDir.contains("/file.min.js")).toBe(true);
          expect(jsFilesInDir.contains("/file.mustache")).toBe(true);
          expect(jsFilesInDir.contains("/file.json")).toBe(true);
      });

      it("Prepends the current directory", function () {

          var jsFilesInDir = files.getFilesInDirectory(bundlefiles.BundleType.Javascript,
                                  "/tests/test1",
                                  "/test1",
                                  {}
                              );

          expect(jsFilesInDir.length).toBe(3);
          expect(jsFilesInDir.contains("/test1/file.js")).toBe(true);
          expect(jsFilesInDir.contains("/test1/file.mustache")).toBe(true);
          expect(jsFilesInDir.contains("/test1/file.json")).toBe(true);
      });

      it("Searches all sub-directories", function () {

          var jsFilesInDir = files.getFilesInDirectory(bundlefiles.BundleType.Javascript,
                                  "/tests",
                                  "",
                                  {}
                              );

          expect(jsFilesInDir.length).toBe(7);
          expect(jsFilesInDir.contains("/test1/file.js")).toBe(true);
          expect(jsFilesInDir.contains("/test4/file.js")).toBe(true);
          expect(jsFilesInDir.contains("/test5/file.mustache")).toBe(true);
          expect(jsFilesInDir.contains("/test5/file.json")).toBe(true);
      });

      it("Doesnt double add /", function () {

          var jsFilesInDir = files.getFilesInDirectory(bundlefiles.BundleType.Javascript,
                                  "/tests/test5/",
                                  "test5/",
                                  {}
                              );

          expect(jsFilesInDir.length).toBe(2);
          expect(jsFilesInDir.contains("test5/file.mustache")).toBe(true);
          expect(jsFilesInDir.contains("test5/file.json")).toBe(true);
      });


      it("Ignores Case", function () {

          var jsFilesInDir = files.getFilesInDirectory(bundlefiles.BundleType.Javascript,
                                  "/casing/tests",
                                  "output/",
                                  {}
                              );

          expect(jsFilesInDir.length).toBe(1);
          expect(jsFilesInDir.contains("output/File.js")).toBe(true);
      });

      it("Ignores trailing slash", function () {

          var jsFilesInDir = files.getFilesInDirectory(bundlefiles.BundleType.Javascript,
                                  "/casing/tests/",
                                  "output",
                                  {}
                              );

          expect(jsFilesInDir.length).toBe(1);
          expect(jsFilesInDir.contains("output/File.js")).toBe(true);
      });

      it("Throws if no files found for directory", function () {

          var shouldThrow = function () {
              files.getFilesInDirectory(bundlefiles.BundleType.Javascript,
                                      "/not_a_valid_directory",
                                      "output",
                                      {}
                                  );
          };

          expect(shouldThrow).toThrow();
      });
  });

  describe("getFilesInDirectory: - Css: ", function () {

      it("Gets only .css file types", function () {

          var cssFilesInDir = files.getFilesInDirectory(bundlefiles.BundleType.Css,
                                  "/tests/test2",
                                  "",
                                  {}
                              );

          expect(cssFilesInDir.length).toBe(2);
          expect(cssFilesInDir.contains("/file.css")).toBe(true);
          expect(cssFilesInDir.contains("/file.less")).toBe(true);
      });

      it("Gets only .css and .min.css file types given webpack bundle", function () {

          var cssFilesInDir = files.getFilesInDirectory(bundlefiles.BundleType.Css,
              "/tests/test2",
              "",
              { webpack: true }
          );

          expect(cssFilesInDir.length).toBe(3);
          expect(cssFilesInDir.contains("/file.css")).toBe(true);
          expect(cssFilesInDir.contains("/file.min.css")).toBe(true);
          expect(cssFilesInDir.contains("/file.less")).toBe(true);
      });

      it("Prepends the current directory", function () {

          var cssFilesInDir = files.getFilesInDirectory(bundlefiles.BundleType.Css,
                                  "/tests/test2",
                                  "/test2",
                                  {}
                              );

          expect(cssFilesInDir.length).toBe(2);
          expect(cssFilesInDir.contains("/test2/file.css")).toBe(true);
          expect(cssFilesInDir.contains("/test2/file.less")).toBe(true);
      });

      it("Searches all sub-directories", function () {

          var cssFilesInDir = files.getFilesInDirectory(bundlefiles.BundleType.Css,
                                  "/tests",
                                  "",
                                  {}
                              );

          expect(cssFilesInDir.length).toBe(6);
          expect(cssFilesInDir.contains("/test2/file.css")).toBe(true);
          expect(cssFilesInDir.contains("/test3/file.css")).toBe(true);
          expect(cssFilesInDir.contains("/test6/file.css")).toBe(true);
      });

      it("Doesnt double add /", function () {

          var cssFilesInDir = files.getFilesInDirectory(bundlefiles.BundleType.Css,
                                  "/tests/test3/",
                                  "test3/",
                                  {}
                              );

          expect(cssFilesInDir.length).toBe(1);
          expect(cssFilesInDir.contains("test3/file.css")).toBe(true);
      });

      it("Ignores Case", function () {

          var cssFilesInDir = files.getFilesInDirectory(bundlefiles.BundleType.Css,
                                  "/casing/tests",
                                  "output/",
                                  {}
                              );

          expect(cssFilesInDir.length).toBe(1);
          expect(cssFilesInDir.contains("output/File.css")).toBe(true);
      });

      it("Ignores trailing slash", function () {

          var cssFilesInDir = files.getFilesInDirectory(bundlefiles.BundleType.Css,
                                  "/casing/tests/",
                                  "output",
                                  {}
                              );

          expect(cssFilesInDir.length).toBe(1);
          expect(cssFilesInDir.contains("output/File.css")).toBe(true);
      });

      it("Throws if no files found for directory", function () {

          var shouldThrow = function () {
              files.getFilesInDirectory(bundlefiles.BundleType.Css,
                                      "/not_a_valid_directory",
                                      "output",
                                      {}
                                  );
          };

          expect(shouldThrow).toThrow();
      });
  });
});
