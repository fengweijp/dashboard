import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Loading from 'react-loading'
import classnames from 'classnames'
import { isScalar } from 'utils/graphql'
import { valueToString, isValidValue, stringToValue } from './utils'
import classes from './Cell.scss'

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

  _save (inputValue) {
    if (!isValidValue(inputValue, this.props.field)) {
      alert(`'${inputValue}' is not a valid value for field ${this.props.field.fieldName}`)
      return
    }

    const value = stringToValue(inputValue, this.props.field)

    if (value === this.state.value) {
      this.setState({ editing: false })
      return
    }

    this.setState({ loading: true })

    this.props.update(value, this.props.field, (success) => {
      this.setState({
        editing: false,
        loading: false,
        value: success ? value : this.state.value,
      })
    })
  }

  _renderContent () {
    if (this.state.loading) {
      return (
        <div className={classes.loading}>
          <Loading type='bubbles' delay={0} color='#B9B9C8' />
        </div>
      )
    }

    const valueString = valueToString(this.state.value, this.props.field, true)

    if (this.state.editing) {
      return (
        <input
          autoFocus
          type='text'
          ref='input'
          defaultValue={valueString}
          onKeyDown={(e) => e.keyCode === 13 ? this._save(e.target.value) : null}
          onBlur={(e) => this._save(e.target.value)}
        />
      )
    }

    return (
      <span>{valueString}</span>
    )
  }

  render () {
    const rootClassnames = classnames({
      [classes.root]: true,
      [classes.null]: this.props.value === null,
      [classes.editing]: this.state.editing,
    })

    return (
      <div
        style={{ width: this.props.width }}
        className={rootClassnames}
        onDoubleClick={::this._startEditing}
      >
        {this._renderContent()}
      </div>
    )
  }
}
