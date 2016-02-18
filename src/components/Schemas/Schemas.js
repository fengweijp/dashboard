/* @flow */
import React, { PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import FieldList from 'components/FieldList/FieldList'
import classes from './Schemas.scss'

export default class Schemas extends React.Component {
  static propTypes = {
    addFieldToSchema: PropTypes.func.isRequired,
    addSchema: PropTypes.func.isRequired,
    removeFieldFromSchema: PropTypes.func.isRequired,
    schemas: PropTypes.object.isRequired,
    updateCurrentSchemaName: PropTypes.func.isRequired,
    currentSchemaName: PropTypes.string.isRequired
  };

  constructor (props) {
    super(props)

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)

    this._onSelect = this._onSelect.bind(this)
    this._addSchema = this._addSchema.bind(this)
  }

  _onSelect (e) {
    this.props.updateCurrentSchemaName(e.target.value)
  }

  _addSchema () {
    const schemaName = window.prompt('Schema name')
    if (schemaName) {
      this.props.addSchema(schemaName)
    }
  }

  render () {
    const addField = (field) => this.props.addFieldToSchema(this.props.currentSchemaName, field)
    const removeField = (fieldName) => this.props.removeFieldFromSchema(this.props.currentSchemaName, fieldName)

    return (
      <div className={classes.root}>
        <p className={`control ${classes.select}`}>
          <label>Select Schema</label>
          <span className='select'>
            <select onChange={this._onSelect} value={this.props.currentSchemaName}>
              {Object.keys(this.props.schemas).map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </span>
          <span onClick={this._addSchema}>
            <i className='fa fa-plus'></i>
          </span>
        </p>
        <FieldList
          schema={this.props.schemas[this.props.currentSchemaName]}
          addField={addField}
          removeField={removeField}
          />
      </div>
    )
  }
}
