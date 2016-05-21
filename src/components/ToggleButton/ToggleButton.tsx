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
}

export default class ToggleButton extends React.Component<Props, {}> {
  render() {
    return (
      <div className={classes.root}>
        <span className={classes.left}>
          {this.props.leftText}
        </span>
        <span className={classes.sliderContainer}>
          <span className={`${classes.slider} ${this.props.side === ToggleSide.Right ? '' : classes.active}`} />
        </span>
        <span className={classes.right}>
          {this.props.rightText}
        </span>
      </div>
    )
  }
}
