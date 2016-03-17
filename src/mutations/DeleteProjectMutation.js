import Relay from 'react-relay'

export default class DeleteProjectMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation{deleteProject}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on DeleteProjectPayload {
        viewer
        deletedId
      }
    `
  }

  getConfigs () {
    return [{
      type: 'NODE_DELETE',
      parentName: 'viewer',
      parentID: this.props.viewerId,
      connectionName: 'projects',
      deletedIDFieldName: 'deletedId',
    }]
  }

  getVariables () {
    return {
      projectId: this.props.projectId,
    }
  }

  getOptimisticResponse () {
    return {
      deletedId: this.props.projectId,
    }
  }
}
