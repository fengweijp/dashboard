import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import mapProps from 'map-props'

export class ModelRedirectView extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    modelId: PropTypes.string.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  componentWillMount () {
    this.context.router.replace(`/${this.props.params.projectId}/models/${this.props.modelId}`)
  }

  render () {
    return (
      <div>Redirecting...</div>
    )
  }
}

const MappedModelRedirectView = mapProps({
  params: (props) => props.params,
  modelId: (props) => props.viewer.project.models.edges[0].node.id,
})(ModelRedirectView)

export default Relay.createContainer(MappedModelRedirectView, {
  initialVariables: {
    projectId: '',
  },
  fragments: {
    // NOTE name needed because of relay bug
    viewer: () => Relay.QL`
      fragment on Viewer {
        project(id: $projectId) {
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
