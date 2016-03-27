import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import mapProps from 'map-props'
import LoginForm from 'components/LoginForm/LoginForm'
import ProjectSelection from 'components/ProjectSelection/ProjectSelection'
import Header from 'components/Header/Header'
import SideNav from 'views/RootView/SideNav'
import LoginMutation from 'mutations/LoginMutation'
import AddProjectMutation from 'mutations/AddProjectMutation'
import { saveToken, updateNetworkLayer } from 'utils/relay'
import classes from './RootView.scss'

import '../../styles/core.scss'

export class RootView extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    isLoggedin: PropTypes.bool.isRequired,
    viewer: PropTypes.object.isRequired,
    project: PropTypes.object,
    allProjects: PropTypes.array,
    params: PropTypes.object.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props)

    this._addProject = ::this._addProject
    this._login = ::this._login
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

  _login (email, password) {
    const payload = { email, password, viewer: this.props.viewer }
    const onSuccess = (response) => {
      saveToken(response.signinUser.token)
      updateNetworkLayer()
    }
    Relay.Store.commitUpdate(new LoginMutation(payload), { onSuccess })
  }

  render () {
    if (!this.props.isLoggedin) {
      return (
        <LoginForm login={this._login} />
      )
    }

    return (
      <div className={classes.root}>
        <header className={classes.header}>
          <div className={classes.headerLeft}>
            <ProjectSelection
              params={this.props.params}
              projects={this.props.allProjects}
              selectedProject={this.props.project}
              add={this._addProject}
            />
          </div>
          <div className={classes.headerRight}>
            <Header />
          </div>
        </header>
        <div className={classes.main}>
          <div className={classes.sidenav}>
            <SideNav
              params={this.props.params}
              project={this.props.project}
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
  project: (props) => props.viewer.user ? props.viewer.project : null,
  allProjects: (props) => (
    props.viewer.user
     ? props.viewer.user.projects.edges.map((edge) => edge.node)
     : null
  ),
  viewer: (props) => props.viewer,
  isLoggedin: (props) => props.viewer.user !== null,
})(RootView)

export default Relay.createContainer(MappedRootView, {
  initialVariables: {
    projectId: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id
        project(id: $projectId) {
          id
          name
          ${SideNav.getFragment('project')}
        }
        user {
          name
          id
          projects(first: 100) {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      }
    `,
  },
})
