import React, { PropTypes } from 'react'
import Cell from './Cell'
import classes from './Row.scss'

export default class Row extends React.Component {

  static propTypes = {
    cells: PropTypes.arrayOf(
      PropTypes.shape({
        field: PropTypes.object.isRequired,
        value: PropTypes.any,
        width: PropTypes.number.isRequired,
      })
    ).isRequired,
    update: PropTypes.func.isRequired,
  }

  render () {
    return (
      <div className={classes.root}>
        {this.props.cells.map(({ field, value, width }) => (
          <Cell
            key={field.id}
            field={field}
            value={value}
            width={width}
            update={this.props.update}
          />
        ))}
      </div>
    )
  }
}
