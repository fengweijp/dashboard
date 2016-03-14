import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import mapProps from 'map-props'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Icon from 'components/Icon/Icon'
import classes from './PermissionTab.scss'

const userTypes = {
  NOBODY: 'Nobody',
  GUEST: 'Guest',
  ADMIN: 'Admin',
  USER: 'Logged-In User',
}

export default class PermissionTab extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    fields: PropTypes.array.isRequired,
  };

  constructor (props) {
    super(props)

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)

    this.state = {
    }
  }

  render () {
    const permissions = [{
      id: '2359873',
      userType: 'USER',
      userPath: 'id.model.field',
      allowRead: true,
      allowCreate: true,
      allowUpdate: true,
      allowDelete: true,
    }, {
      id: '2359874',
      userType: 'GUEST',
      userPath: null,
      allowRead: true,
      allowCreate: false,
      allowUpdate: false,
      allowDelete: false,
    }]
    const fields = this.props.fields.map((field) => (
      Object.assign({ permissions }, field)
    ))
    return (
      <div className={classes.root}>
        {fields.map((field) => (
          <div key={field.id} className={classes.field}>
            <span>{field.fieldName}</span>
            <span className={classes.add}>+ Add permission</span>
            {field.permissions.map((permission) => (
              <div key={permission.id} className={classes.permission}>
                <select value={userTypes[permission.userType]}>
                  {Object.keys(userTypes).map((userType) => (
                    <option key={userType}>{userTypes[userType]}</option>
                  ))}
                </select>
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
        ))}
      </div>
    )
  }
}

const MappedPermissionTab = mapProps({
  params: (props) => props.params,
  fields: (props) => props.viewer.model.fields.edges.map((edge) => edge.node),
})(PermissionTab)

export default Relay.createContainer(MappedPermissionTab, {
  initialVariables: {
    modelId: null, // injected from router
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
              }
            }
          }
        }
      }
    `,
  },
})
