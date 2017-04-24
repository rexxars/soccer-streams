const {spawn} = require('child_process')

module.exports = stream => {
  return spawn('acestreamplayer', ['--fullscreen', '--no-osd', stream.href])
}
