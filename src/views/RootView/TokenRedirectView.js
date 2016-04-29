import React from 'react'
import { saveToken, updateNetworkLayer } from 'utils/relay'

function getQueryVariable (variable) {
  const query = window.location.search.substring(1)
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=')
    if (decodeURIComponent(pair[0]) === variable) {
      return decodeURIComponent(pair[1])
    }
  }
}

export default class TokenRedirectView extends React.Component {

  componentWillMount () {
    const token = getQueryVariable('token')
    if (token) {
      window.localStorage.clear()
      saveToken(token)
      updateNetworkLayer()
      window.location.href = window.location.origin
    }
  }

  render () {
    return (
      <div>Redirecting...</div>
    )
  }
}
