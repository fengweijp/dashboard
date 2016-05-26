import * as React from 'react'
const classes: any = require('./CheckboxCell.scss')

interface Props {
  onChange: (checked: boolean) => void
  checked: boolean
}

export default class CheckboxCell extends React.Component<Props, {}> {

  _toggle () {
    this.props.onChange(!this.props.checked)
  }

  render () {
    return (
      <div className={classes.root} onClick={() => this._toggle()}>
        <input type='checkbox' checked={this.props.checked} />
      </div>
    )
  }
}
