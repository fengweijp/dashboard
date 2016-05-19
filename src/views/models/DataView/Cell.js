import React, { PropTypes } from 'react'
import { isScalar } from 'utils/graphql'
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

export default class Cell extends React.Component {

  static propTypes = {
    field: PropTypes.object.isRequired,
    value: PropTypes.any,
    width: PropTypes.number.isRequired,
  }

  static valueToString = (value, field) => {
    let str = 'null'
    const fieldValue = isScalar(field.typeIdentifier)
      ? valueOrDefault(value, field)
      : (value !== null ? value.id : null)

    if (fieldValue !== null) {
      str = field.isList
        ? `[${field.typeIdentifier === 'String'
          ? fieldValue.map((e) => `"${e}"`).toString()
          : fieldValue.toString()}]`
        : fieldValue.toString()
    }

    return str
  }

  render () {
    const { value, width, field } = this.props

    const valueString = Cell.valueToString(value, field)

    return (
      <div style={{ width }} className={`${classes.root} ${value === null ? classes.null : ''}`}>
        {valueString}
      </div>
    )
  }
}
