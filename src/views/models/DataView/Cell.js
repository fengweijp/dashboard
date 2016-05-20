import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import { isScalar, isValidValueForType } from 'utils/graphql'
import Loading from 'react-loading'
import classnames from 'classnames'
import classes from './Cell.scss'

function valueOrDefault (value, field) {
  if (value !== null && value !== undefined) {
    return value
  }
  if (field.defaultValue !== undefined) {
    return field.defaultValue
  }
  return null
}

export function valueToString (value, field) {
  const fieldValue = isScalar(field.typeIdentifier)
    ? valueOrDefault(value, field)
    : (value !== null ? value.id : null)

  if (fieldValue === null) {
    return 'null'
  }

  if (field.isList) {
    if (field.typeIdentifier === 'String') {
      return `[${fieldValue.map((e) => `"${e}"`).toString()}]`
    } else {
      return `[${fieldValue.toString()}]`
    }
  } else {
    return fieldValue.toString()
  }
}

function valueToGQL (value, field) {
  if (field.typeIdentifier === 'Enum') {
    return value
  } else {
    return JSON.stringify(value)
  }
}

function stringToValue (rawValue, field) {
  if (rawValue === '') {
    // todo: this should set to null but currently null is not supported by our api
    return field.isRequired ? '' : null
  }

  if (field.isList) {
    return JSON.parse(rawValue)
  } else {
    switch (field.typeIdentifier) {
      case 'Int': return parseInt(rawValue, 10)
      case 'Float': return parseFloat(rawValue)
      case 'Boolean': return rawValue.toLowerCase() === 'true'
      default: return rawValue
    }
  }
}

export default class Cell extends React.Component {

  static propTypes = {
    field: PropTypes.object.isRequired,
    value: PropTypes.any,
    width: PropTypes.number.isRequired,
    update: PropTypes.func.isRequired,
  }

  constructor (props) {
    super(props)

    this.state = {
      editing: false,
      loading: false,
      value: props.value,
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (!prevState.editing && this.state.editing) {
      findDOMNode(this.refs.input).select()
    }
  }

  _startEditing () {
    if (this.props.field.fieldName !== 'id' && isScalar(this.props.field.typeIdentifier)) {
      this.setState({ editing: true })
    }
  }

  _isValidValue (value) {
    let { field } = this.props
    if (value === '' && !field.isRequired) {
      return true
    }
    if (field.isList) {
      if (value === '[]') {
        return true
      }
      if (value[0] !== '[' || value[value.length-1] !== ']') {
        return false
      } else {
        value = value.substring(1, value.length - 1)
      }
    }

    let invalidValue = (field.isList ? value.split(',').map((x) => x.trim()) : [value]).forEach((value) => {
      if (!isValidValueForType(value, isScalar(field.typeIdentifier) ? field.typeIdentifier : 'GraphQLID')) {
        invalidValue = true
        return
      }
    })

    return !invalidValue
  }

  _save (inputValue) {
    const { field } = this.props

    if (!this._isValidValue(inputValue)) {
      alert(`'${inputValue}' is not a valid value for field ${field.fieldName}`)
      return
    }

    const value = stringToValue(inputValue, field)

    if (value === this.state.value) {
      this.setState({
        editing: false,
      })
      return
    }

    this.setState({
      loading: true,
    })

    const key = isScalar(field.typeIdentifier) ? field.fieldName : `${field.fieldName}Id`
    this.props.update(key, valueToGQL(value, field), (success) => {
      this.setState({
        editing: false,
        loading: false,
        value: success ? value : this.state.value,
      })
    })
  }

  _listenForEnter (e) {
    if (e.keyCode === 13) {
      this._save(e.target.value)
    }
  }

  _renderContent () {
    if (this.state.loading) {
      return (
        <div className={classes.loading}>
          <Loading type='bubbles' delay={0} color='#B9B9C8' />
        </div>
      )
    }

    const valueString = valueToString(this.state.value, this.props.field)

    if (this.state.editing) {
      return (
        <input
          autoFocus
          type='text'
          ref='input'
          defaultValue={valueString}
          onKeyDown={::this._listenForEnter}
          onBlur={(e) => this._save(e.target.value)}
        />
      )
    }

    return (
      <span>{valueString}</span>
    )
  }

  render () {
    const { width } = this.props
    const { value } = this.state

    const rootClassnames = classnames({
      [classes.root]: true,
      [classes.null]: value === null,
      [classes.editing]: this.state.editing,
    })

    return (
      <div
        style={{ width }}
        className={rootClassnames}
        onDoubleClick={::this._startEditing}
      >
        {this._renderContent()}
      </div>
    )
  }
}
