import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import LoginForm from 'components/LoginForm/LoginForm'
import ProjectSelection from 'components/ProjectSelection/ProjectSelection'
import SideNav from 'components/SideNav/SideNav'
import LoginMutation from 'mutations/LoginMutation'
import { saveToken, updateNetworkLayer } from 'utils/relay'
import classes from './CoreLayout.scss'

import '../../styles/core.scss'

export class CoreLayout extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    // addProject: PropTypes.func.isRequired,
    // reset: PropTypes.func.isRequired,
    // projects: PropTypes.array.isRequired,
    viewer: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props)

    this._selectProject = ::this._selectProject
    this._addProject = this._addProject.bind(this)
    this._login = this._login.bind(this)
  }

  _selectProject (projectName) {
    this.context.router.push(`/${projectName}`)
  }

  _addProject () {
    const projectName = window.prompt('Project name')
    if (projectName) {
      // this.props.addProject(projectName)
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
    if (!this.props.viewer) {
      return (
        <div>Loading</div>
      )
    }

    if (!this.props.viewer.user) {
      return (
        <LoginForm login={this._login} />
      )
    }

    // const graphQL = `http://${__SERVER_ADDR__}/graphql/${this.props.params.project}`
    return (
      <div className={classes.root}>
        <header className={classes.header}>
          <ProjectSelection
            projects={this.props.viewer.user.projects}
            selectedProject={this.props.params.project}
            select={this._selectProject}
          />
        </header>
        <div className={classes.content}>
          <SideNav
            params={this.props.params}
            models={this.props.viewer.user.projects[0].models}
            addSchema={this.props.addSchema}
            />
            {
          //{this.props.children}
            }
        </div>
      </div>
    )
  }
}

export default Relay.createContainer(CoreLayout, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id
        user {
          name
          projects {
            name
            models {
              name
            }
          }
        }
      }
    `,
  },
})
