import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import FieldList from 'components/FieldList/FieldList'
import classes from './SchemaView.scss'

export default class SchemaView extends React.Component {
  static propTypes = {
    addFieldToSchema: PropTypes.func.isRequired,
    removeFieldFromSchema: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    schemas: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props)

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }

  render () {
    if (Object.keys(this.props.schemas).length === 0) {
      return (
        <h2>Loading</h2>
      )
    }

    const schema = this.props.schemas[this.props.params.model]
    const addField = (field) => this.props.addFieldToSchema(schema.name, field)
    const removeField = (fieldName) => this.props.removeFieldFromSchema(schema.name, fieldName)

    return (
      <div>
        <div>
          <Link
            to={`/${this.props.params.project}/models/${this.props.params.model}/schema`}
            activeClassName={classes.active}
            >
            Schema
          </Link>
          <span> </span>
          <Link
            to={`/${this.props.params.project}/models/${this.props.params.model}/data`}
            activeClassName={classes.active}
            >
            Data
          </Link>
        </div>
        <div>
          <FieldList
            models={Object.keys(this.props.schemas)}
            schema={schema}
            addField={addField}
            removeField={removeField}
            />
        </div>
      </div>
    )
  }
}
