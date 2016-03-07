import Relay from 'react-relay'

export default class AddFieldMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation{addField}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on AddFieldPayload {
        model
      }
    `
  }

  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        model: this.props.model.id,
      },
    }]
  }

  getVariables () {
    return {
      modelName: this.props.model.name,
      fieldName: this.props.fieldName,
      typeIdentifier: this.props.typeIdentifier,
      isRequired: this.props.isRequired,
      isList: this.props.isList,
      isUnique: this.props.isUnique,
    }
  }
}
