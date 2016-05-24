import Relay from 'react-relay'

export default class UpdateFieldDescriptionMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation{updateModel}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on UpdateModelPayload {
        model
      }
    `
  }

  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        model: this.props.modelId,
      },
    }]
  }

  getVariables () {
    return {
      id: this.props.modelId,
      description: this.props.description,
    }
  }

  getOptimisticResponse () {
    return {
      model: {
        id: this.props.modelId,
        description: this.props.description,
      },
    }
  }
}
