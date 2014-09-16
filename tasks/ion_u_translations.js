/*
 * grunt-ion-u_translations
 * https://github.com/wirsich/grunt-ion-u_translations
 *
 * Copyright (c) 2014 Stephan Wirsich
 * Licensed under the MIT license.
 */

'use strict';
// for langfile in `find $INSTALL_DIR/lang -iname \*.json`; do
//     compile_languagefiles $langfile $LANGUAGE_PORTAL_URL
// done

// compile_languagefiles() {
//     # locale = stuff before the first dot (de_de.json => de_de)
//     local locale=$(basename $1 | sed 's/\(.*\)\..*/\1/')

//     # remove whitespace from JSON
//     local data=$(cat $1 | tr -d "\n" | tr -d "\t" | tr -s " " " ")

//     echo "> $locale"
//     # curl -sL --data-urlencode "json@-" -d "locale=${locale}" $2 <<< $data
//     local status=$(curl -sL -w "%{http_code}" --data-urlencode "json@-" -d "locale=${locale}" --output $1 $2 <<< $data)
//   if [ "$status" != "200" ]; then
//     echo "Getting Language Data for $locale failed with status: $status ."
//     exit 1
//   fi
// }

module.exports = function(grunt) {
  // lint files
  // get translations
  // write results to dest

  grunt.registerMultiTask('ion_u_translations', 'Fetch translations from portal', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var request = require("request");
    var jsonlint = require("jsonlint");

    var terminate = this.async();
    var options = this.options({
      endpoint: 'https://cs-languageportal-beta.webvariants.de/api/gettranslations',
      lintinput: true,
      lintoutput: true,
      lint: true
    });

    if (typeof(options.locale) === 'undefined') {
      grunt.fail.fatal('no locale present in task options');
    }

    var translations = function (locale, sourceFile, destFile, success) {
      var contents = JSON.stringify(grunt.file.readJSON(sourceFile));

      if (options.lint || options.lintinput) {
        jsonlint.parse(contents);
      }

      request.post({
        url: options.endpoint,
        form: {
          locale: locale,
          json: contents
        }
      }, function(err, res, body) {
        if (err) grunt.fail.fatal(err);

        if (+res.statusCode === 200) {
          grunt.log.ok('got data for '+options.locale);

          if (options.lint || options.lintoutput) {
            jsonlint.parse(body);
          }

          grunt.file.write(destFile, body);
          grunt.log.ok('wrote contents to destination', destFile);
          return success();
        }

        console.log(res.statusCode);
        grunt.fail.fatal('Request to language portal failed');
      });
    };

    var jobs = 1;
    var done = function () {
      jobs--;
      if (jobs === 0) terminate();
    };

    this.files.forEach(function (file) {
      var contents;
      //@FIXME multisource support
      jobs++;
      translations(options.locale, file.src.shift(), file.dest, done);
    });
    done();
  });

};
