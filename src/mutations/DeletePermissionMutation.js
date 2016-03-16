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
      deletedIDFieldName: 'deletedId',
    }]
  }

  getVariables () {
    return {
      permissionId: this.props.permissionId,
    }
  }

  getOptimisticResponse () {
    return {
      deletedId: this.props.permissionId,
    }
  }
}
