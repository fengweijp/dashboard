import React from 'react'
import ReactDOM from 'react-dom'
import { RelayRouter } from 'react-router-relay'
import { browserHistory } from 'react-router'
import routes from './routes.js'
import { updateNetworkLayer } from './utils/relay.js'

updateNetworkLayer()

ReactDOM.render(
  <RelayRouter history={browserHistory}>
    {routes}
  </RelayRouter>,
  document.getElementById('root')
)
