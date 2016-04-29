import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import mapProps from 'map-props'
import { Link } from 'react-router'
import DeleteModelMutation from 'mutations/DeleteModelMutation'
import Icon from 'components/Icon/Icon'
import Tether from 'components/Tether/Tether'
import classes from './ModelView.scss'

class ModelView extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    params: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    modelId: PropTypes.string.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
    gettingStartedState: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props)

    this._deleteModel = ::this._deleteModel
  }

  _deleteModel () {
    if (window.confirm('Do you really want to delete this model?')) {
      Relay.Store.commitUpdate(new DeleteModelMutation({
        projectId: this.props.projectId,
        modelId: this.props.modelId,
      }), {
        onSuccess: () => {
          analytics.track('models: deleted model', {
            project: this.props.params.projectName,
            model: this.props.params.modelName,
          })

          this.context.router.replace(`/${this.props.params.projectName}/models`)
        },
      })
    }
  }

  render () {
    const dataTabOnClick = () => {
      if (this.context.gettingStartedState.isActive('STEP5_GOTO_DATA_TAB')) {
        this.context.gettingStartedState.nextStep()
      }
    }

    return (
      <div className={classes.root}>
        <div className={classes.head}>
          <Link
            to={`/${this.props.params.projectName}/models/${this.props.params.modelName}/fields`}
            className={classes.tab}
            activeClassName={classes.tabActive}
            >
            Fields
          </Link>
          <Tether
            steps={{
              STEP5_GOTO_DATA_TAB: 'Nice, you\'re done setting up the model. Let\'s add some data.',
            }}
            width={300}
            side='top'
            offsetX={-26}
            offsetY={5}
          >
            <Link
              to={`/${this.props.params.projectName}/models/${this.props.params.modelName}/data`}
              className={classes.tab}
              activeClassName={classes.tabActive}
              onClick={dataTabOnClick}
            >
              Data
            </Link>
          </Tether>
          <span className={classes.delete} onClick={this._deleteModel}>
            <Icon src={require('assets/icons/delete.svg')} />
          </span>
        </div>
        {this.props.children}
      </div>
    )
  }
}

const MappedModelView = mapProps({
  params: (props) => props.params,
  children: (props) => props.children,
  modelId: (props) => props.viewer.model.id,
  projectId: (props) => props.viewer.project.id,
})(ModelView)

export default Relay.createContainer(MappedModelView, {
  initialVariables: {
    modelName: null, // injected from router
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        model: modelByName(projectName: $projectName, modelName: $modelName) {
          id
        }
        project: projectByName(projectName: $projectName) {
          id
        }
      }
    `,
  },
})
