import Relay from 'react-relay'

export default class AddPermissionMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation{addPermission}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on AddPermissionPayload {
        permissionEdge
        field
      }
    `
  }

  getConfigs () {
    return [{
      type: 'RANGE_ADD',
      parentName: 'field',
      parentID: this.props.fieldId,
      connectionName: 'permissions',
      edgeName: 'permissionEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }]
  }

  getVariables () {
    return {
      fieldId: this.props.fieldId,
      userType: this.props.userType,
      userPath: this.props.userPath,
      allowRead: this.props.allowRead,
      allowCreate: this.props.allowCreate,
      allowUpdate: this.props.allowUpdate,
      allowDelete: this.props.allowDelete,
    }
  }
}
