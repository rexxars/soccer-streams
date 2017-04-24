const {h, Component} = require('preact')
const soccerStreams = require('soccer-streams-scraper')
const MatchRow = require('./MatchRow')

class MatchList extends Component {
  constructor (props) {
    super(props)

    this.state = {loading: true, highlightedMatch: 0}
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.checkScroll = this.checkScroll.bind(this)
    this.recalculateRowHeight = this.recalculateRowHeight.bind(this)
  }

  componentWillMount () {
    this.loadMatches()
  }

  componentDidMount () {
    window.addEventListener('keydown', this.handleKeyDown, false)
    window.addEventListener('resize', this.recalculateRowHeight, false)
  }

  componentWillUnmount () {
    window.removeEventListener('keydown', this.handleKeyDown, false)
    window.removeEventListener('resize', this.recalculateRowHeight, false)
  }

  componentDidUpdate (prevProps, prevState) {
    this.recalculateRowHeight()
  }

  async loadMatches () {
    this.setState({matches: null, loading: true})
    const matches = await soccerStreams.getMatches()
    this.setState({matches, loading: false})
  }

  recalculateRowHeight () {
    const el = this.base
    const row = el.querySelector('tr')
    this.rowHeight = row && row.getBoundingClientRect().height
  }

  handleKeyDown (e) {
    const isUp = e.key === 'ArrowUp'
    const isDown = e.key === 'ArrowDown'
    const isDirectional = isUp || isDown
    const isEnter = e.key === 'Enter'
    const isEscape = e.key === 'Escape'
    if (!isDirectional && !isEnter && !isEscape) {
      return
    }

    e.preventDefault()
    e.stopPropagation()

    if (isEscape) {
      this.loadMatches()
      return
    }

    if (isDirectional) {
      this.setState(prevState => {
        const lastMatchIndex = this.state.matches ? this.state.matches.length - 1 : prevState.highlightedMatch
        const newIndex = isUp ? prevState.highlightedMatch - 1 : prevState.highlightedMatch + 1
        return {highlightedMatch: Math.min(Math.max(0, newIndex), lastMatchIndex)}
      }, this.checkScroll)
      return
    }

    this.props.onMatchSelect(this.state.matches[this.state.highlightedMatch].id)
  }

  checkScroll () {
    if (!this.rowHeight) {
      return
    }

    const elementPosition = this.rowHeight * this.state.highlightedMatch
    const currentScroll = this.props.scrollContainer.scrollTop
    const lowerWindowBound = window.innerHeight + currentScroll

    if (elementPosition + this.rowHeight > lowerWindowBound) {
      this.props.scrollContainer.scrollTop = currentScroll + this.rowHeight
    } else if (elementPosition < currentScroll) {
      this.props.scrollContainer.scrollTop = currentScroll - this.rowHeight
    }
  }

  render () {
    if (this.state.loading) {
      return h('div', {className: 'fullscreen-text'}, 'Loading')
    }

    if (this.state.matches.length === 0) {
      return h('div', {className: 'fullscreen-text'}, 'No matches available')
    }

    const items = this.state.matches.map((match, index) => {
      const selected = this.state.highlightedMatch === index
      const props = Object.assign({key: match.id, selected}, match)
      return h(MatchRow, props)
    })

    return h('table', {className: 'list match-list'}, h('tbody', null, items))
  }
}

module.exports = MatchList
