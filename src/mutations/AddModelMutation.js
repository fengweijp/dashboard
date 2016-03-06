import Relay from 'react-relay'

export default class AddModelMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation{addModel}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on AddModelPayload {
        viewer {
          user {
            projects
          }
        }
      }
    `
  }

  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        user: this.props.user.id,
      },
    }]
  }

  getVariables () {
    return {
      modelName: this.props.modelName,
      projectId: this.props.projectId,
    }
  }
}
