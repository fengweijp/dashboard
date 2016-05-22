import * as React from 'react'
const classes: any = require('./ToggleButton.scss')

export enum ToggleSide {
  Left,
  Right,
}

interface Props {
  side: ToggleSide
  leftText: string
  rightText: string
  onUpdateSide: (ToggleSide) => void
  onClickOutside?: () => void
}

export default class ToggleButton extends React.Component<Props, {}> {

  refs: {
    [key: string]: any
    container: Element
  }

  _toggle () {
    this.props.onUpdateSide(this.props.side === ToggleSide.Left ? ToggleSide.Right : ToggleSide.Left)
  }

  componentDidMount() {
    document.addEventListener('click', this.handle, true)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handle, true)
  }

  handle = e => {
    if (!this.refs.container.contains(e.target)) {
      this.props.onClickOutside()
    }
  }

  render() {
    return (
      <div className={classes.root} onClick={() => this.props.onUpdateSide(ToggleSide.Left)} ref='container'>
        <span
          className={classes.label}
          onClick={() => this.props.onUpdateSide(ToggleSide.Left)}
        >
          {this.props.leftText}
        </span>
        <span
          className={`${classes.sliderContainer} ${this.props.side === ToggleSide.Right ? classes.active : ''}`}
          onClick={() => this._toggle()}
        >
          <span className={classes.slider}></span>
        </span>
        <span
          className={classes.label}
          onClick={() => this.props.onUpdateSide(ToggleSide.Right)}
        >
          {this.props.rightText}
        </span>
      </div>
    )
  }
}
