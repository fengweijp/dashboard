import Relay from 'react-relay'

export default class UpdateProjectMutation extends Relay.Mutation {
  static fragments = {
    project: () => Relay.QL`
      fragment on Project {
        id,
        name,
        webhookUrl
      }
    `,
  };

  getMutation () {
    return Relay.QL`mutation{updateProject}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on UpdateProjectPayload {
        project {
          id
          name
          webhookUrl
        }
      }
    `
  }

  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        project: this.props.project.id,
      },
    }]
  }

  getVariables () {
    return {
      id: this.props.project.id,
      name: this.props.name,
      webhookUrl: this.props.webhookUrl,
    }
  }

  getOptimisticResponse () {
    return {
      project: {
        id: this.props.project.id,
        name: this.props.name,
        webhookUrl: this.props.webhookUrl,
      },
    }
  }
}
