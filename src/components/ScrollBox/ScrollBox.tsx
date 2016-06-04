import * as React from 'react'
const classes: any = require('./ScrollBox.scss')

interface Props {
  children?: React.ReactChild
  innerContainerClassName?: string
  outerContainerClassName?: string
}

let scrollBarWidth = null

export default class ScrollBox extends React.Component<Props, {}> {

  refs: {
    [key: string]: any;
    outerContainer: Element
    innerContainer: Element
  }

  componentWillMount () {
    if (scrollBarWidth === null) {
      const scrollDiv = document.createElement('div')
      scrollDiv.className = classes.measureElement
      document.body.appendChild(scrollDiv)

      scrollBarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth

      document.body.removeChild(scrollDiv)
    }
  }

  render() {
    return (
      <div className={classes.rootContainer}>
        <div
          className={`${classes.outerContainer} ${this.props.outerContainerClassName}`}
          style={{width: `calc(100% + ${scrollBarWidth}px)`}}
          ref='outerContainer'
        >
          <div
            className={`${classes.innerContainer} ${this.props.innerContainerClassName}`}
            ref='innerContainer'
          >
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}
