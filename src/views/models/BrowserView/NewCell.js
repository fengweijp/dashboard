import React, { PropTypes } from 'react'
import classnames from 'classnames'
import { valueToString, stringToValue } from '../utils'
import ToggleButton, { ToggleSide } from '../../../components/ToggleButton/ToggleButton'
import classes from './Cell.scss'

export default class NewCell extends React.Component {

  static propTypes = {
    field: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
    update: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    autoFocus: PropTypes.bool.isRequired,
    defaultValue: PropTypes.any.isRequired,
  }

  constructor (props) {
    super(props)

    this.state = {
      value: props.defaultValue,
      focus: props.autoFocus,
    }
  }

  _updateValue (inputValue) {
    const value = stringToValue(inputValue, this.props.field)
    this.setState({ value })
    this.props.update(value, this.props.field)
  }

  _renderContent () {
    if (this.props.field.fieldName === 'id') {
      return (
        <span className={classes.value}>Id will be generated</span>
      )
    }

    const valueString = valueToString(this.state.value, this.props.field, false)

    if (this.props.field.isList) {
      return (
        <input
          autoFocus={this.props.autoFocus}
          type='text'
          defaultValue={valueString}
          onChange={(e) => this._updateValue(e.target.value)}
          onKeyDown={(e) => e.keyCode === 13 ? this.props.submit() : e.keyCode === 27 ? this.props.cancel() : null}
          onFocus={() => this.setState({ focus: true })}
          onBlur={() => this.setState({ focus: false })}
        />
      )
    }

    switch (this.props.field.typeIdentifier) {
      case 'Int':
        return (
          <input
            autoFocus={this.props.autoFocus}
            type='number'
            defaultValue={valueString}
            onChange={(e) => this._updateValue(e.target.value)}
            onKeyDown={(e) => e.keyCode === 13 ? this.props.submit() : e.keyCode === 27 ? this.props.cancel() : null}
            onFocus={() => this.setState({ focus: true })}
            onBlur={() => this.setState({ focus: false })}
          />
        )
      case 'Float':
        return (
          <input
            autoFocus={this.props.autoFocus}
            type='number'
            step='any'
            defaultValue={valueString}
            onChange={(e) => this._updateValue(e.target.value)}
            oonKeyDown={(e) => e.keyCode === 13 ? this.props.submit() : e.keyCode === 27 ? this.props.cancel() : null}
            onFocus={() => this.setState({ focus: true })}
            onBlur={() => this.setState({ focus: false })}
          />
        )
      case 'Boolean':
        return (
          <ToggleButton
            leftText='false'
            rightText='true'
            side={ToggleSide.Left}
            onClickOutside={(side) => this._updateValue(side === ToggleSide.Left ? 'false' : 'true')}
          />
        )
      case 'Enum':
        return (
          <select
            autoFocus={this.props.autoFocus}
            defaultValue={valueString}
            onChange={(e) => this._updateValue(e.target.value)}
            onKeyDown={(e) => e.keyCode === 13 ? this.props.submit() : e.keyCode === 27 ? this.props.cancel() : null}
            onFocus={() => this.setState({ focus: true })}
            onBlur={() => this.setState({ focus: false })}
          >
            <option disabled={this.state.focus} />
            {this.props.field.enumValues.map((enumValue) => (
              <option key={enumValue}>{enumValue}</option>
            ))}
          </select>
        )
      default:
        return (
          <input
            autoFocus={this.props.autoFocus}
            type='text'
            defaultValue={valueString}
            onChange={(e) => this._updateValue(e.target.value)}
            onKeyDown={(e) => e.keyCode === 13 ? this.props.submit() : e.keyCode === 27 ? this.props.cancel() : null}
            onFocus={() => this.setState({ focus: true })}
            onBlur={() => this.setState({ focus: false })}
          />
        )
    }
  }

  render () {
    const rootClassnames = classnames({
      [classes.root]: true,
      [classes.null]: this.props.field.fieldName === 'id',
      [classes.editing]: this.state.focus,
      [classes.invalid]: (
        (this.props.field.isRequired && this.state.value === null) &&
        this.props.field.fieldName !== 'id'
      ),
    })

    return (
      <div
        style={{ width: this.props.width }}
        className={rootClassnames}
      >
        {this._renderContent()}
      </div>
    )
  }
}
