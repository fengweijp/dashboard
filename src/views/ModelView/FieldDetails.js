import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import { findDOMNode } from 'react-dom'
import Loading from 'react-loading'
import Icon from 'components/Icon/Icon'
import PermissionType from './PermissionType'
import AddPermissionMutation from 'mutations/AddPermissionMutation'
import UpdateFieldMutation from 'mutations/UpdateFieldMutation'
import DeletePermissionMutation from 'mutations/DeletePermissionMutation'
import classes from './FieldDetails.scss'

class FieldDetails extends React.Component {

  static propTypes = {
    field: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props)

    this.state = {
      userType: 'GUEST',
      userPath: '',
      loading: false,
    }
  }

  componentDidMount () {
    document.addEventListener('click', this._handleClick, true)
  }

  componentWillUnmount () {
    document.removeEventListener('click', this._handleClick, true)
  }

  _handleClick = (e) => {
    const el = this.refs.container.parentNode.parentNode.parentNode
    if (!el.contains(e.target)) {
      if (window.confirm('You have unsaved changed. Do you really want to continue?')) {
        this.props.close()
      } else {
        e.preventDefault()
      }
    }
  };

  save () {
    const isUnique = findDOMNode(this.refs.unique).checked
    const defaultValue = findDOMNode(this.refs.defaultValue).value
    const description = findDOMNode(this.refs.description).value

    Relay.Store.commitUpdate(new UpdateFieldMutation({
      fieldId: this.props.field.id,
      isUnique,
      defaultValue,
      description,
    }), {
      onSuccess: this.props.close,
    })

    this.setState({ loading: true })
  }

  _resetNewPermission () {
    findDOMNode(this.refs.permissionComment).value = ''
    findDOMNode(this.refs.permissionAllowRead).checked = false
    findDOMNode(this.refs.permissionAllowCreate).checked = false
    findDOMNode(this.refs.permissionAllowUpdate).checked = false
    findDOMNode(this.refs.permissionAllowDelete).checked = false

    this.setState({
      userType: 'GUEST',
      userPath: '',
    })
  }

  _addPermission (data) {
    const comment = findDOMNode(this.refs.permissionComment).value
    const allowRead = findDOMNode(this.refs.permissionAllowRead).checked
    const allowCreate = findDOMNode(this.refs.permissionAllowCreate).checked
    const allowUpdate = findDOMNode(this.refs.permissionAllowUpdate).checked
    const allowDelete = findDOMNode(this.refs.permissionAllowDelete).checked

    Relay.Store.commitUpdate(new AddPermissionMutation({
      fieldId: this.props.field.id,
      userType: this.state.userType,
      userPath: this.state.userPath,
      userRole: '',
      comment,
      allowRead,
      allowCreate,
      allowUpdate,
      allowDelete,
    }), {
      onSuccess: ::this._resetNewPermission,
    })
  }

  _deletePermission (permission) {
    if (window.confirm('Do you really want to delete this permission')) {
      Relay.Store.commitUpdate(new DeletePermissionMutation({
        fieldId: this.props.field.id,
        permissionId: permission.id,
      }))
    }
  }

  _applyPermissionState ({ userType, userPath }) {
    this.setState({ userType, userPath })
  }

  render () {
    if (this.state.loading) {
      return (
        <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Loading type='bubbles' delay={0} color='#8989B1' />
        </div>
      )
    }

    const { field } = this.props

    return (
      <div ref='container' className={classes.root}>
        <div className={classes.misc}>
          <div className={classes.defaultValue}>
            <label>
              <span>Default Value</span>
              <Icon
                data-tip='The default value for this field'
                src={require('assets/icons/info.svg')}
              />
              <input
                ref='defaultValue'
                type='text'
                placeholder='Set default value'
                defaultValue={field.defaultValue}
              />
            </label>
          </div>
          <div className={classes.unique}>
            <label>
              <span>Unique</span>
              <Icon
                data-tip='Should each value be unique?'
                src={require('assets/icons/info.svg')}
              />
              <input
                defaultChecked={field.isUnique}
                ref='unique'
                type='checkbox'
              />
            </label>
          </div>
          <div className={classes.description}>
            <textarea
              placeholder='Add field description...'
              defaultValue={field.description}
              ref='description'
            />
          </div>
        </div>
        <div className={classes.permissions}>
          <div className={classes.permissionsHead}>
            Permissions
          </div>
          <div className={classes.permissionsNew}>
            <div className={classes.permissionType}>
              <PermissionType
                userType={this.state.userType}
                userPath={this.state.userPath}
                dataCallback={::this._applyPermissionState}
              />
            </div>
            <div className={classes.permissionAllow}>
              <label>
                <input ref='permissionAllowRead' type='checkbox' />
                <span>Read</span>
              </label>
              <label>
                <input ref='permissionAllowCreate' type='checkbox' />
                <span>Create</span>
              </label>
              <label>
                <input ref='permissionAllowUpdate' type='checkbox' />
                <span>Update</span>
              </label>
              <label>
                <input ref='permissionAllowDelete' type='checkbox' />
                <span>Delete</span>
              </label>
            </div>
            <div className={classes.permissionComment}>
              <input ref='permissionComment' type='text' placeholder='Comment' />
            </div>
            <div className={classes.permissionAdd}>
              <button onClick={::this._addPermission}>
                Add
                <Icon src={require('assets/icons/enter.svg')} />
              </button>
            </div>
          </div>
          <div className={classes.permissionWrapper}>
            {field.permissions.edges.map(({ node }) => (
              <div key={node.id} className={classes.permission}>
                <div className={classes.permissionType}>
                  <PermissionType
                    userType={node.userType}
                    userPath={node.userPath}
                    disabled
                  />
                </div>
                <div className={classes.permissionAllow}>
                  <label>
                    <input
                      disabled
                      defaultChecked={node.allowRead}
                      type='checkbox'
                    />
                    <span>Read</span>
                  </label>
                  <label>
                    <input
                      disabled
                      defaultChecked={node.allowCreate}
                      type='checkbox'
                    />
                    <span>Create</span>
                  </label>
                  <label>
                    <input
                      disabled
                      defaultChecked={node.allowUpdate}
                      type='checkbox'
                    />
                    <span>Update</span>
                  </label>
                  <label>
                    <input
                      disabled
                      defaultChecked={node.allowDelete}
                      type='checkbox'
                    />
                    <span>Delete</span>
                  </label>
                </div>
                <div className={classes.permissionComment}>
                  <input disabled type='text' value={node.comment} placeholder='Comment' />
                </div>
                <div className={classes.permissionDelete}>
                  <span onClick={() => ::this._deletePermission(node)}>
                    <Icon src={require('assets/icons/delete.svg')} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default Relay.createContainer(FieldDetails, {
  fragments: {
    field: () => Relay.QL`
      fragment on Field {
        id
        typeData
        isUnique
        defaultValue
        description
        permissions(first: 100) {
          edges {
            node {
              id
              userType
              userPath
              comment
              allowRead
              allowCreate
              allowUpdate
              allowDelete
            }
          }
        }
      }
    `,
  },
})
