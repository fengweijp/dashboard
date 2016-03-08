import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import mapProps from 'map-props'
import PureRenderMixin from 'react-addons-pure-render-mixin'
// import classes from './DataTab.scss'

export class DataTab extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    data: PropTypes.string.isRequired,
    fields: PropTypes.array.isRequired,
  };

  constructor (props) {
    super(props)

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }

  render () {
    return (
      <div>
        <div>
          {this.props.data}
        </div>
      </div>
    )
  }
}

const MappedDataTab = mapProps({
  params: (props) => props.params,
  data: (props) => (
    props.viewer.user.projects
      .find((project) => project.id === props.params.projectId)
      .models
      .find((model) => model.name === props.params.modelId)
      .data
  ),
  fields: (props) => (
    props.viewer.user.projects
      .find((project) => project.id === props.params.projectId)
      .models
      .find((model) => model.name === props.params.modelId)
      .schema
  ),
})(DataTab)

export default Relay.createContainer(MappedDataTab, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          id
        }
      }
    `,
  },
})
