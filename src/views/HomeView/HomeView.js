/* @flow */
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import {
  fetchSchemas,
  addSchema,
  addFieldToSchema,
  removeFieldFromSchema,
  publishSchemas
} from '../../redux/modules/schemas'
import Schemas from '../../components/Schemas/Schemas'
//import classes from './HomeView.scss'

export class HomeView extends React.Component {
  static propTypes = {
    addSchema: PropTypes.func.isRequired,
    addFieldToSchema: PropTypes.func.isRequired,
    fetchOnDidMount: PropTypes.func.isRequired,
    schemas: PropTypes.object.isRequired
  };

  componentDidMount () {
    this.props.fetchOnDidMount()
  }

  render () {
    if (Object.keys(this.props.schemas).length === 0) {
      return false
    }

    return (
      <Schemas
        schemas={this.props.schemas}
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
      dispatch(fetchSchemas())
    },
    addSchema: (schemaName) => {
      dispatch(addSchema(schemaName))
      dispatch(publishSchemas())
    },
    addFieldToSchema: (schemaName, field) => {
      dispatch(addFieldToSchema(schemaName, field))
      dispatch(publishSchemas())
    },
    removeFieldFromSchema: (schemaName, fieldName) => {
      dispatch(removeFieldFromSchema(schemaName, fieldName))
      dispatch(publishSchemas())
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(HomeView)
