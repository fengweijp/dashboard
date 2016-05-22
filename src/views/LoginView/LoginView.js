import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import Loading from 'components/Loading/Loading'
import { findDOMNode } from 'react-dom'
import { updateNetworkLayer } from 'utils/relay'
import * as cookiestore from 'utils/cookiestore'
import mapProps from 'map-props'
import LoginMutation from 'mutations/LoginMutation'
import Icon from 'components/Icon/Icon'
import classes from './LoginView.scss'

class LoginView extends React.Component {

  static propTypes = {
    viewer: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props)

    this.state = {
      loading: false,
    }
  }

  componentDidMount () {
    analytics.track('login: viewed')
  }

  _login () {
    this.setState({ loading: true })

    const email = findDOMNode(this.refs.email).value
    const password = findDOMNode(this.refs.password).value

    const payload = { email, password, viewer: this.props.viewer }
    const onSuccess = (response) => {
      cookiestore.set('graphcool_token', response.signinUser.token)
      cookiestore.set('graphcool_user_id', response.signinUser.viewer.user.id)
      updateNetworkLayer()

      analytics.track('login: logged in', () => {
        window.location.reload()
      })
    }
    const onFailure = () => {
      this.setState({ loading: false })

      analytics.track('login: login failed', { email })
    }
    Relay.Store.commitUpdate(new LoginMutation(payload), {
      onSuccess,
      onFailure,
    })
  }

  _listenForEnter (e) {
    if (e.keyCode === 13) {
      this._login()
    }
  }

  render () {
    if (this.state.loading) {
      return (
        <div className={classes.root}>
          <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Loading color='#fff' />
          </div>
        </div>
      )
    }

    return (
      <div className={classes.root}>
        <div className={classes.box}>
          <div className={classes.logo}>
            <Icon
              width={60} height={70}
              src={require('assets/icons/logo.svg')}
              color='#fff'
              />
          </div>
          <div className={classes.form}>
            <input
              autoFocus
              ref='email'
              type='text'
              placeholder='Email'
              onKeyUp={::this._listenForEnter}
              />
            <input
              ref='password'
              type='password'
              placeholder='Password'
              onKeyUp={::this._listenForEnter}
              />
            <button onClick={::this._login}>Login</button>
          </div>
        </div>
      </div>
    )
  }
}

const MappedLoginView = mapProps({
  viewer: (props) => props.viewer,
})(LoginView)

export default Relay.createContainer(MappedLoginView, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id
      }
    `,
  },
})
