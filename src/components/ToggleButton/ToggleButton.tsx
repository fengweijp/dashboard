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
  onClickOutside: (ToggleSide) => void
}

interface State {
  currentSide: ToggleSide
}

export default class ToggleButton extends React.Component<Props, State> {

  refs: {
    [key: string]: any
    container: Element
  }

  constructor (props) {
    super(props)

    this.state = {
      currentSide: this.props.side,
    }
  }

  _onUpdateSide (side) {
    this.setState({currentSide: side})
  }

  _toggle () {
    this._onUpdateSide(this.state.currentSide === ToggleSide.Left ? ToggleSide.Right : ToggleSide.Left)
  }

  componentDidMount() {
    document.addEventListener('click', this.handle, true)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handle, true)
  }

  handle = e => {
    if (!this.refs.container.contains(e.target)) {
      this.props.onClickOutside(this.state.currentSide)
    }
  }

  render() {
    return (
      <div className={classes.root} ref='container'>
        <span
          className={classes.label}
          onClick={() => this._onUpdateSide(ToggleSide.Left)}
        >
          {this.props.leftText}
        </span>
        <span
          className={`${classes.sliderContainer} ${this.state.currentSide === ToggleSide.Right ? classes.active : ''}`}
          onClick={() => this._toggle()}
        >
          <span className={classes.slider}></span>
        </span>
        <span
          className={classes.label}
          onClick={() => this._onUpdateSide(ToggleSide.Right)}
        >
          {this.props.rightText}
        </span>
      </div>
    )
  }
}
