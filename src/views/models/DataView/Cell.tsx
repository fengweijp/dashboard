import * as React from 'react'
import { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import * as Loading from 'react-loading'
import { classnames } from '../../../utils/classnames'
import { isScalar } from '../../../utils/graphql'
import { valueToString, isValidValue, stringToValue } from './utils'
import { Field } from '../../../types/types'
import ToggleButton from '../../../components/ToggleButton/ToggleButton'
import { ToggleSide } from '../../../components/ToggleButton/ToggleButton'
const classes: any = require('./Cell.scss')

type UpdateCallback = (boolean) => void

interface Props {
  field: Field
  value?: any
  width: number
  update: (any, Field, UpdateCallback) => void
}

interface State {
  editing?: boolean
  loading?: boolean
  value?: any
}

export default class Cell extends React.Component<Props, State> {

  refs: {
    input: HTMLInputElement
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
    if (!prevState.editing && this.state.editing && this.refs.input) {
      findDOMNode<HTMLInputElement>(this.refs.input).select()
    }
  }

  _startEditing () {
    if (this.props.field.fieldName !== 'id') {
      this.setState({ editing: true })
    }
  }

  _save (inputValue) {
    if (!isValidValue(inputValue, this.props.field)) {
      alert(`'${inputValue}' is not a valid value for field ${this.props.field.fieldName}`)
      return
    }

    const value = stringToValue(inputValue, this.props.field)

    //const currentValue

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
      switch (this.props.field.typeIdentifier) {
        case 'Int':
          return (
            <input
              autoFocus
              type='number'
              ref='input'
              defaultValue={valueString}
              onBlur={(e) => this._save((e.target as HTMLInputElement).value)}
              onKeyDown={(e) => e.keyCode === 13 ? this._save((e.target as HTMLInputElement).value) : null}
            />
          )
        case 'Float':
          return (
            <input
              autoFocus
              type='number'
              step='any'
              ref='input'
              defaultValue={valueString}
              onBlur={(e) => this._save((e.target as HTMLInputElement).value)}
              onKeyDown={(e) => e.keyCode === 13 ? this._save((e.target as HTMLInputElement).value) : null}
            />
          )
        case 'Boolean':
          return (
            <ToggleButton
              leftText='false'
              rightText='true'
              side={valueString === 'true' ? ToggleSide.Right : ToggleSide.Right}
              onUpdateSide={(side) => null}
            />
          )
        case 'Enum':
          return (
            <select
              autoFocus
              defaultValue={valueString}
              onBlur={(e) => this._save((e.target as HTMLInputElement).value)}
              onKeyDown={(e) => e.keyCode === 13 ? this._save((e.target as HTMLInputElement).value) : null}
            >
              {this.props.field.enumValues.map((enumValue) => (
                <option key={enumValue}>{enumValue}</option>
              ))}
            </select>
          )
        default:
          return (
            <input
              autoFocus
              type='text'
              ref='input'
              defaultValue={valueString}
              onKeyDown={(e) => e.keyCode === 13 ? this._save((e.target as HTMLInputElement).value) : null}
              onBlur={(e) => this._save((e.target as HTMLInputElement).value)}
            />
          )
      }
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
        onDoubleClick={() => this._startEditing()}
      >
        {this._renderContent()}
      </div>
    )
  }
}
