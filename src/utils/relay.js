import { injectNetworkLayer, DefaultNetworkLayer } from 'react-relay'
import * as cookiestore from 'utils/cookiestore'

export function updateNetworkLayer () {
  const token = cookiestore.get('graphcool_token')
  const headers = token ? {
    'Authorization': `Bearer ${token}`,
    'X-GraphCool-Source': 'dashboard:relay',
  } : null
  const api = `${__BACKEND_ADDR__}/api`
  const layer = new DefaultNetworkLayer(api, { headers, retryDelays: [] })

  injectNetworkLayer(layer)
}
