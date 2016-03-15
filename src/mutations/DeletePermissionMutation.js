import Relay from 'react-relay'

export default class DeletePermissionMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation{deletePermission}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on DeletePermissionPayload {
        field
        deletedId
      }
    `
  }

  getConfigs () {
    return [{
      type: 'NODE_DELETE',
      parentName: 'field',
      parentID: this.props.fieldId,
      connectionName: 'permissions',
      deletedIDPermissionName: 'deletedId',
    }]
  }

  getVariables () {
    return {
      fieldId: this.props.fieldId,
      permissionId: this.props.permissionId,
    }
  }
}
