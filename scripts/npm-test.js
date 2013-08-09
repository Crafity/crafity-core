/*jslint node:true, white: true*/
require("../test/package.test.js").on("complete", function () {
  require("../test/crafity.core.test.js").on("complete", function () {
  require("../test/modules/crafity.Dictionary.test.js").on("complete", function () {
  require("../test/modules/crafity.Event.test.js").on("complete", function () {
  require("../test/modules/crafity.Exception.test.js").on("complete", function () {
  require("../test/modules/crafity.List.test.js").on("complete", function () {
    require("../test/modules/crafity.Workerpool.test.js").on("complete", function () {
      require("../test/modules/crafity.common.test.js").on("complete", function () {
        require("../test/modules/crafity.objects.test.js").on("complete", function () {

          require("../test/modules/crafity.strings.test.js");

        });
      });
    });
  });  
  });  
  });  
  });  
  });  
});
