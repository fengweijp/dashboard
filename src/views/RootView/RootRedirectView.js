import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import mapProps from 'map-props'
import LoginForm from 'components/LoginForm/LoginForm'
import LoginMutation from 'mutations/LoginMutation'
import { saveToken, updateNetworkLayer } from 'utils/relay'

export class RootRedirectView extends React.Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
    projectId: PropTypes.string,
    isLoggedin: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props)

    this._login = ::this._login
  }

  componentWillMount () {
    if (this.props.isLoggedin) {
      this.context.router.replace(`/${this.props.projectId}`)
    }
  }

  shouldComponentUpdate (nextProps) {
    if (nextProps.isLoggedin) {
      this.context.router.replace(`/${nextProps.projectId}`)
      return false
    }

    return true
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
      <div>Redirecting...</div>
    )
  }
}

const MappedRootRedirectView = mapProps({
  viewer: (props) => props.viewer,
  projectId: (props) => (
    props.viewer.user
     ? props.viewer.user.projects.edges[0].node.id
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
        user {
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
