import Relay from 'react-relay'

export default class DeleteFieldMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation{deleteField}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on DeleteFieldPayload {
        model
        deletedId
      }
    `
  }

  getConfigs () {
    return [{
      type: 'NODE_DELETE',
      parentName: 'model',
      parentID: this.props.modelId,
      connectionName: 'fields',
      deletedIDFieldName: 'deletedId',
    }]
  }

  getVariables () {
    return {
      fieldId: this.props.fieldId,
      projectId: this.props.projectId, // TODO remove redundancy
      modelId: this.props.modelId, // TODO remove redundancy
    }
  }
}
