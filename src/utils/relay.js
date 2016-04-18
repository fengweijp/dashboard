import { injectNetworkLayer, DefaultNetworkLayer } from 'react-relay'

export function updateNetworkLayer () {
  const token = window.localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}`, 'X-GraphCool-Source': 'dashboard:relay' } : null
  const api = `${__BACKEND_ADDR__}/api`
  const layer = new DefaultNetworkLayer(api, { headers, retryDelays: [] })

  injectNetworkLayer(layer)
}

export function saveToken (token) {
  window.localStorage.setItem('token', token)
}
