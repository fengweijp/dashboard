import React from 'react'
import ReactDOM from 'react-dom'
import { RelayRouter } from 'react-router-relay'
import { browserHistory } from 'react-router'
import routes from './routes'
import { updateNetworkLayer } from './utils/relay'

updateNetworkLayer()

ReactDOM.render(
  <RelayRouter history={browserHistory}>
    {routes}
  </RelayRouter>,
  document.getElementById('root')
)
