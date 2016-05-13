import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import { findDOMNode } from 'react-dom'
import classes from './ProjectSettingsOverlay.scss'
import UpdateProjectMutation from 'mutations/UpdateProjectMutation'
import DeleteProjectMutation from 'mutations/DeleteProjectMutation'
import ResetProjectSchemaMutation from 'mutations/ResetProjectSchemaMutation'
import ResetProjectDataMutation from 'mutations/ResetProjectDataMutation'

export default class ProjectSettingsOverlay extends React.Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    viewer: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    hide: PropTypes.func.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props)

    this._onClickResetProjectData = ::this._onClickResetProjectData
    this._onClickResetProjectSchema = ::this._onClickResetProjectSchema
    this._onClickDeleteProject = ::this._onClickDeleteProject
    this._save = ::this._save
  }

  _onClickResetProjectSchema () {
    if (window.confirm('Do you really want to delete all data and models of this project?')) {
      Relay.Store.commitUpdate(new ResetProjectSchemaMutation({
        projectId: this.props.project.id,
      }), {
        onSuccess: () => {
          this.context.router.replace(`/${this.props.params.projectName}/playground`)
        },
      })
    }
  }

  _onClickResetProjectData () {
    if (window.confirm('Do you really want to reset all data of this project?')) {
      Relay.Store.commitUpdate(new ResetProjectDataMutation({
        projectId: this.props.project.id,
      }), {
        onSuccess: () => {
          this.context.router.replace(`/${this.props.params.projectName}/playground`)
        },
      })
    }
  }

  _onClickDeleteProject () {
    if (window.confirm('Do you really want to delete this project?')) {
      Relay.Store.commitUpdate(new DeleteProjectMutation({
        projectId: this.props.project.id,
        userId: this.props.viewer.user.id,
      }), {
        onSuccess: () => {
          // TODO replace hard reload
          // was added because deleting the last project caused
          // a relay issue
          window.location.pathname = '/'
        },
      })
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
            <div className={classes.reset} onClick={this._onClickResetProjectData}>Reset Data</div>
            <div className={classes.delete} onClick={this._onClickResetProjectSchema}>Delete Schema</div>
            <div className={classes.delete} onClick={this._onClickDeleteProject}>Delete Project</div>
          </div>
          <div onClick={::this.props.hide} className={classes.buttonCancel}>Cancel</div>
          <div onClick={this._save} className={classes.buttonSubmit}>Save</div>
        </div>
      </div>
    )
  }
}
