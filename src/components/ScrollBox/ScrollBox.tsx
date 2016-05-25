import * as React from 'react'
const classes: any = require('./ScrollBox.scss')

interface Props {
  children: Element
}

let scrollBarWidth = null

export default class ScrollBox extends React.Component<Props, {}> {

  componentWillMount () {
    if (scrollBarWidth === null) {
      const scrollDiv = document.createElement('div')
      scrollDiv.className = classes.measureElement
      document.body.appendChild(scrollDiv)

      scrollBarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
      console.warn(scrollBarWidth)

      document.body.removeChild(scrollDiv)
    }
  }

  render() {
    return (
      <div className={classes.rootContainer}>
        <div className={classes.outerContainer} style={{width: `calc(100% + ${scrollBarWidth}px)`}}>
          <div className={classes.innerContainer}>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}
