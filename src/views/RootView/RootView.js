import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import Tooltip from 'react-tooltip'
import mapProps from 'map-props'
import ProjectSelection from 'components/ProjectSelection/ProjectSelection'
import Header from 'components/Header/Header'
import SideNav from 'views/RootView/SideNav'
import LoginView from 'views/LoginView/LoginView'
import AddProjectMutation from 'mutations/AddProjectMutation'
import classes from './RootView.scss'

import '../../styles/core.scss'

export class RootView extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    isLoggedin: PropTypes.bool.isRequired,
    viewer: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    project: PropTypes.object,
    allProjects: PropTypes.array,
    params: PropTypes.object.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

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
            <Header user={this.props.user} projectId={this.props.params.projectId} />
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
    projectId: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id
        ${LoginView.getFragment('viewer')}
        ${SideNav.getFragment('viewer')}
        project(id: $projectId) {
          id
          name
          ${SideNav.getFragment('project')}
        }
        user {
          id
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
