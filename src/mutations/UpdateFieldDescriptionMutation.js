import Relay from 'react-relay'

export default class UpdateFieldDescriptionMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation{updateField}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on UpdateFieldPayload {
        field
      }
    `
  }

  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        field: this.props.fieldId,
      },
    }]
  }

  getVariables () {
    return {
      id: this.props.fieldId,
      description: this.props.description,
    }
  }

  getOptimisticResponse () {
    return {
      field: {
        id: this.props.fieldId,
        description: this.props.description,
      },
    }
  }
}
