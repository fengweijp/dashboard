import Relay from 'react-relay'

export default class AddPermissionMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation{addPermission}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on AddPermissionPayload {
        permissionEdge
        model
      }
    `
  }

  getConfigs () {
    return [{
      type: 'RANGE_ADD',
      parentName: 'model',
      parentID: this.props.modelId,
      connectionName: 'permissions',
      edgeName: 'permissionEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }]
  }

  getVariables () {
    return {
      modelId: this.props.modelId,
      projectId: this.props.projectId, // TODO remove redundancy
      permissionName: this.props.permissionName,
      typeIdentifier: this.props.typeIdentifier,
      isRequired: this.props.isRequired,
      isList: this.props.isList,
      isUnique: this.props.isUnique,
    }
  }
}
