import React, { PropTypes } from 'react'
import Cell from './Cell'
import classes from './Row.scss'

export default class Row extends React.Component {

  static propTypes = {
    fields: PropTypes.array.isRequired,
    item: PropTypes.object.isRequired,
    columnWidths: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired,
  }

  render () {
    return (
      <div className={classes.root}>
        {this.props.fields.map((field) => (
          <Cell
            key={field.id}
            field={field}
            value={this.props.item[field.fieldName]}
            width={this.props.columnWidths[field.fieldName]}
            update={this.props.update}
          />
        ))}
      </div>
    )
  }
}
