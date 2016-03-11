import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import PureRenderMixin from 'react-addons-pure-render-mixin'

export default class SideNav extends React.Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props)

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)

    this._login = ::this._login
  }

  _login () {
    const email = findDOMNode(this.refs.email).value
    const password = findDOMNode(this.refs.password).value
    this.props.login(email, password)
  }

  render () {
    return (
      <div>
        <input ref='email' type='text' placeholder='Email' />
        <input ref='password' type='password' placeholder='Password' />
        <button onClick={this._login}>Login</button>
      </div>
    )
  }
}
