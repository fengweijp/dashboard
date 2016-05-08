import cookies from 'js-cookie'
import { injectNetworkLayer, DefaultNetworkLayer } from 'react-relay'

export function updateNetworkLayer () {
  const token = cookies.get('graphcool_token')
  const headers = token ? {
    'Authorization': `Bearer ${token}`,
    'X-GraphCool-Source': 'dashboard:relay',
  } : null
  const api = `${__BACKEND_ADDR__}/api`
  const layer = new DefaultNetworkLayer(api, { headers, retryDelays: [] })

  injectNetworkLayer(layer)
}

export function saveToken (token) {
  const domain = location.hostname.split('.').slice(-2).join('.')

  cookies.set('graphcool_token', token, {
    domain,
    expires: 90,
  })
}
