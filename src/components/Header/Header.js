import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Icon from 'components/Icon/Icon'
import classes from './Header.scss'
import * as cookiestore from 'utils/cookiestore'

export default class Header extends React.Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
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

  _selectProjectId () {
    const projectId = findDOMNode(this.refs.projectId)
    const range = document.createRange()
    range.setStartBefore(projectId)
    range.setEndAfter(projectId)
    window.getSelection().removeAllRanges()
    window.getSelection().addRange(range)

    analytics.track('header: projectid copied')
  }

  render () {
    return (
      <div className={classes.root}>
        <div className={classes.left} title='Project Id'>
          <div onClick={::this._selectProjectId} className={classes.copyWrapper}>
            <span className={classes.projectId} ref='projectId'>
              {this.props.projectId}
            </span>
            <span className={classes.label}>
              Copy Project Id
            </span>
          </div>
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
