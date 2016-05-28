import React from 'react'
import { updateNetworkLayer } from 'utils/relay'
import { getQueryVariable } from 'utils/location'
import * as cookiestore from 'utils/cookiestore'

export default class TokenRedirectView extends React.Component {

  componentWillMount () {
    const token = getQueryVariable('token')
    if (token) {
      window.localStorage.clear()
      cookiestore.set('graphcool_token', token)
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
