/* @flow */
import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'

const types = {
  'Int': 'Integer',
  'Float': 'Float',
  'String': 'String',
  'Boolean': 'Boolean',
  'GraphQLID': 'ID'
}

const sortByAttr = (attr) => (a, b) => a[attr].localeCompare(b[attr])

export default class FieldList extends React.Component {
  static propTypes = {
    addField: PropTypes.func.isRequired,
    removeField: PropTypes.func.isRequired,
    schema: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props)
    this.addField = this.addField.bind(this)
  }

  addField () {
    const name = findDOMNode(this.refs.name).value
    const type = findDOMNode(this.refs.type).value
    // const list = findDOMNode(this.refs.list).checked
    // const nullable = findDOMNode(this.refs.nullable).checked
    // const unique = findDOMNode(this.refs.unique).checked
    this.props.addField({
      name: name,
      type: {
        name: type,
        kind: 'SCALAR',
        ofType: null
      }
    })
    findDOMNode(this.refs.name).value = ''
  }

  render () {
    return (
      <table className='table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>List</th>
            <th>Nullable</th>
            <th>Unique</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input className='input' ref='name' type='text' placeholder='Name' /></td>
            <td>
              <span className='select'>
                <select ref='type'>
                  {Object.keys(types).map((type) => (
                    <option key={type} value={type}>{types[type]}</option>
                  ))}
                </select>
              </span>
            </td>
            <td><input ref='list' type='checkbox' /></td>
            <td><input ref='nullable' type='checkbox' /></td>
            <td><input ref='unique' type='checkbox' /></td>
            <td className='table-link table-icon'>
              <span onClick={this.addField}>
                <i className='fa fa-plus'></i>
              </span>
            </td>
          </tr>
          {
            this.props.schema.fields
              .sort(sortByAttr('name'))
              .map((field) => (
                <tr key={field.name}>
                  <td>{field.name}</td>
                  <td>{types[field.type.name]}</td>
                  <td><input disabled type='checkbox' /></td>
                  <td><input disabled type='checkbox' /></td>
                  <td><input disabled type='checkbox' /></td>
                  <td className='table-link table-icon'>
                    <span onClick={() => this.props.removeField(field.name)}>
                      <i className='fa fa-minus'></i>
                    </span>
                  </td>
                </tr>
              )
            )
          }
        </tbody>
      </table>
    )
  }
}
