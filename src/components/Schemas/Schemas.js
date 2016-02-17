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
    schemas: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props)
    this.state = {
      currentSchemaName: Object.keys(props.schemas)[0]
    }

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)

    this._onSelect = this._onSelect.bind(this)
    this._addSchema = this._addSchema.bind(this)
  }

  _onSelect (e) {
    this.setState({ currentSchemaName: e.target.value })
  }

  _addSchema () {
    const schemaName = window.prompt('Schema name')
    this.props.addSchema(schemaName)
  }

  render () {
    const addField = (field) => this.props.addFieldToSchema(this.state.currentSchemaName, field)
    const removeField = (fieldName) => this.props.removeFieldFromSchema(this.state.currentSchemaName, fieldName)

    return (
      <div className={classes.root}>
        <p className={`control ${classes.select}`}>
          <label>Select Schema</label>
          <span className='select'>
            <select ref='schema' onChange={this._onSelect} value={this.state.currentSchemaName}>
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
          schema={this.props.schemas[this.state.currentSchemaName]}
          addField={addField}
          removeField={removeField}
          />
      </div>
    )
  }
}
