import Relay from 'react-relay'

export default class UpdateUserMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation{updateUser}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on UpdateUserPayload {
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
      gettingStartedStatus: this.props.gettingStartedStatus,
    }
  }

  getOptimisticResponse () {
    return {
      user: {
        id: this.props.userId,
        gettingStartedStatus: this.props.gettingStartedStatus,
      },
    }
  }
}
