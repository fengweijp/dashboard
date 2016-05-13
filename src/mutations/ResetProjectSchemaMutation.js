import Relay from 'react-relay'

export default class ResetProjectSchemaMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation{resetProjectSchema}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on ResetProjectSchemaPayload {
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
