import React, { PropTypes } from 'react'
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

  _openProfile () {
    console.log('Profile view!')
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
            <div className={classes.element} onClick={::this._openProfile}>
              Profile
            </div>
            <div className={classes.element} onClick={::this._logout}>
              Logout
            </div>
          </div>
        }
        <div className={classes.right}>
          <div onClick={::this._toggleRightOverlay}>
            <div className={classes.label}>
              {this.props.user.name}
            </div>
            <div
              className={`${classes.arrow} ${this.state.userDropdownVisible ? classes.up : ''}`}
            >
              <Icon
                src={require('assets/icons/arrow.svg')}
                color='#70738C'
                />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
