import React from 'react'
import ReactDOM from 'react-dom'
import { RelayRouter } from 'react-router-relay'
import { browserHistory } from 'react-router'
import routes from './routes.js'
import { updateNetworkLayer } from './utils/relay.js'
import loadAnalytics from './utils/analytics.js'

loadAnalytics()

updateNetworkLayer()

browserHistory.listen(() => {
  analytics.page()
})

ReactDOM.render(
  <RelayRouter
    forceFetch
    routes={routes}
    history={browserHistory}
  />,
  document.getElementById('root')
)
