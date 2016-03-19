import Relay from 'react-relay'

export default class ResetProjectMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation{resetProject}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on ResetProjectPayload {
        viewer
      }
    `
  }

  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        viewer: 'cryptic',
      },
    }]
  }

  getVariables () {
    return {
      projectId: this.props.projectId,
    }
  }
}
