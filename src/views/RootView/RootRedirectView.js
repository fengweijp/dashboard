import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import mapProps from 'map-props'
import LoginView from 'views/LoginView/LoginView'

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
    if (this.props.isLoggedin) {
      this.context.router.replace(`/${this.props.projectName}`)
    }
  }

  shouldComponentUpdate (nextProps) {
    if (nextProps.isLoggedin) {
      this.context.router.replace(`/${nextProps.projectName}`)
      return false
    }

    return true
  }

  render () {
    if (!this.props.isLoggedin) {
      return (
        <LoginView viewer={this.props.viewer} />
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
    props.viewer.user
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
