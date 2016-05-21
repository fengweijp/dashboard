import React from 'react'
import Relay from 'react-relay'
import ReactDOM from 'react-dom'
import useRelay from 'react-router-relay'
import { Router, browserHistory, applyRouterMiddleware } from 'react-router'
import routes from './routes'
import { updateNetworkLayer } from './utils/relay'
import loadAnalytics from './utils/analytics'

import './utils/polyfils.ts'

loadAnalytics()

updateNetworkLayer()

browserHistory.listen(() => {
  analytics.page()
})

ReactDOM.render((
  <Router
    forceFetch
    routes={routes}
    environment={Relay.Store}
    render={applyRouterMiddleware(useRelay)}
    history={browserHistory}
  />
), document.getElementById('root'))
