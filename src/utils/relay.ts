// import { injectNetworkLayer, DefaultNetworkLayer } from 'react-relay'
import * as Relay from 'react-relay'
import * as cookiestore from './cookiestore'

export function updateNetworkLayer (): void {
  const token = cookiestore.get('graphcool_token')
  const headers = token ? {
    'Authorization': `Bearer ${token}`,
    'X-GraphCool-Source': 'dashboard:relay',
  } : null
  const api = `${__BACKEND_ADDR__}/api`
  const layer = new Relay.DefaultNetworkLayer(api, { headers, retryDelays: [] })

  Relay.injectNetworkLayer(layer)
}
