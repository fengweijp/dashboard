import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import SideNav from 'components/SideNav/SideNav'

export class HomeView extends React.Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
    // children: PropTypes.element.isRequired,
    addSchema: PropTypes.func.isRequired,
    // fetchSchemas: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    // schemas: PropTypes.object.isRequired
  };

  static contextTypes = {
    // router: PropTypes.object.isRequired
  };

  // shouldComponentUpdate (nextProps, nextState) {
    // const schemaNames = Object.keys(nextProps.schemas)
    // if (schemaNames.length > 0 && !schemaNames.includes(nextProps.params.model)) {
      // this.context.router.replace(`/${nextProps.params.project}/models/${schemaNames[0]}`)
      // return false
    // }

    // return PureRenderMixin.shouldComponentUpdate(nextProps, nextState)
  // }

  // componentWillMount () {
    // this.props.fetchSchemas(this.props.params.project)
  // }

  // componentWillReceiveProps (nextProps) {
    // if (this.props.params.project !== nextProps.params.project) {
      // this.props.fetchSchemas(nextProps.params.project)
    // }
  // }

  render () {
    return (
      <div className='columns'>
        <div className='column is-3'>
          <SideNav
            params={this.props.params}
            models={this.props.viewer.user.projects[0].models}
            addSchema={this.props.addSchema}
            />
        </div>
        <div className='column is-9'>
        {
          // {this.props.children}
        }
        </div>
      </div>
    )
  }
}

export default Relay.createContainer(HomeView, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id
        tmp
        user {
          name
          projects {
            models {
              name
            }
          }
        }
      }
    `,
  },
})
