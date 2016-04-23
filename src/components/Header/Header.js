import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Icon from 'components/Icon/Icon'
import classes from './Header.scss'

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
    window.localStorage.clear()
    window.location.pathname = '/'
  }

  _selectProjectId () {
    const projectId = findDOMNode(this.refs.projectId)
    const range = document.createRange()
    range.setStartBefore(projectId)
    range.setEndAfter(projectId)
    window.getSelection().addRange(range)
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
