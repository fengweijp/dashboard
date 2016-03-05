import React, { PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

export default class SideNav extends React.Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props)

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)

    this._login = this._login.bind(this)
  }

  _login () {
    this.props.login('email', 'password')
  }

  render () {
    return (
      <div>
        <input type='text' placeholder='Email' />
        <input type='password' placeholder='Password' />
        <button onClick={this._login}>Login</button>
      </div>
    )
  }
}
