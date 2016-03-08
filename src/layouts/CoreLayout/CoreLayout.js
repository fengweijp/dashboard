import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import mapProps from 'map-props'
import LoginForm from 'components/LoginForm/LoginForm'
import ProjectSelection from 'components/ProjectSelection/ProjectSelection'
import Header from 'components/Header/Header'
import SideNav from 'components/SideNav/SideNav'
import LoginMutation from 'mutations/LoginMutation'
import AddProjectMutation from 'mutations/AddProjectMutation'
import { saveToken, updateNetworkLayer } from 'utils/relay'
import classes from './CoreLayout.scss'

import '../../styles/core.scss'

export class CoreLayout extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    isLoggedin: PropTypes.bool.isRequired,
    viewer: PropTypes.object.isRequired,
    projects: PropTypes.array,
    params: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props)

    this._addProject = ::this._addProject
    this._login = ::this._login
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (!this._checkProjects(nextProps.projects, nextProps.params.projectId)) {
      return false
    }

    return PureRenderMixin.shouldComponentUpdate(nextProps, nextState)
  }

  componentWillMount () {
    if (this.props.isLoggedin) {
      this._checkProjects(this.props.projects, this.props.params.projectId)
    }
  }

  _checkProjects (projects, selectedProjectId) {
    const projectIds = projects.map((project) => project.id)
    if (!projectIds.includes(selectedProjectId)) {
      this.context.router.replace(`/${projectIds[0]}`)
      return false
    }

    return true
  }

  _addProject () {
    const projectName = window.prompt('Project name')
    if (projectName) {
      Relay.Store.commitUpdate(new AddProjectMutation({ projectName, user: this.props.viewer.user }))
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

    const selectedProject = this.props.projects.find((project) => project.id === this.props.params.projectId)

    // render nothing since redirect is scheduled
    if (!selectedProject) {
      return false
    }

    return (
      <div className={classes.root}>
        <header className={classes.header}>
          <div className={classes.headerLeft}>
            <ProjectSelection
              projects={this.props.projects}
              selectedProject={selectedProject}
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
              project={selectedProject}
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

const MappedCoreLayout = mapProps({
  params: (props) => props.params,
  projects: (props) => (
    props.viewer.user
     ? props.viewer.user.projects.edges.map((edge) => edge.node)
     : null
  ),
  viewer: (props) => props.viewer,
  isLoggedin: (props) => props.viewer.user !== null,
})(CoreLayout)

export default Relay.createContainer(MappedCoreLayout, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id
        user {
          name
          projects(first: 10) {
            edges {
              node {
                id
                name
                ${SideNav.getFragment('project')}
              }
            }
          }
        }
      }
    `,
  },
})
