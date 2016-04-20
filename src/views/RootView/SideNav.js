import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import { Link } from 'react-router'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import mapProps from 'map-props'
import Icon from 'components/Icon/Icon'
import Tether from 'components/Tether/Tether'
import ProjectSettingsOverlay from 'components/ProjectSettingsOverlay/ProjectSettingsOverlay'
import AddModelMutation from 'mutations/AddModelMutation'
import classes from './SideNav.scss'

export class SideNav extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    viewer: PropTypes.object.isRequired,
    models: PropTypes.array,
  }

  static contextTypes = {
    gettingStartedState: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  }

  constructor (props) {
    super(props)

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)

    this.state = {
      projectSettingsVisible: false,
    }
  }

  _addModel () {
    const modelName = window.prompt('Model name')
    const redirect = () => {
      this.context.router.replace(`/${this.props.params.projectName}/models/Todo`)
    }

    if (modelName) {
      Relay.Store.commitUpdate(new AddModelMutation({
        modelName,
        projectId: this.props.project.id,
      }), {
        onSuccess: (response) => {
          // getting-started onboarding step
          if (modelName === 'Todo' && this.context.gettingStartedState.isActive('STEP2_CREATE_TODO_MODEL')) {
            this.context.gettingStartedState.nextStep().then(redirect)
          } else {
            redirect()
          }
        },
      })
    }
  }

  _skipGettingStarted () {
    if (window.confirm('Do you really want skip the getting started tour?')) {
      this.context.gettingStartedState.skip()
    }
  }

  _toggleProjectSettings () {
    this.setState({ projectSettingsVisible: !this.state.projectSettingsVisible })
  }

  render () {
    const secondStepOnClick = () => {
      if (this.context.gettingStartedState.isActive('STEP5_GOTO_DATA_TAB')) {
        this.context.gettingStartedState.nextStep()
      }
    }

    const thirdStepOnClick = () => {
      if (this.context.gettingStartedState.isActive('STEP8_GOTO_GETTING_STARTED')) {
        this.context.gettingStartedState.nextStep()
      }
    }

    const gettingStartedIsActive = this.context.gettingStartedState.isActive()
    const gettingStartedStepClass = (index) => {
      if (this.context.gettingStartedState.progress === index) {
        return classes.gettingStartedStepActive
      } else if (this.context.gettingStartedState.progress > index) {
        return classes.gettingStartedStepDone
      } else {
        return classes.gettingStartedStepDisabled
      }
    }

    return (
      <div className={classes.root}>
        <div className={classes.list}>
          {gettingStartedIsActive &&
            <div>
              <Link
                to={`/${this.props.params.projectName}/getting-started`}
                className={classes.head}
                onClick={thirdStepOnClick}
              >
                <Icon width={19} height={19} src={require('assets/icons/cake.svg')} />
                <span>Getting Started</span>
              </Link>
              <div className={classes.gettingStarted}>
                <div className={gettingStartedStepClass(0)}>
                  <Link
                    to={`/${this.props.params.projectName}/getting-started`}
                  >
                    1. Create Todo model
                  </Link>
                </div>
                <div className={gettingStartedStepClass(1)}>
                  <Link
                    to={`/${this.props.params.projectName}/models/Todo/data`}
                    onClick={secondStepOnClick}
                  >
                    2. Add some data
                  </Link>
                </div>
                <div className={gettingStartedStepClass(2)}>
                  <Tether
                    steps={{
                      STEP8_GOTO_GETTING_STARTED: 'You\'re almost done. Let\'s run an example app now...',
                    }}
                    offsetY={-5}
                  >
                    <Link
                      to={`/${this.props.params.projectName}/getting-started`}
                      onClick={thirdStepOnClick}
                    >
                      3. Run example app
                    </Link>
                  </Tether>
                </div>
                <div onClick={::this._skipGettingStarted} className={classes.gettingStartedSkip}>
                  Skip getting started
                </div>
              </div>
            </div>
          }
          <Link
            to={`/${this.props.params.projectName}/models`}
            className={classes.head}
            >
            <Icon width={19} height={19} src={require('assets/icons/model.svg')} />
            <span>Models</span>
          </Link>
          {this.props.models &&
            this.props.models.map((model) => (
              <Link
                key={model.name}
                to={`/${this.props.params.projectName}/models/${model.name}`}
                className={classes.listElement}
                activeClassName={classes.listElementActive}
                >
                {model.name}
              </Link>
            ))
          }
          <div className={classes.add} onClick={::this._addModel}>
            <Tether
              steps={{
                STEP2_CREATE_TODO_MODEL: 'First you need to create a new model called "Todo"',
              }}
            >
              <div>+ Add model</div>
            </Tether>
          </div>
          <Link
            to={`/${this.props.params.projectName}/playground`}
            className={classes.head}
            >
            <Icon width={19} height={19} src={require('assets/icons/play.svg')} />
            <span>Playground</span>
          </Link>
          {this.state.projectSettingsVisible &&
            <ProjectSettingsOverlay
              viewer={this.props.viewer}
              project={this.props.project}
              params={this.props.params}
              hide={::this._toggleProjectSettings}
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
