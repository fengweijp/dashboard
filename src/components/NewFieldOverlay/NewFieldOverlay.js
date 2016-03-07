import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import classes from './NewFieldOverlay.scss'

export default class SideNav extends React.Component {

  static propTypes = {
    hide: PropTypes.func.isRequired,
    add: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props)

    this._addField = ::this._addField
  }

  componentDidMount () {
    findDOMNode(this.refs.fieldName).focus()
  }

  _addField () {
    this.props.add({
      fieldName: 'test',
      typeIdentifier: 'Integer',
      isList: false,
      isRequired: false,
      isUnique: false,
    })

    this.props.hide()
  }

  render () {
    return (
      <div className={classes.background}>
        <div className={classes.container}>
          <div className={classes.head}>Add new field</div>
          <input ref='fieldName' className={classes.fieldNameInput} type='text' placeholder='Choose a good name' />
          <select className={classes.typeSelect}>
            <option key='1' value='1'>Integer</option>
          </select>
          <div className={classes.check}>
            <label>
              <input type='checkbox' />
              <span className={classes.checkWord}>Required</span><br />
              <span className={classes.checkDescription}>Is this property always needed?</span>
            </label>
          </div>
          <div className={classes.check}>
            <label>
              <input type='checkbox' />
              <span className={classes.checkWord}>Unique</span><br />
              <span className={classes.checkDescription}>Check if every data item need to be different
              respecting this property</span>
            </label>
          </div>
          <div onClick={this.props.hide} className={classes.buttonCancel}>Cancel</div>
          <div onClick={this._addField} className={classes.buttonSubmit}>Add</div>
        </div>
      </div>
    )
  }
}
