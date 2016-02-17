/* @flow */
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Schemas from 'components/Schemas/Schemas'
import {
  fetchSchemas,
  addSchema,
  addFieldToSchema,
  removeFieldFromSchema,
  publishSchemas
} from 'redux/modules/schemas'

export class HomeView extends React.Component {
  static propTypes = {
    addSchema: PropTypes.func.isRequired,
    addFieldToSchema: PropTypes.func.isRequired,
    removeFieldFromSchema: PropTypes.func.isRequired,
    fetchOnDidMount: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    schemas: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  componentDidMount () {
    this.props.fetchOnDidMount()
  }

  componentWillReceiveProps (nextProps) {
    const schemaNames = Object.keys(nextProps.schemas)
    if (schemaNames.length > 0 && !schemaNames.includes(nextProps.params.schema)) {
      nextProps.history.replace(`/${nextProps.params.project}/schemas/${schemaNames[0]}`)
    }
  }

  render () {
    if (Object.keys(this.props.schemas).length === 0) {
      return false
    }

    return (
      <Schemas
        schemas={this.props.schemas}
        currentSchemaName={this.props.params.schema}
        updateCurrentSchemaName={(schemaName) => (
          this.props.history.push(`/${this.props.params.project}/schemas/${schemaName}`)
        )}
        addSchema={this.props.addSchema}
        addFieldToSchema={this.props.addFieldToSchema}
        removeFieldFromSchema={this.props.removeFieldFromSchema}
        />
    )
  }
}

const mapStateToProps = (state) => ({
  schemas: state.schemas.toJS()
})
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchOnDidMount: () => {
      dispatch(fetchSchemas(ownProps.params.project))
    },
    addSchema: (schemaName) => {
      dispatch(addSchema(schemaName))
      dispatch(publishSchemas())
    },
    addFieldToSchema: (schemaName, field) => {
      dispatch(addFieldToSchema(schemaName, field))
      dispatch(publishSchemas(ownProps.params.project))
    },
    removeFieldFromSchema: (schemaName, fieldName) => {
      dispatch(removeFieldFromSchema(schemaName, fieldName))
      dispatch(publishSchemas(ownProps.params.project))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(HomeView)
