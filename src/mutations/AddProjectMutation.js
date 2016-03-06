import Relay from 'react-relay'

export default class AddProjectMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation{addProject}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on AddProjectPayload {
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
      projectName: this.props.projectName,
    }
  }
}
