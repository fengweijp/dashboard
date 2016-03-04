import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import LoginForm from 'components/LoginForm/LoginForm'
import LoginMutation from 'mutations/LoginMutation'
import { saveToken, updateNetworkLayer } from 'utils/relay'
import 'bulma/css/bulma.css'
import 'font-awesome/css/font-awesome.css'
import '../../styles/core.scss'

export class CoreLayout extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    // addProject: PropTypes.func.isRequired,
    // reset: PropTypes.func.isRequired,
    // projects: PropTypes.array.isRequired,
    viewer: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props)

    this._onSelect = this._onSelect.bind(this)
    this._addProject = this._addProject.bind(this)
    this._login = this._login.bind(this)
  }

  _onSelect (e) {
    // this.props.reset()
    this.context.router.push(`/${e.target.value}`)
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

    const graphQL = `http://${__SERVER_ADDR__}/graphql/${this.props.params.project}`
    return (
      <div>
        <header className='header'>
          <div className='container'>
            <div className='header-left'>
              <span className='header-item'>
                <span className='select'>
                  <select onChange={this._onSelect} value={this.props.params.project}>
                    {this.props.viewer.user.projects.map((project) => (
                      <option key={project.name} value={project.name}>{project.name}</option>
                    ))}
                  </select>
                </span>
                <span onClick={this._addProject}>
                  <i className='fa fa-plus'></i>
                </span>
              </span>
            </div>

            <div className='header-right header-menu'>
              <span className='header-item'>
                <a target='_blank' href='http://slack.graph.cool'>
                  <img src='http://slack.graph.cool/badge.svg' />
                </a>
              </span>
              <span className='header-item'>
                <a className='button' target='_blank' href={graphQL}>GraphQL</a>
              </span>
            </div>
          </div>
        </header>
        <div className='container'>
          {this.props.children}
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
        tmp
        user {
          name
          projects {
            name
          }
        }
      }
    `
  }
})
