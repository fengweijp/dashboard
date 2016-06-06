import React, { PropTypes } from 'react'
import NewCell from './NewCell'
import classes from './NewRow.scss'

function browserDefaultValue (field) {
  if (field.defaultValue) {
    return field.defaultValue
  }

  switch (field.typeIdentifier) {
    case 'String': return ''
    case 'Int': return 0
    case 'Float': return 0
    case 'Boolean': return false
    case 'Enum': return field.enumValues[0]
    default: return null
  }
}

export default class NewRow extends React.Component {

  static propTypes = {
    fields: PropTypes.array.isRequired,
    columnWidths: PropTypes.object.isRequired,
    add: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
  }

  constructor (props) {
    super(props)

    const fieldValues = props.fields
      .filter((f) => f.fieldName !== 'id')
      .mapToObject(
        (field) => field.fieldName,
        (field) => ({
          field,
          value: browserDefaultValue(field),
        })
      )

    this.state = {
      fieldValues,
    }
  }

  _add () {
    const allRequiredFieldsGiven = this.state.fieldValues
      .mapToArray((fieldName, obj) => obj)
      .reduce((acc, { field, value }) => acc && (value !== null || !field.isRequired), true)

    if (allRequiredFieldsGiven) {
      this.props.add(this.state.fieldValues)
    }
  }

  _update (value, field) {
    const { fieldValues } = this.state
    fieldValues[field.fieldName].value = value
    this.setState({ fieldValues })
  }

  render () {
    const firstAutoFocusField = this.props.fields.find(({ typeIdentifier }) => (
      ['String', 'Float', 'Integer', 'Enum'].includes(typeIdentifier)
    ))

    return (
      <div className={classes.root}>
        <div className={classes.empty} />
        {this.props.fields.map((field) => (
          <NewCell
            key={field.id}
            field={field}
            width={this.props.columnWidths[field.fieldName]}
            update={::this._update}
            submit={::this._add}
            autoFocus={firstAutoFocusField === field}
            defaultValue={browserDefaultValue(field)}
            cancel={this.props.cancel}
          />
        ))}
      </div>
    )
  }
}
