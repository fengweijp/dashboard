import Relay from 'react-relay'

export default class DeleteModelMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation{deleteModel}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on DeleteModelPayload {
        project
        deletedId
      }
    `
  }

  getConfigs () {
    return [{
      type: 'NODE_DELETE',
      parentName: 'project',
      parentID: this.props.projectId,
      connectionName: 'models',
      deletedIDFieldName: 'deletedId',
    }]
  }

  getVariables () {
    return {
      modelId: this.props.modelId,
      projectId: this.props.projectId,
    }
  }

  getOptimisticResponse () {
    return {
      deletedId: this.props.modelId,
    }
  }
}
