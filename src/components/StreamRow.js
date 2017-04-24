const {h} = require('preact')
const Tag = require('./Tag')

function StreamRow (props) {
  const classes = ['stream-row', props.selected && 'selected'].filter(Boolean).join(' ')
  const tags = [props.sponsored && 'sponsored', props.nsfw && 'nsfw'].filter(Boolean)
  const type = formatStreamType(props.type)

  return h('tr', {className: classes},
    h('td', {className: 'rating'}, '★ ', props.rating),
    h('td', {className: 'type'}, h(Tag, {name: type, tag: props.type})),
    h('td', {className: 'quality'}, props.quality),
    h('td', {className: 'language'}, props.language),
    h('td', {className: 'tags'}, tags.map(tag => h(Tag, {key: tag, name: tag})))
  )
}

function formatStreamType (type) {
  switch (type) {
    case 'http':
      return 'HTTP'
    case 'acestream':
      return 'ACE'
    default:
      return type
  }
}

module.exports = StreamRow
