const {h} = require('preact')

function TeamLogo (props) {
  return h('img', {
    key: props.name,
    alt: props.name,
    src: props.imgUrl,
    className: 'team-logo'
  })
}

module.exports = TeamLogo
