import Relay from 'react-relay'

export default class LoginMutation extends Relay.Mutation {

  static fragments = {
    viewer: () => Relay.QL`
      fragment on User {
        id
        name
      }
    `,
  }

  getMutation () {
    return Relay.QL`mutation{signinUser}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on SigninUserPayload {
        user {
          id
          projects {
            name
          }
        }
      }
    `
  }

  getConfigs () {
    const query = Relay.QL`
      fragment on SigninUserPayload {
        token
        user {
          id
          projects {
            name
          }
        }
      }
    `
    return [{
      type: 'REQUIRED_CHILDREN',
      children: [query]
    }]
  }

  getVariables () {
    return {
      email: this.props.email,
      password: this.props.password
    }
  }
}
