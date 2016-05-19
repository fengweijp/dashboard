import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import Icon from 'components/Icon/Icon'
import classes from './Header.scss'
import * as cookiestore from 'utils/cookiestore'

export default class Header extends React.Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
  }

  state = {
    userDropdownVisible: false,
  }

  _toggleUserDropdown () {
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
          <div className={classes.userDropdown}>
            <Link
              to={`/${this.props.params.projectName}/account`}
              onClick={::this._toggleUserDropdown}
            >
              Account
            </Link>
            <div onClick={::this._logout}>
              Logout
            </div>
          </div>
        }
        <div className={classes.right} onClick={::this._toggleUserDropdown}>
          {this.props.user.name}
          <Icon
            width={11}
            height={6}
            src={require('assets/icons/arrow.svg')}
          />
        </div>
      </div>
    )
  }
}
