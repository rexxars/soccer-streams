const {Component, h} = require('preact')
const MatchList = require('./MatchList')
const StreamList = require('./StreamList')
const playAceStream = require('../util/playAceStream')

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {selectedMatch: null, selectedStream: null}
    this.handleMatchSelected = this.handleMatchSelected.bind(this)
    this.handleStreamSelected = this.handleStreamSelected.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  componentDidMount () {
    window.addEventListener('keyup', this.handleKeyUp, false)
  }

  componentWillUnmount () {
    window.removeEventListener('keyup', this.handleKeyUp, false)
  }

  handleMatchSelected (matchId) {
    this.setState(() => ({selectedMatch: matchId}))
  }

  handleStreamSelected (stream) {
    if (stream.type === 'acestream') {
      return playAceStream(stream)
    }

    this.setState(() => ({selectedStream: stream}))
  }

  handleKeyUp (e) {
    const escKeys = ['ArrowLeft', 'Backspace', 'Escape']
    if (this.state.selectedMatch && escKeys.includes(e.key)) {
      this.setState({selectedMatch: null, selectedStream: null})
    }
  }

  render () {
    if (this.state.selectedStream) {
      const {href} = this.state.selectedStream
      return h('iframe', {src: href})
    }

    const scrollContainer = this.props.rootEl
    const onStreamSelect = this.handleStreamSelected

    return this.state.selectedMatch
      ? h(StreamList, {id: this.state.selectedMatch, onStreamSelect, scrollContainer})
      : h(MatchList, {onMatchSelect: this.handleMatchSelected, scrollContainer})
  }
}

module.exports = App
