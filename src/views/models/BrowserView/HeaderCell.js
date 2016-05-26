import React, { PropTypes } from 'react'
import classes from './HeaderCell.scss'
import Icon from 'components/Icon/Icon'

function debounce (func, wait) {
  let timeout
  return (...args) => {
    const context = this
    const later = () => {
      timeout = null
      func.apply(context, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export default class HeaderCell extends React.Component {

  static propTypes = {
    field: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
    sortOrder: PropTypes.string,
    toggleSortOrder: PropTypes.func.isRequired,
    filter: PropTypes.string,
    updateFilter: PropTypes.func.isRequired,
  }

  constructor (props) {
    super(props)

    this._delayedUpdateFilter = debounce(this.props.updateFilter, 150)
  }

  _onFilterChangeString (e) {
    const value = e.target.value
    this._delayedUpdateFilter(value !== '' ? `"${value}"` : null)
  }

  _onFilterChangeNumber (e) {
    const value = e.target.value
    this._delayedUpdateFilter(value !== '' ? value : null)
  }

  _onFilterChangeBoolean (e) {
    const value = e.target.value
    this.props.updateFilter(value !== '' ? value.toString() : null)
  }

  _renderFilter () {
    switch (this.props.field.typeIdentifier) {
      case 'Int': return (
        <input
          type='number'
          placeholder={`Filter by ${this.props.field.fieldName}`}
          defaultValue={this.props.filter}
          onChange={::this._onFilterChangeNumber}
        />
      )
      case 'Float': return (
        <input
          type='number'
          step='any'
          placeholder={`Filter by ${this.props.field.fieldName}`}
          defaultValue={this.props.filter}
          onChange={::this._onFilterChangeNumber}
        />
      )
      case 'Boolean': return (
        <select onChange={::this._onFilterChangeBoolean}>
          <option value={''}>{`Filter by ${this.props.field.fieldName}`}</option>
          <option value={!!true}>true</option>
          <option value={false}>false</option>
        </select>
      )
      case 'Enum': return (
        <select onChange={::this._onFilterChangeBoolean}>
          <option value={''}>{`Filter by ${this.props.field.fieldName}`}</option>
          {this.props.field.enumValues.map((enumValue) => (
            <option key={enumValue}>{enumValue}</option>
          ))}
        </select>
      )
      default: return (
        <input
          type='string'
          placeholder={`Filter by ${this.props.field.fieldName}`}
          defaultValue={this.props.filter}
          onChange={::this._onFilterChangeString}
        />
      )
    }
  }

  render () {
    const { field, width, sortOrder } = this.props

    let type = field.typeIdentifier
    if (field.isList) {
      type = `[${type}]`
    }
    if (field.isRequired) {
      type = `${type}!`
    }

    return (
      <div style={{ width }} className={classes.root}>
        <div className={classes.line} onClick={this.props.toggleSortOrder}>
          <div className={classes.fieldName}>
            {field.fieldName}
            <span className={classes.type}>{type}</span>
          </div>
          {sortOrder &&
            <Icon
              src={require('assets/icons/arrow.svg')}
              width={11}
              height={6}
              className={sortOrder === 'DESC' ? classes.reverse : ''}
            />
          }
        </div>
        <div className={classes.line}>
          {this._renderFilter()}
        </div>
      </div>
    )
  }
}
