import * as React from 'react'
import * as Relay from 'react-relay'
import { findDOMNode } from 'react-dom'
import { Field, Permission, UserType } from '../../../types/types'
const ClickOutside: any = (require('react-click-outside') as any).default
import PermissionType from './PermissionType'
import Icon from '../../../components/Icon/Icon'
const AddPermissionMutation: any = (require('../../../mutations/AddPermissionMutation') as any).default
const DeletePermissionMutation: any = (require('../../../mutations/DeletePermissionMutation') as any).default
const classes: any = require('./PermissionsLayover.scss')

interface Props {
  permissions: Permission[]
  field: Field
  close: () => null
}

interface State {
  userType: UserType
  userPath?: string
}

export default class PermissionsLayover extends React.Component<Props, State> {

  state = {
    userType: 'GUEST' as UserType,
    userPath: '',
  }

  refs: {
    [key: string]: any;
    comment: HTMLInputElement
    allowRead: HTMLInputElement
    allowCreate: HTMLInputElement
    allowUpdate: HTMLInputElement
    allowDelete: HTMLInputElement
  }

  commentInput = () => findDOMNode(this.refs.comment) as HTMLInputElement
  allowReadInput = () => findDOMNode(this.refs.allowRead) as HTMLInputElement
  allowCreateInput = () => findDOMNode(this.refs.allowCreate) as HTMLInputElement
  allowUpdateInput = () => findDOMNode(this.refs.allowUpdate) as HTMLInputElement
  allowDeleteInput = () => findDOMNode(this.refs.allowDelete) as HTMLInputElement

  _resetNewPermission () {
    this.commentInput().value = ''
    this.allowReadInput().checked = false
    this.allowCreateInput().checked = false
    this.allowUpdateInput().checked = false
    this.allowDeleteInput().checked = false

    this.setState({
      userType: 'GUEST' as UserType,
      userPath: '',
    })
  }

  _addPermission () {
    const comment = this.commentInput().value
    const allowRead = this.allowReadInput().checked
    const allowCreate = this.allowCreateInput().checked
    const allowUpdate = this.allowUpdateInput().checked
    const allowDelete = this.allowDeleteInput().checked

    Relay.Store.commitUpdate(
      new AddPermissionMutation({
        fieldId: this.props.field.id,
        userType: this.state.userType,
        userPath: this.state.userPath,
        userRole: '',
        comment,
        allowRead,
        allowCreate,
        allowUpdate,
        allowDelete,
      }),
      {
        onSuccess: () => {
          analytics.track('models/fields: created permission')

          this._resetNewPermission()
        },
      }
    )
  }

  _deletePermission (permission: Permission) {
    if (window.confirm('Do you really want to delete this permission')) {
      Relay.Store.commitUpdate(
        new DeletePermissionMutation({
          fieldId: this.props.field.id,
          permissionId: permission.id,
        }),
        {
          onSuccess: () => {
            analytics.track('models/fields: deleted permission')
          },
        }
      )
    }
  }

  _applyPermissionState ({ userType, userPath }) {
    this.setState({ userType, userPath })
  }

  render () {
    return (
      <div className={classes.root}>
        <ClickOutside onClickOutside={this.props.close}>
          <div className={classes.permissions}>
            <div className={classes.permissionsHead}>
              Permissions
            </div>
            <div className={classes.permissionsNew}>
              <div className={classes.permissionType}>
                <PermissionType
                  userType={this.state.userType}
                  userPath={this.state.userPath}
                  dataCallback={({ userType, userPath }) => this.setState({ userType, userPath })}
                />
              </div>
              <div className={classes.allow}>
                <label>
                  <input ref='allowRead' type='checkbox' />
                  <span>Read</span>
                </label>
                <label>
                  <input ref='allowCreate' type='checkbox' />
                  <span>Create</span>
                </label>
                <label>
                  <input ref='allowUpdate' type='checkbox' />
                  <span>Update</span>
                </label>
                <label>
                  <input ref='allowDelete' type='checkbox' />
                  <span>Delete</span>
                </label>
              </div>
              <div className={classes.permissionComment}>
                <input ref='comment' type='text' placeholder='Comment' />
              </div>
              <div className={classes.add}>
                <button onClick={() => this._addPermission()}>
                  Add
                  <Icon src={require('assets/icons/enter.svg')} />
                </button>
              </div>
            </div>
            <div className={classes.permissionWrapper}>
              {this.props.permissions.map((permission) => (
                <div key={permission.id} className={classes.permission}>
                  <div className={classes.permissionType}>
                    <PermissionType
                      userType={permission.userType}
                      userPath={permission.userPath}
                      disabled
                    />
                  </div>
                  <div className={classes.allow}>
                    <label>
                      <input
                        disabled
                        checked={permission.allowRead}
                        type='checkbox'
                      />
                      <span>Read</span>
                    </label>
                    <label>
                      <input
                        disabled
                        checked={permission.allowCreate}
                        type='checkbox'
                      />
                      <span>Create</span>
                    </label>
                    <label>
                      <input
                        disabled
                        checked={permission.allowUpdate}
                        type='checkbox'
                      />
                      <span>Update</span>
                    </label>
                    <label>
                      <input
                        disabled
                        checked={permission.allowDelete}
                        type='checkbox'
                      />
                      <span>Delete</span>
                    </label>
                  </div>
                  <div className={classes.permissionComment}>
                    <input disabled type='text' value={permission.comment} placeholder='Comment' />
                  </div>
                  <div className={classes.permissionDelete}>
                    <span onClick={() => this._deletePermission(permission)}>
                      <Icon src={require('assets/icons/delete.svg')} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ClickOutside>
      </div>
    )
  }
}
