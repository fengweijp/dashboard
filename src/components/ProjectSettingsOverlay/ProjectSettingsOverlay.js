import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import { findDOMNode } from 'react-dom'
import classes from './ProjectSettingsOverlay.scss'
import UpdateProjectMutation from 'mutations/UpdateProjectMutation'

export default class ProjectSettingsOverlay extends React.Component {

  static propTypes = {
    project: PropTypes.object.isRequired,
    hide: PropTypes.func.isRequired,
  };

  _save () {
    Relay.Store.commitUpdate(new UpdateProjectMutation({
      project: this.props.project,
      name: findDOMNode(this.refs.projectName).value,
      webhookUrl: findDOMNode(this.refs.projectWebhookUrl).value,
    }))
    this.props.hide()
  }

  componentDidMount () {
  }

  render () {
    return (
      <div className={classes.background}>
        <div className={classes.container}>
          <div className={classes.head}>Project settings</div>
          <input ref='projectName' className={classes.fieldNameInput}
            type='text' placeholder='Name' defaultValue={this.props.project.name} />
          <input ref='projectWebhookUrl' className={classes.fieldNameInput} type='text'
            placeholder='Webhook url' defaultValue={this.props.project.webhookUrl} />
          <div onClick={() => this.props.hide()} className={classes.buttonCancel}>Cancel</div>
          <div onClick={() => this._save()} className={classes.buttonSubmit}>Save</div>
        </div>
      </div>
    )
  }
}
