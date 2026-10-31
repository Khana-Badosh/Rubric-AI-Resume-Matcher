const fs = require('fs');

function discardUploads(req) {
  const saved = Object.values(req.files ?? {}).flat();
  return Promise.all(saved.map((file) => fs.promises.unlink(file.path).catch(() => {})));
}

module.exports = { discardUploads };
