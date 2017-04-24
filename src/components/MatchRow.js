const {h} = require('preact')
const TeamLogo = require('./TeamLogo')

function MatchRow (props) {
  const classes = ['match-row', props.selected && 'selected'].filter(Boolean).join(' ')

  return h('tr', {className: classes},
    h('td', {className: 'home'}, props.teams.home.name, TeamLogo(props.teams.home)),
    h('td', {className: 'vs'}, ' vs '),
    h('td', {className: 'away'}, TeamLogo(props.teams.away), props.teams.away.name)
  )
}

module.exports = MatchRow
