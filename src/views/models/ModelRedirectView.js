import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import mapProps from 'map-props'

class ModelRedirectView extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  componentWillMount () {
    const subView = this.props.model.itemCount === 0 ? 'structure' : 'data'
    this.context.router.replace(`/${this.props.params.projectName}/models/${this.props.model.name}/${subView}`)
  }

  render () {
    return (
      <div>Redirecting...</div>
    )
  }
}

const MappedModelRedirectView = mapProps({
  params: (props) => props.params,
  model: (props) => (
    props.params.modelName
      ? props.viewer.project.models.edges
          .map(({ node }) => node)
          .find((m) => m.name === props.params.modelName)
      : props.viewer.project.models.edges
          .map(({ node }) => node)
          .sort((a, b) => a.name.localeCompare(b.name))[0],
  ),
})(ModelRedirectView)

export default Relay.createContainer(MappedModelRedirectView, {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        project: projectByName(projectName: $projectName) {
          models(first: 100) {
            edges {
              node {
                name
                itemCount
              }
            }
          }
        }
      }
    `,
  },
})
