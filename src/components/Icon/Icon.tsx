import * as React from 'react'

interface Props {
  src: any
  color?: string
  width?: number
  height?: number
  className?: string
}

export default class Icon extends React.Component<Props, {}> {
  render() {
    return (
      <svg
        {...this.props}
        width={this.props.width || 16}
        height={this.props.height || 16}
        fill={this.props.color}
        dangerouslySetInnerHTML={{__html: this.props.src}}
      />
    )
  }
}
