import Relay from 'react-relay'

export default class AddFieldMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation{addField}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on AddFieldPayload {
        fieldEdge
        model
      }
    `
  }

  getConfigs () {
    return [{
      type: 'RANGE_ADD',
      parentName: 'model',
      parentID: this.props.modelId,
      connectionName: 'fields',
      edgeName: 'fieldEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }]
  }

  getVariables () {
    return {
      modelId: this.props.modelId,
      projectId: this.props.projectId, // TODO remove redundancy
      fieldName: this.props.fieldName,
      typeIdentifier: this.props.typeIdentifier,
      enumValues: this.props.enumValues,
      isRequired: this.props.isRequired,
      isList: this.props.isList,
      isUnique: false,
      defaultValue: this.props.defaultValue,
    }
  }
}
