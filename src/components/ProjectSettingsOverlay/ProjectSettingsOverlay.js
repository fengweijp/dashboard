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
    this._onClickResetCompleteProject= ::this._onClickResetCompleteProject
    this._onClickDeleteProject = ::this._onClickDeleteProject
    this._save = ::this._save
  }

  _onClickResetProjectData () {
    if (window.confirm('Do you really want to reset the project data?')) {
      Relay.Store.commitUpdate(new ResetProjectDataMutation({
        projectId: this.props.project.id,
      }), {
        onSuccess: () => {
          this.context.router.replace(`/${this.props.params.projectName}/playground`)
        },
      })
    }
  }

  _onClickResetCompleteProject () {
    if (window.confirm('Do you really want to reset the project data and models? ')) {
      Relay.Store.commitUpdate(new ResetProjectSchemaMutation({
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

  _selectProjectId () {
    const projectId = findDOMNode(this.refs.projectId)
    const range = document.createRange()
    range.setStartBefore(projectId)
    range.setEndAfter(projectId)
    window.getSelection().removeAllRanges()
    window.getSelection().addRange(range)

    analytics.track('header: projectid copied')
  }

  render () {
    return (
      <div className={classes.background}>
        <div className={classes.container}>
          <div className={classes.head}>Project settings</div>
          <div className={classes.copy} title='Project Id'>
            <div onClick={::this._selectProjectId} className={classes.copyWrapper}>
              <span className={classes.projectId} ref='projectId'>
                {this.props.project.id}
              </span>
              <span className={classes.label}>
                Project Id
              </span>
            </div>
          </div>
          <input ref='projectName' className={classes.input}
            type='text' placeholder='Name' defaultValue={this.props.project.name} />
          <input ref='projectWebhookUrl' className={classes.input} type='text'
            placeholder='Webhook url' defaultValue={this.props.project.webhookUrl} />

          <div className={classes.section}>
            <div className={classes.reset} onClick={this._onClickResetProjectData}>Reset Project Data</div>
            <div
              className={classes.delete}
              onClick={this._onClickResetCompleteProject}
            >
              Reset Project Data and Models
            </div>
            <div className={classes.delete} onClick={this._onClickDeleteProject}>Delete Project</div>
          </div>
          <div onClick={::this.props.hide} className={classes.buttonCancel}>Cancel</div>
          <div onClick={this._save} className={classes.buttonSubmit}>Save</div>
        </div>
      </div>
    )
  }
}
