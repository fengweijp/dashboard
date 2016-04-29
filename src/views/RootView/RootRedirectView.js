import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import mapProps from 'map-props'
import AddProjectMutation from 'mutations/AddProjectMutation'
import LoginView from 'views/LoginView/LoginView'
import classes from './RootRedirectView.scss'

export class RootRedirectView extends React.Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
    projectName: PropTypes.string,
    isLoggedin: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  componentWillMount () {
    if (this.props.isLoggedin && this.props.projectName) {
      this.context.router.replace(`/${this.props.projectName}`)
    }
  }

  shouldComponentUpdate (nextProps) {
    if (nextProps.isLoggedin && nextProps.projectName) {
      this.context.router.replace(`/${nextProps.projectName}`)
      return false
    }

    return true
  }

  _addProject () {
    const projectName = window.prompt('Project name')
    if (projectName) {
      Relay.Store.commitUpdate(new AddProjectMutation({
        projectName,
        userId: this.props.viewer.user.id,
      }), {
        onSuccess: () => {
          analytics.track('global: created project', {
            project: projectName,
          })
        },
      })
    }
  }

  render () {
    if (!this.props.isLoggedin) {
      return (
        <LoginView viewer={this.props.viewer} />
      )
    }

    if (!this.props.projectName) {
      return (
        <div className={classes.addProject} onClick={::this._addProject}>
          Add new project
        </div>
      )
    }

    return (
      <div>Redirecting...</div>
    )
  }
}

const MappedRootRedirectView = mapProps({
  viewer: (props) => props.viewer,
  projectName: (props) => (
   (props.viewer.user && props.viewer.user.projects.edges.length > 0)
     ? props.viewer.user.projects.edges[0].node.name
     : null
  ),
  isLoggedin: (props) => props.viewer.user !== null,
})(RootRedirectView)

export default Relay.createContainer(MappedRootRedirectView, {
  fragments: {
    // NOTE name needed because of relay bug
    viewer: () => Relay.QL`
      fragment on Viewer {
        id
        ${LoginView.getFragment('viewer')}
        user {
          id
          projects(first: 1) {
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
