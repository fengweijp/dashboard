import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import { findDOMNode } from 'react-dom'
import classes from './ProjectSettingsOverlay.scss'
import UpdateProjectMutation from 'mutations/UpdateProjectMutation'
import DeleteProjectMutation from 'mutations/DeleteProjectMutation'
import ResetProjectMutation from 'mutations/ResetProjectMutation'

export default class ProjectSettingsOverlay extends React.Component {

  static propTypes = {
    project: PropTypes.object.isRequired,
    hide: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props)

    this._onClickReset = ::this._onClickReset
    this._onClickDelete = ::this._onClickDelete
    this._save = ::this._save
  }

  _onClickReset () {
    if (window.confirm('Do you really want to reset all data of this project?')) {
      Relay.Store.commitUpdate(new ResetProjectMutation({
        projectId: this.props.params.projectId,
      }))
    }
  }

  _onClickDelete () {
    if (window.confirm('Do you really want to delete this project?')) {
      Relay.Store.commitUpdate(new DeleteProjectMutation({
        projectId: this.props.params.projectId,
        viewerId: 'cryptic',
      }))

      this.context.router.replace('/')
    }
  }

  _save () {
    Relay.Store.commitUpdate(new UpdateProjectMutation({
      project: this.props.project,
      name: findDOMNode(this.refs.projectName).value,
      webhookUrl: findDOMNode(this.refs.projectWebhookUrl).value,
    }), {
      onSuccess: () => {
        this.props.hide()
      },
    })
  }

  render () {
    return (
      <div className={classes.background}>
        <div className={classes.container}>
          <div className={classes.head}>Project settings</div>
          <input ref='projectName' className={classes.input}
            type='text' placeholder='Name' defaultValue={this.props.project.name} />
          <input ref='projectWebhookUrl' className={classes.input} type='text'
            placeholder='Webhook url' defaultValue={this.props.project.webhookUrl} />

          <div className={classes.section}>
            <div className={classes.reset} onClick={this._onClickReset}>Reset Data</div>
            <div className={classes.delete} onClick={this._onClickDelete}>Delete Project</div>
          </div>
          <div onClick={::this.props.hide} className={classes.buttonCancel}>Cancel</div>
          <div onClick={this._save} className={classes.buttonSubmit}>Save</div>
        </div>
      </div>
    )
  }
}
