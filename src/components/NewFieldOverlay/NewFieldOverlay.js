import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import TagsInput from 'react-tagsinput'
import classes from './NewFieldOverlay.scss'

import 'react-tagsinput/react-tagsinput.css'

const types = {
  'Int': 'Integer',
  'Float': 'Float',
  'Boolean': 'Boolean',
  'String': 'Text',
  'GraphQLID': 'ID',
  'Enum': 'Enum',
}

export default class NewFieldOverlay extends React.Component {

  static propTypes = {
    modelNames: PropTypes.array.isRequired,
    hide: PropTypes.func.isRequired,
    add: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props)

    this.state = {
      typeIdentifier: Object.keys(types)[0],
      enumValues: [],
    }
  }

  componentDidMount () {
    findDOMNode(this.refs.fieldName).focus()
  }

  _addField () {
    const fieldName = findDOMNode(this.refs.fieldName).value
    const typeIdentifier = findDOMNode(this.refs.typeIdentifier).value
    const enumValues = this.state.enumValues
    const isList = findDOMNode(this.refs.isList).checked
    const isRequired = findDOMNode(this.refs.isRequired).checked
    const isUnique = findDOMNode(this.refs.isUnique).checked

    this.props.add({
      fieldName,
      typeIdentifier,
      enumValues,
      isList,
      isRequired,
      isUnique,
    })

    this.props.hide()
  }

  _listenForEnter (e) {
    if (e.keyCode === 13) {
      this._addField()
    }
  }

  _onEnumChange (enumValues) {
    this.setState({ enumValues })
  }

  _onSelectTypeIdentifier (e) {
    this.setState({ typeIdentifier: e.target.value })
  }

  render () {
    return (
      <div className={classes.background}>
        <div className={classes.container}>
          <div className={classes.head}>Add new field</div>
          <input
            ref='fieldName'
            className={classes.fieldNameInput}
            type='text'
            onKeyDown={::this._listenForEnter}
            placeholder='Choose a good name'
            />
          <select
            onChange={::this._onSelectTypeIdentifier}
            ref='typeIdentifier'
            className={classes.typeSelect}
            >
            {Object.keys(types).map((type) => (
              <option key={type} value={type}>{types[type]}</option>
            ))}
            {this.props.modelNames.map((modelName) => (
              <option key={modelName} value={modelName}>{modelName}</option>
            ))}
          </select>
          {this.state.typeIdentifier === 'Enum' &&
            <TagsInput
              value={this.state.enumValues}
              onlyUnique
              addOnBlur
              onChange={::this._onEnumChange}
              />
          }
          <div className={classes.section}>
            <div className={classes.check}>
              <label>
                <input ref='isList' type='checkbox' />
                <span className={classes.checkWord}>List</span><br />
                <span className={classes.checkDescription}>
                  Should this field be a list of values or a single value?
                </span>
              </label>
            </div>
            <div className={classes.check}>
              <label>
                <input ref='isRequired' defaultChecked type='checkbox' />
                <span className={classes.checkWord}>Required</span><br />
                <span className={classes.checkDescription}>Is this property always needed?</span>
              </label>
            </div>
            <div className={classes.check}>
              <label>
                <input ref='isUnique' type='checkbox' />
                <span className={classes.checkWord}>Unique</span><br />
                <span className={classes.checkDescription}>Check if every data item need to be different
                respecting this property</span>
              </label>
            </div>
          </div>
          <div onClick={this.props.hide} className={classes.buttonCancel}>Cancel</div>
          <div onClick={::this._addField} className={classes.buttonSubmit}>Add</div>
        </div>
      </div>
    )
  }
}
