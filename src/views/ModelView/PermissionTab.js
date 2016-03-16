import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import mapProps from 'map-props'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import NewPermissionOverlay from 'components/NewPermissionOverlay/NewPermissionOverlay'
import AddPermissionMutation from 'mutations/AddPermissionMutation'
import DeletePermissionMutation from 'mutations/DeletePermissionMutation'
import Icon from 'components/Icon/Icon'
import classes from './PermissionTab.scss'

const userTypes = {
  GUEST: 'Guest',
  AUTHENTICATED: 'Authenticated User',
  RELATED: 'Related',
}

class PermissionRow extends React.Component {
  static propTypes = {
    field: PropTypes.object.isRequired,
    availableUserRoles: PropTypes.array.isRequired,
  };

  constructor (props) {
    super(props)

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)

    this._toggleOverlay = ::this._toggleOverlay
    this._addPermission = ::this._addPermission
    this._deletePermission = ::this._deletePermission

    this.state = {
      overlayVisibile: false,
    }
  }

  _toggleOverlay () {
    this.setState({ overlayVisibile: !this.state.overlayVisibile })
  }

  _addPermission (data) {
    Relay.Store.commitUpdate(new AddPermissionMutation({
      fieldId: this.props.field.id,
      ...data,
    }))
  }

  _deletePermission (permission) {
    if (window.confirm('Do you really want to delete this permission')) {
      Relay.Store.commitUpdate(new DeletePermissionMutation({
        fieldId: this.props.field.id,
        permissionId: permission.id,
      }))
    }
  }

  render () {
    const field = this.props.field
    return (
      <div className={classes.field}>
        {this.state.overlayVisibile &&
          <NewPermissionOverlay
            fieldId={field.id}
            hide={this._toggleOverlay}
            add={this._addPermission}
            availableUserRoles={this.props.availableUserRoles}
            />
        }
        <span>{field.fieldName}</span>
        <span className={classes.add} onClick={this._toggleOverlay}>+ Add permission</span>
        {field.permissions.edges.map(({ node: permission }) => (
          <div key={permission.id} className={classes.permission}>
            <select value={permission.userType}>
              {Object.keys(userTypes).map((userType) => (
                <option key={userType} value={userType}>{userTypes[userType]}</option>
              ))}
            </select>
            <span>
              {permission.userPath}
            </span>
            <span>
              {permission.userRole}
            </span>
            <span className={classes.allow}>
              <label>
                <input type='checkbox' checked={permission.allowRead} />
                Read
              </label>
              <label>
                <input type='checkbox' checked={permission.allowCreate} />
                Create
              </label>
              <label>
                <input type='checkbox' checked={permission.allowUpdate} />
                Update
              </label>
              <label>
                <input type='checkbox' checked={permission.allowDelete} />
                Delete
              </label>
            </span>
            <span onClick={() => this._deletePermission(permission)}>
              <Icon src={require('assets/icons/delete.svg')} />
            </span>
          </div>
        ))}
      </div>
    )
  }
}

export default class PermissionTab extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    fields: PropTypes.array.isRequired,
    availableUserRoles: PropTypes.array.isRequired,
  };

  constructor (props) {
    super(props)

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }

  render () {
    return (
      <div className={classes.root}>
        {this.props.fields.map((field) => (
          <PermissionRow
            availableUserRoles={this.props.availableUserRoles}
            key={field.id}
            field={field}
            />
        ))}
      </div>
    )
  }
}

const MappedPermissionTab = mapProps({
  params: (props) => props.params,
  fields: (props) => props.viewer.model.fields.edges.map((edge) => edge.node),
  availableUserRoles: (props) => props.viewer.project.availableUserRoles,
})(PermissionTab)

export default Relay.createContainer(MappedPermissionTab, {
  initialVariables: {
    modelId: null, // injected from router
    projectId: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        model(id: $modelId) {
          id
          name
          fields(first: 100) {
            edges {
              node {
                id
                fieldName
                permissions(first: 100) {
                  edges {
                    node {
                      id
                      userType
                      userPath
                      allowRead
                      allowCreate
                      allowUpdate
                      allowDelete
                    }
                  }
                }
              }
            }
          }
        }
        project(id: $projectId) {
          availableUserRoles
        }
      }
    `,
  },
})
