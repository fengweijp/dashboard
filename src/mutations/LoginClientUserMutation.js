import Relay from 'react-relay'

export default class LoginMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation{signinClientUser}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on SigninClientUserPayload {
        token
      }
    `
  }

  getConfigs () {
    return [{
      type: 'REQUIRED_CHILDREN',
      children: [Relay.QL`
        fragment on SigninClientUserPayload {
          token
        }
      `],
    }]
  }

  getVariables () {
    return {
      clientUserId: this.props.clientUserId,
      projectId: this.props.projectId,
    }
  }
}
