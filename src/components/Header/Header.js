import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Icon from 'components/Icon/Icon'
import classes from './Header.scss'
import * as cookiestore from 'utils/cookiestore'

export default class Header extends React.Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
  }

  constructor (props) {
    super(props)

    this.state = {
      userDropdownVisible: false,
    }
  }

  _toggleRightOverlay () {
    this.setState({ userDropdownVisible: !this.state.userDropdownVisible })
  }

  _logout () {
    analytics.track('header: logout', () => {
      analytics.reset()
      cookiestore.remove('graphcool_token')
      cookiestore.remove('graphcool_user_id')
      window.localStorage.clear()
      window.location.pathname = '/'
    })
  }

  render () {
    return (
      <div className={classes.root}>
        <div className={classes.left}>
          <a target='_blank' href='http://docs.graph.cool'>Docs</a>
        </div>
        {this.state.userDropdownVisible &&
          <div className={classes.userDropdown} onClick={::this._logout}>
            Logout
          </div>
        }
        <div className={classes.right} onClick={::this._toggleRightOverlay}>
          {this.props.user.name}
          <Icon
            src={require('assets/icons/arrow.svg')}
            color='#70738C'
            />
        </div>
      </div>
    )
  }
}
