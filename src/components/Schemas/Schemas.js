import React, { PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import FieldList from 'components/FieldList/FieldList'
import classes from './Schemas.scss'

export default class Schemas extends React.Component {
  static propTypes = {
    addFieldToSchema: PropTypes.func.isRequired,
    removeFieldFromSchema: PropTypes.func.isRequired,
    schema: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props)

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }

  render () {
    const addField = (field) => this.props.addFieldToSchema(this.props.schema.name, field)
    const removeField = (fieldName) => this.props.removeFieldFromSchema(this.props.schema.name, fieldName)

    return (
      <div className={classes.root}>
        <FieldList
          schema={this.props.schema}
          addField={addField}
          removeField={removeField}
          />
      </div>
    )
  }
}
