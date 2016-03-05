import Relay from 'react-relay'

export default class LoginMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation{signinUser}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on SigninUserPayload {
        viewer {
          user
        }
      }
    `
  }

  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        viewer: this.props.viewer.id,
      },
    }, {
      type: 'REQUIRED_CHILDREN',
      children: [Relay.QL`
        fragment on SigninUserPayload {
          token
        }
      `],
    }]
  }

  getVariables () {
    return {
      email: this.props.email,
      password: this.props.password,
    }
  }
}
