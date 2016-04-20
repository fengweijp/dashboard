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
  }

  static defaultProps = {
    offsetX: 0,
    offsetY: 0,
    width: 220,
  }

  static contextTypes = {
    gettingStartedState: PropTypes.object.isRequired,
  }

  render () {
    const step = this.props.steps[this.context.gettingStartedState.step]

    return (
      <TetherComponent
        offset={`${this.props.offsetY}px ${this.props.offsetX}`}
        attachment='top left'
        targetAttachment='bottom left'
        constraints={[{
          to: 'scrollParent',
          attachment: 'together',
        }]}
      >
        {this.props.children}
        {step &&
          <div
            className={classes.tether}
            style={{width: this.props.width}}
          >
            {step}
          </div>
        }
      </TetherComponent>
    )
  }
}
