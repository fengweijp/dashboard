import Relay from 'react-relay'

export default class UpdatePasswordMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation{updatePassword}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on UpdatePasswordPayload {
        user
      }
    `
  }

  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        user: this.props.userId,
      },
    }]
  }

  getVariables () {
    return {
      oldPassword: this.props.oldPassword,
      newPassword: this.props.newPassword,
    }
  }

  getOptimisticResponse () {
    return {
      user: {
        id: this.props.userId,
        oldPassword: this.props.oldPassword,
        newPassword: this.props.newPassword,
      },
    }
  }
}
