const {h} = require('preact')

function Tag (props) {
  const tag = props.tag || props.name
  return h('span', {className: 'tag tag-' + tag}, props.name.toUpperCase())
}

module.exports = Tag
