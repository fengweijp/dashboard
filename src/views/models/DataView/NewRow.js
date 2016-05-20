import React, { PropTypes } from 'react'
import NewCell from './NewCell'
import classes from './NewRow.scss'

export default class NewRow extends React.Component {

  static propTypes = {
    fields: PropTypes.array.isRequired,
    columnWidths: PropTypes.object.isRequired,
    add: PropTypes.func.isRequired,
  }

  constructor (props) {
    super(props)

    const fieldValues = props.fields
      .filter((f) => f.fieldName !== 'id')
      .mapToObject(
        (field) => field.fieldName,
        (field) => ({
          field,
          value: null,
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
    return (
      <div className={classes.root}>
        {this.props.fields.map((field, i) => (
          <NewCell
            key={field.id}
            field={field}
            width={this.props.columnWidths[field.fieldName]}
            update={::this._update}
            submit={::this._add}
            index={i}
          />
        ))}
      </div>
    )
  }
}
