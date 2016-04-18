import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import { Link } from 'react-router'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import mapProps from 'map-props'
import Icon from 'components/Icon/Icon'
import ProjectSettingsOverlay from 'components/ProjectSettingsOverlay/ProjectSettingsOverlay'
import AddModelMutation from 'mutations/AddModelMutation'
import classes from './SideNav.scss'

export class SideNav extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    viewer: PropTypes.object.isRequired,
    models: PropTypes.array,
  };

  constructor (props) {
    super(props)

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)

    this.state = {
      projectSettingsVisible: false,
    }
  }

  _addModel () {
    const modelName = window.prompt('Model name')
    if (modelName) {
      Relay.Store.commitUpdate(new AddModelMutation({
        modelName,
        projectId: this.props.params.projectId,
      }))
    }
  }

  _toggleProjectSettings () {
    this.setState({ projectSettingsVisible: !this.state.projectSettingsVisible })
  }

  render () {
    return (
      <div className={classes.root}>
        <div className={classes.list}>
          <Link
            to={`/${this.props.params.projectId}/getting-started`}
            className={classes.head}
            >
            <Icon width={19} height={19} src={require('assets/icons/cake.svg')} />
            <span>Getting Started</span>
          </Link>
          <Link
            to={`/${this.props.params.projectId}/models`}
            className={classes.head}
            >
            <Icon width={19} height={19} src={require('assets/icons/model.svg')} />
            <span>Models</span>
          </Link>
          {this.props.models &&
            this.props.models.map((model) => (
              <Link
                key={model.name}
                to={`/${this.props.params.projectId}/models/${model.id}`}
                className={classes.listElement}
                activeClassName={classes.listElementActive}
                >
                {model.name}
              </Link>
            ))
          }
          <div className={classes.add} onClick={::this._addModel}>+ Add model</div>
          <Link
            to={`/${this.props.params.projectId}/playground`}
            className={classes.head}
            >
            <Icon width={19} height={19} src={require('assets/icons/play.svg')} />
            <span>Playground</span>
          </Link>
          {this.state.projectSettingsVisible &&
            <ProjectSettingsOverlay
              viewer={this.props.viewer}
              project={this.props.project}
              hide={::this._toggleProjectSettings}
              params={this.props.params}
            />
          }
        </div>
        <div className={classes.foot} onClick={::this._toggleProjectSettings}>
          <Icon
            width={20} height={20}
            src={require('assets/icons/gear.svg')}
            color='#9292B2'
            />
          <span>Settings</span>
        </div>
      </div>
    )
  }
}

const MappedSideNav = mapProps({
  params: (props) => props.params,
  project: (props) => props.project,
  models: (props) => props.project.models.edges.map((edge) => edge.node),
})(SideNav)

export default Relay.createContainer(MappedSideNav, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          id
        }
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        id
        name
        webhookUrl
        models(first: 10) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `,
  },
})
