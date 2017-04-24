const {render, h} = require('preact')
const App = require('./components/App')

const rootEl = document.getElementById('root')
render(h(App, {rootEl}), rootEl)
