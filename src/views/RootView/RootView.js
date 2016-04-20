import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import Tooltip from 'react-tooltip'
import mapProps from 'map-props'
import ProjectSelection from 'components/ProjectSelection/ProjectSelection'
import Header from 'components/Header/Header'
import SideNav from 'views/RootView/SideNav'
import LoginView from 'views/LoginView/LoginView'
import AddProjectMutation from 'mutations/AddProjectMutation'
import UpdateUserMutation from 'mutations/UpdateUserMutation'
import classes from './RootView.scss'

import '../../styles/core.scss'

class GettingStartedState {

  static steps = [
    'STEP1_OVERVIEW',
    'STEP2_CREATE_TODO_MODEL',
    'STEP3_CREATE_TEXT_FIELD',
    'STEP4_CREATE_COMPLETED_FIELD',
    'STEP5_GOTO_DATA_TAB',
    'STEP6_ADD_DATA_ITEM_1',
    'STEP7_ADD_DATA_ITEM_2',
    'STEP8_GOTO_GETTING_STARTED',
    'STEP9_WAITING_FOR_REQUESTS',
    'STEP10_DONE',
  ]

  constructor ({ step, userId }) {
    this._userId = userId
    this.update(step)
  }

  isActive (step) {
    return this.step !== 'STEP10_DONE' && (step ? this.step === step : true)
  }

  update (step) {
    this.step = step

    switch (step) {
      case 'STEP1_OVERVIEW': this.progress = 0; break
      case 'STEP2_CREATE_TODO_MODEL': this.progress = 0; break
      case 'STEP3_CREATE_TEXT_FIELD': this.progress = 0; break
      case 'STEP4_CREATE_COMPLETED_FIELD': this.progress = 0; break
      case 'STEP5_GOTO_DATA_TAB': this.progress = 1; break
      case 'STEP6_ADD_DATA_ITEM_1': this.progress = 1; break
      case 'STEP7_ADD_DATA_ITEM_2': this.progress = 1; break
      case 'STEP8_GOTO_GETTING_STARTED': this.progress = 2; break
      case 'STEP9_WAITING_FOR_REQUESTS': this.progress = 2; break
      case 'STEP10_DONE': this.progress = 3; break
      case null: this.progress = 3; break // TODO remove me
    }
  }

  skip () {
    Relay.Store.commitUpdate(new UpdateUserMutation({
      userId: this._userId,
      gettingStartedStatus: 'STEP10_DONE',
    }))
  }

  nextStep () {
    const currentStepIndex = GettingStartedState.steps.indexOf(this.step)
    const nextStep = GettingStartedState.steps[currentStepIndex + 1]

    return new Promise((resolve, reject) => {
      Relay.Store.commitUpdate(new UpdateUserMutation({
        userId: this._userId,
        gettingStartedStatus: nextStep,
      }), {
        onSuccess: resolve,
        onFailure: reject,
      })
    })
  }
}

export class RootView extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    isLoggedin: PropTypes.bool.isRequired,
    viewer: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    project: PropTypes.object,
    allProjects: PropTypes.array,
    params: PropTypes.object.isRequired,
    relay: PropTypes.object.isRequired,
  }

  static childContextTypes = {
    gettingStartedState: PropTypes.object.isRequired,
  }

  constructor (props) {
    super(props)

    const gettingStartedState = new GettingStartedState({
      userId: props.user.id,
      step: props.user.gettingStartedStatus,
    })

    this.state = { gettingStartedState }

    this._updateForceFetching()
  }

  componentWillUnmount () {
    clearInterval(this.refreshInterval)
  }

  componentWillReceiveProps (nextProps) {
    this.state.gettingStartedState.update(nextProps.user.gettingStartedStatus)
  }

  componentDidUpdate (prevProps) {
    if (this.props.user.gettingStartedStatus !== prevProps.user.gettingStartedStatus) {
      this._updateForceFetching()
    }
  }

  getChildContext () {
    return {
      gettingStartedState: this.state.gettingStartedState,
    }
  }

  _updateForceFetching () {
    if (this.props.user.gettingStartedStatus === 'STEP9_WAITING_FOR_REQUESTS') {
      if (!this.refreshInterval) {
        this.refreshInterval = setInterval(this.props.relay.forceFetch, 1000)
      }
    } else {
      clearInterval(this.refreshInterval)
    }
  }

  _addProject () {
    const projectName = window.prompt('Project name')
    if (projectName) {
      Relay.Store.commitUpdate(new AddProjectMutation({
        projectName,
        userId: this.props.viewer.user.id,
      }))
    }
  }

  render () {
    if (!this.props.isLoggedin) {
      return (
        <LoginView viewer={this.props.viewer} />
      )
    }

    return (
      <div className={classes.root}>
        <Tooltip
          place='bottom'
          effect='solid'
        />
        <header className={classes.header}>
          <div className={classes.headerLeft}>
            <ProjectSelection
              params={this.props.params}
              projects={this.props.allProjects}
              selectedProject={this.props.project}
              add={::this._addProject}
            />
          </div>
          <div className={classes.headerRight}>
            <Header user={this.props.user} projectId={this.props.project.id} />
          </div>
        </header>
        <div className={classes.main}>
          <div className={classes.sidenav}>
            <SideNav
              params={this.props.params}
              project={this.props.project}
              viewer={this.props.viewer}
              />
          </div>
          <div className={classes.content}>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

const MappedRootView = mapProps({
  params: (props) => props.params,
  relay: (props) => props.relay,
  project: (props) => props.viewer.user ? props.viewer.project : null,
  allProjects: (props) => (
    props.viewer.user
     ? props.viewer.user.projects.edges.map((edge) => edge.node)
     : null
  ),
  viewer: (props) => props.viewer,
  user: (props) => props.viewer.user,
  isLoggedin: (props) => props.viewer.user !== null,
})(RootView)

export default Relay.createContainer(MappedRootView, {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id
        ${LoginView.getFragment('viewer')}
        ${SideNav.getFragment('viewer')}
        project: projectByName(projectName: $projectName) {
          id
          name
          ${SideNav.getFragment('project')}
        }
        user {
          id
          gettingStartedStatus
          projects(first: 100) {
            edges {
              node {
                id
                name
              }
            }
          }
          ${Header.getFragment('user')}
        }
      }
    `,
  },
})
