import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { connect } from 'react-redux'
import Schemas from 'components/Schemas/Schemas'
import {
  addFieldToSchema,
  removeFieldFromSchema,
  publishSchemas
} from 'redux/modules/schemas'
import classes from './SchemaView.scss'

export class SchemaView extends React.Component {
  static propTypes = {
    addFieldToSchema: PropTypes.func.isRequired,
    removeFieldFromSchema: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    schemas: PropTypes.object.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  render () {
    if (Object.keys(this.props.schemas).length === 0) {
      return (
        <h2>Loading</h2>
      )
    }

    return (
      <div>
        <div>
          <Link to={`/${this.props.params.project}/models/${this.props.params.model}/schema`} activeClassName={classes.active}>Schema</Link>
          <span> </span>
          <Link to={`/${this.props.params.project}/models/${this.props.params.model}/data`} activeClassName={classes.active}>Data</Link>
        </div>
        <div>
          <Schemas
            schema={this.props.schemas[this.props.params.model]}
            addFieldToSchema={this.props.addFieldToSchema}
            removeFieldFromSchema={this.props.removeFieldFromSchema}
            />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  schemas: state.schemas.toJS()
})
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
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
export default connect(mapStateToProps, mapDispatchToProps)(SchemaView)
