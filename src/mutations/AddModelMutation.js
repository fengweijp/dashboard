import Relay from 'react-relay'

export default class AddModelMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation{addModel}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on AddModelPayload {
        modelEdge
        project
      }
    `
  }

  getConfigs () {
    return [{
      type: 'RANGE_ADD',
      parentName: 'project',
      parentID: this.props.projectId,
      connectionName: 'models',
      edgeName: 'modelEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }]
  }

  getVariables () {
    return {
      projectId: this.props.projectId,
      modelName: this.props.modelName,
    }
  }
}
