import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import classes from './NewPermissionOverlay.scss'

const userTypes = {
  GUEST: 'Guest',
  AUTHENTICATED: 'Authenticated User',
  RELATED: 'Related',
}

export default class NewPermissionOverlay extends React.Component {

  static propTypes = {
    hide: PropTypes.func.isRequired,
    add: PropTypes.func.isRequired,
    availableUserRoles: PropTypes.array.isRequired,
  };

  constructor (props) {
    super(props)

    this._addPermission = ::this._addPermission
    this._onSelectUserType = ::this._onSelectUserType

    this.state = {
      userType: 'GUEST',
      userRole: props.availableUserRoles[0],
    }
  }

  _addPermission () {
    const userType = findDOMNode(this.refs.userType).value
    const userPath = (findDOMNode(this.refs.userPath) || {}).value
    const userRole = (findDOMNode(this.refs.userRole) || {}).value
    const allowRead = findDOMNode(this.refs.allowRead).checked
    const allowCreate = findDOMNode(this.refs.allowCreate).checked
    const allowUpdate = findDOMNode(this.refs.allowUpdate).checked
    const allowDelete = findDOMNode(this.refs.allowDelete).checked

    this.props.add({
      userType,
      userPath,
      userRole,
      allowRead,
      allowCreate,
      allowUpdate,
      allowDelete,
    })

    this.props.hide()
  }

  _onSelectUserType (e) {
    this.setState({ userType: e.target.value })
  }

  _onSelectUserRole (e) {
    this.setState({ userRole: e.target.value })
  }

  render () {
    return (
      <div className={classes.background}>
        <div className={classes.container}>
          <div className={classes.head}>Add permission</div>
          <select onChange={this._onSelectUserType} ref='userType' className={classes.typeSelect}>
            {Object.keys(userTypes).map((userType) => (
              <option key={userType} value={userType}>{userTypes[userType]}</option>
            ))}
          </select>
          {this.state.userType === 'AUTHENTICATED' &&
            <select onChange={this._onSelectUserRole} ref='userRole' className={classes.typeSelect}>
              {this.props.availableUserRoles.map((userRole) => (
                <option key={userRole} value={userRole}>{userRole}</option>
              ))}
            </select>
          }
          {this.state.userType === 'RELATED' &&
            <input
              ref='userPath'
              className={classes.input}
              placeholder='some.model.path'
              type='text'
              />
          }
          <div className={classes.check}>
            <label>
              <input ref='allowRead' type='checkbox' />
              <span className={classes.checkWord}>Read</span><br />
              <span className={classes.checkDescription}>Allow read access to this field?</span>
            </label>
          </div>
          <div className={classes.check}>
            <label>
              <input ref='allowCreate' type='checkbox' />
              <span className={classes.checkWord}>Create</span><br />
              <span className={classes.checkDescription}>Allow create access to this field?</span>
            </label>
          </div>
          <div className={classes.check}>
            <label>
              <input ref='allowUpdate' type='checkbox' />
              <span className={classes.checkWord}>Update</span><br />
              <span className={classes.checkDescription}>Allow update access to this field?</span>
            </label>
          </div>
          <div className={classes.check}>
            <label>
              <input ref='allowDelete' type='checkbox' />
              <span className={classes.checkWord}>Delete</span><br />
              <span className={classes.checkDescription}>Allow delete access to this field?</span>
            </label>
          </div>
          <div onClick={this.props.hide} className={classes.buttonCancel}>Cancel</div>
          <div onClick={this._addPermission} className={classes.buttonSubmit}>Add</div>
        </div>
      </div>
    )
  }
}
