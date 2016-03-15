import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import classes from './NewPermissionOverlay.scss'

const userTypes = {
  GUEST: 'Guest',
  ADMIN: 'Admin',
  USER: 'Logged-In User',
}

export default class NewPermissionOverlay extends React.Component {

  static propTypes = {
    fieldId: PropTypes.string.isRequired,
    hide: PropTypes.func.isRequired,
    add: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props)

    this._addPermission = ::this._addPermission
  }

  _addPermission () {
    const fieldId = this.props.fieldId
    const userType = findDOMNode(this.refs.userType).value
    const allowRead = findDOMNode(this.refs.allowRead).checked
    const allowCreate = findDOMNode(this.refs.allowCreate).checked
    const allowUpdate = findDOMNode(this.refs.allowUpdate).checked
    const allowDelete = findDOMNode(this.refs.allowDelete).checked

    this.props.add({
      fieldId,
      userType,
      allowRead,
      allowCreate,
      allowUpdate,
      allowDelete,
    })

    this.props.hide()
  }

  render () {
    return (
      <div className={classes.background}>
        <div className={classes.container}>
          <div className={classes.head}>Add permission</div>
          <select ref='userType' className={classes.typeSelect}>
            {Object.keys(userTypes).map((userType) => (
              <option key={userType} value={userType}>{userTypes[userType]}</option>
            ))}
          </select>
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
