import Relay from 'react-relay'

export default class ResetProjectDataMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation{resetProjectData}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on ResetProjectDataPayload {
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
