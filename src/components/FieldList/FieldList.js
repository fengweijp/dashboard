/* @flow */
import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'

const types = {
  'Int': 'Integer',
  'Float': 'Float',
  'String': 'Text',
  'Boolean': 'Boolean',
  'GraphQLID': 'ID'
}

const sortByAttr = (attr) => (a, b) => a[attr].localeCompare(b[attr])

const parseField = (field) => {
  let typeName = field.type.name
  let type = field.type
  let nullable = true
  let list = false
  let relation = false
  if (type.kind === 'NON_NULL') {
    nullable = false
    type = type.ofType
  }
  if (type.kind === 'LIST') {
    list = true
    type = type.ofType
  }
  if (type.kind === 'OBJECT') {
    typeName = type.name
    relation = true
  } else if (type.kind === 'SCALAR') {
    typeName = types[type.name]
  }
  return {
    name: field.name,
    type: typeName,
    relation,
    nullable,
    list,
    unique: false
  }
}

const serializeField = (data) => {
  let innerType = {
    kind: data.relation ? 'OBJECT' : 'SCALAR',
    name: data.type,
    ofType: null
  }

  if (data.list) {
    innerType = {
      kind: 'LIST',
      name: null,
      ofType: innerType
    }
  }

  if (!data.nullable) {
    innerType = {
      kind: 'NON_NULL',
      name: null,
      ofType: innerType
    }
  }

  return {
    name: data.name,
    type: innerType
  }
}

export default class FieldList extends React.Component {
  static propTypes = {
    addField: PropTypes.func.isRequired,
    removeField: PropTypes.func.isRequired,
    schema: PropTypes.object.isRequired,
    models: PropTypes.array
  };

  constructor (props) {
    super(props)
    this.addField = this.addField.bind(this)
  }

  addField () {
    const name = findDOMNode(this.refs.name).value
    const type = JSON.parse(findDOMNode(this.refs.type).value)
    const list = findDOMNode(this.refs.list).checked
    const nullable = findDOMNode(this.refs.nullable).checked
    const unique = findDOMNode(this.refs.unique).checked
    this.props.addField(serializeField({
      type: type.name,
      relation: type.relation,
      name,
      nullable,
      list,
      unique
    }))
    findDOMNode(this.refs.name).value = ''
    findDOMNode(this.refs.list).checked = false
    findDOMNode(this.refs.nullable).checked = false
    findDOMNode(this.refs.unique).checked = false
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
                    <option key={type} value={JSON.stringify({ name: type, relation: false })}>{types[type]}</option>
                  ))}
                  {this.props.models.map((model) => (
                    <option
                      key={model}
                      value={JSON.stringify({ name: model, relation: true })}
                      >
                      Relation - {model}
                    </option>
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
              .map(parseField)
              .sort(sortByAttr('name'))
              .map((field) => (
                <tr key={field.name}>
                  <td>{field.name}</td>
                  <td>{field.type}</td>
                  <td><input disabled checked={field.list} type='checkbox' /></td>
                  <td><input disabled checked={field.nullable} type='checkbox' /></td>
                  <td><input disabled checked={field.unique} type='checkbox' /></td>
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
