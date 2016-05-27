import * as React from 'react'
const classes: any = require('./Icon.scss')

interface Props {
  src: any
  color?: string
  width?: number
  height?: number
  className?: string
}

export default class Icon extends React.Component<Props, {}> {
  render() {
    const width = this.props.width || 16
    const height = this.props.height || 16

    const fillCode = this.props.color ? `fill="${this.props.color}"` : ''
    const styleCode = `style="width: ${width}px; height: ${height}px"`
    const __html = this.props.src.replace(/<svg/, `<svg ${fillCode} ${styleCode}`)

    const restProps = Object.assign({}, this.props)
    delete restProps.width
    delete restProps.height
    delete restProps.color
    delete restProps.src
    delete restProps.className

    return (
      <i
        {...restProps}
        className={`${classes.root} ${this.props.className}`}
        dangerouslySetInnerHTML={{ __html }}
      />
    )
  }
}
