import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import mapProps from 'map-props'

class ModelRedirectView extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    modelName: PropTypes.string.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  componentWillMount () {
    this.context.router.replace(`/${this.props.params.projectName}/models/${this.props.modelName}`)
  }

  render () {
    return (
      <div>Redirecting...</div>
    )
  }
}

const MappedModelRedirectView = mapProps({
  params: (props) => props.params,
  modelName: (props) => props.viewer.project.models.edges[0].node.name,
})(ModelRedirectView)

export default Relay.createContainer(MappedModelRedirectView, {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    // NOTE name needed because of relay bug
    viewer: () => Relay.QL`
      fragment on Viewer {
        project: projectByName(projectName: $projectName) {
          models(first: 1) {
            edges {
              node {
                name
                id
              }
            }
          }
        }
      }
    `,
  },
})
