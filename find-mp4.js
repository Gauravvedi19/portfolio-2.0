const fs = require('fs');
const path = require('path');

function walk(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    if (!list) return done(null, results);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      if (file === 'node_modules' || file === '.git' || file === 'dist') {
        if (!--pending) done(null, results);
        return;
      }
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          if (file.endsWith('.mp4')) results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
}

walk('.', function(err, results) {
  if (err) throw err;
  console.log(results.join('\n'));
});
