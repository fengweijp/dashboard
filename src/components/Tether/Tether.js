import React, { PropTypes } from 'react'
import TetherComponent from 'react-tether'
import classes from './Tether.scss'

export default class Tether extends React.Component {

  static propTypes = {
    steps: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    offsetX: PropTypes.number,
    offsetY: PropTypes.number,
    width: PropTypes.number,
    side: PropTypes.string,
  }

  static defaultProps = {
    offsetX: 0,
    offsetY: 0,
    width: 220,
    side: 'bottom',
  }

  static contextTypes = {
    gettingStartedState: PropTypes.object.isRequired,
  }

  render () {
    const step = this.props.steps[this.context.gettingStartedState.step]
    const isBottom = this.props.side === 'bottom'

    return (
      <TetherComponent
        offset={`${this.props.offsetY}px ${this.props.offsetX}px`}
        attachment={`${isBottom ? 'top' : 'bottom'} left`}
        targetAttachment={`${isBottom ? 'bottom' : 'top'} left`}
      >
        {this.props.children}
        {step &&
          <div
            className={`${classes.tether} ${isBottom ? classes.bottom : classes.top}`}
            style={{width: this.props.width}}
          >
            {step}
          </div>
        }
      </TetherComponent>
    )
  }
}
