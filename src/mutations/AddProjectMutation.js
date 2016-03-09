import Relay from 'react-relay'

export default class AddProjectMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation{addProject}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on AddProjectPayload {
        projectEdge
        user
      }
    `
  }

  getConfigs () {
    return [{
      type: 'RANGE_ADD',
      parentName: 'user',
      parentID: this.props.userId,
      connectionName: 'projects',
      edgeName: 'projectEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }]
  }

  getVariables () {
    return {
      name: this.props.projectName,
    }
  }
}
