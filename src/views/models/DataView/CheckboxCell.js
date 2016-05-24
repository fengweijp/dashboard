import React, { PropTypes } from 'react'
import classes from './CheckboxCell.scss'

export default class CheckboxCell extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    checked: PropTypes.bool.isRequired,
  }

  render () {
    const { name, onChange } = this.props

    return (
      <div className={classes.root}>
        <input
          type='checkbox'
          name={name}
          onChange={(event) => {
            this.setState({checked: event.target.checked})
            onChange(event)
          }}
          checked={this.props.checked}
        />
      </div>
    )
  }
}
