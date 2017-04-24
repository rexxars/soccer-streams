const {Component, h} = require('preact')
const soccerStreams = require('soccer-streams-scraper')
const StreamRow = require('./StreamRow')

class StreamList extends Component {
  constructor (props) {
    super(props)

    this.state = {loading: true, highlightedStream: 0}
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.checkScroll = this.checkScroll.bind(this)
    this.recalculateRowHeight = this.recalculateRowHeight.bind(this)
  }

  componentWillMount () {
    this.loadStreams()
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

  async loadStreams () {
    this.setState({streams: null, loading: true})
    const streams = await soccerStreams.getStreamsForMatch(this.props.id)
    this.setState({streams, loading: false})
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
      this.loadStreams()
      return
    }

    if (isDirectional) {
      this.setState(prevState => {
        const lastStreamIndex = this.state.streams ? this.state.streams.length - 1 : prevState.highlightedStream
        const newIndex = isUp ? prevState.highlightedStream - 1 : prevState.highlightedStream + 1
        return {highlightedStream: Math.min(Math.max(0, newIndex), lastStreamIndex)}
      }, this.checkScroll)
      return
    }

    this.props.onStreamSelect(this.state.streams[this.state.highlightedStream])
  }

  checkScroll () {
    if (!this.rowHeight) {
      return
    }

    const elementPosition = this.rowHeight * this.state.highlightedStream
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

    if (this.state.streams.length === 0) {
      return h('div', {className: 'fullscreen-text'}, 'No streams available')
    }

    const items = this.state.streams.map((match, index) => {
      const selected = this.state.highlightedStream === index
      const props = Object.assign({key: match.id, selected}, match)
      return h(StreamRow, props)
    })

    return h('table', {className: 'list stream-list'}, h('tbody', null, items))
  }
}

module.exports = StreamList
