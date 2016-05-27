import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import { Link } from 'react-router'
import ScrollBox from 'components/ScrollBox/ScrollBox'
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
      this.context.router.replace(`/${this.props.params.projectName}/models/${modelName}`)
    }

    if (modelName) {
      Relay.Store.commitUpdate(new AddModelMutation({
        modelName,
        projectId: this.props.project.id,
      }), {
        onSuccess: (response) => {
          analytics.track('sidenav: created model', {
            project: this.props.params.projectName,
            model: modelName,
          })

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
        .then(() => {
          this.context.router.replace(`/${this.props.params.projectName}/models`)
        })
    }
  }

  _toggleProjectSettings () {
    this.setState({ projectSettingsVisible: !this.state.projectSettingsVisible })
  }

  render () {
    const firstStepOnClick = () => {
      if (this.context.gettingStartedState.isActive('STEP1_OVERVIEW')) {
        this.context.gettingStartedState.nextStep()
      }
    }

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

    const modelActive = (model) => (
      this.context.router.isActive(`/${this.props.params.projectName}/models/${model.name}/structure`) ||
        this.context.router.isActive(`/${this.props.params.projectName}/models/${model.name}/browser`)
    )

    const showsGettingStarted = this.context.router.isActive(`/${this.props.params.projectName}/getting-started`)
    const showsModels = this.context.router.isActive(`/${this.props.params.projectName}/models`)
    const showsPlayground = this.context.router.isActive(`/${this.props.params.projectName}/playground`)

    return (
      <div className={classes.root}>
        {this.state.projectSettingsVisible &&
          <ProjectSettingsOverlay
            viewer={this.props.viewer}
            project={this.props.project}
            params={this.props.params}
            hide={::this._toggleProjectSettings}
          />
        }
        <div className={classes.container}>
          <ScrollBox>
            {gettingStartedIsActive &&
              <div className={`${showsGettingStarted ? classes.active : ''}`}>
                <div className={classes.gettingStarted}>
                  <Link
                    to={`/${this.props.params.projectName}/getting-started`}
                    className={classes.head}
                    onClick={thirdStepOnClick}
                  >
                    <Icon width={19} height={19} src={require('assets/icons/cake.svg')} />
                    <span>Getting Started</span>
                  </Link>
                  <div className={classes.gettingStartedList}>
                    <div className={gettingStartedStepClass(1)}>
                      <Link
                        to={`/${this.props.params.projectName}/getting-started`}
                        onClick={firstStepOnClick}
                      >
                        1. Create Todo model
                      </Link>
                    </div>
                    <div className={gettingStartedStepClass(2)}>
                      <Link
                        to={`/${this.props.params.projectName}/models/Todo/browser`}
                        onClick={secondStepOnClick}
                      >
                        2. Add some data
                      </Link>
                    </div>
                    <div className={gettingStartedStepClass(3)}>
                      <Tether
                        steps={{
                          STEP8_GOTO_GETTING_STARTED: 'You\'re almost done. Let\'s run an example app now...',
                        }}
                        offsetY={-5}
                        width={260}
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
              </div>
            }
            <div className={`${classes.listBlock} ${showsModels ? classes.active : ''}`}>
              <Link
                to={`/${this.props.params.projectName}/models`}
                className={classes.head}
                >
                <Icon width={19} height={19} src={require('assets/icons/model.svg')} />
                <span>Models</span>
              </Link>
              <div className={classes.list}>
                {this.props.models &&
                  this.props.models.map((model) => (
                    <Link
                      key={model.name}
                      to={`/${this.props.params.projectName}/models/${model.name}`}
                      className={`${classes.listElement} ${modelActive(model) ? classes.active : ''}`}
                      >
                      {model.name}
                      <span className={classes.itemCount}>{model.itemCount}</span>
                    </Link>
                  ))}
              </div>
              <div className={classes.add} onClick={::this._addModel}>
                <Tether
                  steps={{
                    STEP2_CREATE_TODO_MODEL: 'First you need to create a new model called "Todo"',
                  }}
                  offsetY={-5}
                  width={260}
                >
                  <div>+ Add model</div>
                </Tether>
              </div>
            </div>
            <div className={`${classes.listBlock} ${showsPlayground ? classes.active : ''}`}>
              <Link
                to={`/${this.props.params.projectName}/playground`}
                className={classes.head}
                >
                <Icon width={19} height={19} src={require('assets/icons/play.svg')} />
                <span>Playground</span>
              </Link>
            </div>
          </ScrollBox>
        </div>
        <div className={classes.foot} onClick={::this._toggleProjectSettings}>
          <Icon
            width={20} height={20}
            src={require('assets/icons/gear.svg')}
            />
          <span>Project Settings</span>
        </div>
      </div>
    )
  }
}

const MappedSideNav = mapProps({
  params: (props) => props.params,
  project: (props) => props.project,
  models: (props) => props.project.models.edges
    .map((edge) => edge.node)
    .sort((a, b) => a.name.localeCompare(b.name)),
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
        models(first: 100) {
          edges {
            node {
              id
              name
              itemCount
            }
          }
        }
      }
    `,
  },
})
