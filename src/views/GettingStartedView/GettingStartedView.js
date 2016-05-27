import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import mapProps from 'map-props'
import { Link } from 'react-router'
import { findDOMNode } from 'react-dom'
import Loading from 'components/Loading/Loading'
import classes from './GettingStartedView.scss'
import { Follow } from 'react-twitter-widgets'

class Script extends React.Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
  }

  componentDidMount () {
    const element = findDOMNode(this.refs.element)
    const script = document.createElement('script')
    script.src = this.props.url
    script.async = true
    script.defer = true
    element.appendChild(script)
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    return (
      <div ref='element' {...this.props} />
    )
  }
}

const examples = {
  RELAY: {
    path: 'react-relay-todo-example',
    description: 'React + Relay',
  },
  LOKKA: {
    path: 'react-lokka-todo-example',
    description: 'React + Lokka',
  },
  APOLLO: {
    path: 'react-apollo-todo-example',
    description: 'React + Apollo',
  },
}

class GettingStartedView extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
  }

  static contextTypes = {
    gettingStartedState: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  }

  constructor (props) {
    super(props)
    this.state = {
      selectedExample: examples.RELAY,
    }
  }

  componentWillMount () {
    if (!this.context.gettingStartedState.isActive()) {
      this.context.router.replace(`/${this.props.params.projectName}/models`)
    }
  }

  componentDidMount () {
    analytics.track('getting-started: viewed', {
      project: this.props.params.projectName,
      step: this.context.gettingStartedState.step,
    })
  }

  componentDidUpdate () {
    if (this.context.gettingStartedState.progress === 4) {
      const snd = new Audio(require('assets/success.mp3'))
      snd.volume = 0.5
      snd.play()
    }
  }

  _getStarted () {
    if (this.context.gettingStartedState.isActive('STEP1_OVERVIEW')) {
      this.context.gettingStartedState.nextStep()
    }
  }

  _selectExample (example) {
    this.state.selectedExample = example
  }

  _skipGettingStarted () {
    if (window.confirm('Do you really want skip the getting started tour?')) {
      this.context.gettingStartedState.skip()
        .then(() => {
          this.context.router.replace(`/${this.props.params.projectName}/models`)
        })
    }
  }

  _onClose () {
    analytics.track('getting-started: closed')
  }

  _selectCommands () {
    const commands = findDOMNode(this.refs.commands)
    const range = document.createRange()
    range.setStartBefore(commands)
    range.setEndAfter(commands)
    window.getSelection().addRange(range)
  }

  render () {
    const { progress } = this.context.gettingStartedState
    const overlayActive = progress === 0 || progress === 4
    const firstName = this.props.user.name.split(' ')[0]
    const downloadUrl = (example) => (
      `${__BACKEND_ADDR__}/resources/examples/${example.path}?projectId=${this.props.projectId}`
    )

    return (
      <div className={classes.root}>
        {progress === 0 &&
          <div className={classes.overlay}>
            <div className={classes.emoji}>🙌</div>
            <div>
              <h2><strong>Hi {firstName}</strong>, welcome to our Dashboard.</h2>
              <p>
                To make your start a bit easier, we have prepared a little tour for you.
              </p>
              <p>
                It will take about 3 minutes and show you the basic features<br />
                by creating a GraphQL backend for an example Todo app.
              </p>
            </div>
            <div className={classes.buttons}>
              <div
                className={`${classes.button} ${classes.green}`}
                style={{width: 260}}
                onClick={::this._getStarted}
              >
                Let’s go
              </div>
              <div
                className={`${classes.button} ${classes.grey}`}
                style={{width: 170}}
                onClick={::this._skipGettingStarted}
              >
                Skip tour
              </div>
            </div>
          </div>
        }
        {progress === 4 &&
          <div className={classes.overlay}>
            <div className={classes.emoji}>🎉</div>
            <div>
              <h2><strong>Congratulations</strong>, you did it!</h2>
              <p>
                We hope you like how easy it is to setup your own GraphQL backend.<br />
                If you need any help please join our Slack community. We’d love to talk to you!
              </p>
            </div>
            <div className={classes.social}>
              <div className={classes.twitter}>
                <Follow username='graphcool' />
              </div>
              <Script url='https://slack.graph.cool/slackin.js' />
            </div>
            <div className={classes.buttons}>
              <Link
                to={`/${this.props.params.projectName}/models`}
                onClick={this._onClose}
                className={`${classes.button} ${classes.grey}`}
                style={{width: 170}}
              >
                Close
              </Link>
            </div>
          </div>
        }
        {progress <= 1 &&
          <div className={`${classes.step} ${overlayActive ? classes.blurred : ''}`}>
            <div className={classes.text}>
              <h2>1. Create <strong>Todo</strong> model</h2>
              <p>
                In this first step you will learn to create a new <i>model</i> called <strong>Todo</strong>.
              </p>
              <p>
                A model is a collection of several fields defining the structure of your data.
              </p>
            </div>
            <div className={classes.image}>
              <img src={require('assets/graphics/getting-started-1.svg')} />
            </div>
          </div>
        }
        {progress === 2 &&
          <div className={`${classes.step} ${overlayActive ? classes.blurred : ''}`}>
            <div className={classes.text}>
              <h2>2. Add some data</h2>
              <p>
                In this step you will add some data to the <strong>Todo</strong> model you just created.
                It doesn’t matter what you add, it’s just about populating the database.
              </p>
              <p>
                It’s also possible to import existing data.
              </p>
            </div>
            <div className={classes.image}>
              <img src={require('assets/graphics/getting-started-2.svg')} />
            </div>
          </div>
        }
        {progress >= 3 &&
          <div className={`${classes.step} ${overlayActive ? classes.blurred : ''}`}>
            <div className={classes.text}>
              <h2>3. Run example app</h2>
              <p>
                Awesome. You’re done setting up the backend.
              </p>
              <p>
                Now it’s time to test the backend from an actual app. Choose your own example below!
              </p>
            </div>
            <div className={classes.image}>
              <img src={require('assets/graphics/getting-started-3.svg')} />
            </div>
            <div className={classes.selection}>
              <div
                className={`
                  ${classes.selectExample}
                  ${this.state.selectedExample === examples.RELAY ? classes.selected : ''}`
                }
                onClick={() => this._selectExample(examples.RELAY)}
              >
                {examples.RELAY.description}
              </div>
              <div
                className={`
                  ${classes.selectExample}
                  ${this.state.selectedExample === examples.LOKKA ? classes.selected : ''}`
                }
                onClick={() => this._selectExample(examples.LOKKA)}
              >
                {examples.LOKKA.description}
              </div>
              <div
                className={`
                  ${classes.selectExample}
                  ${this.state.selectedExample === examples.APOLLO ? classes.selected : ''}`
                }
                onClick={() => this._selectExample(examples.APOLLO)}
              >
                {examples.APOLLO.description}
              </div>
            </div>
            <div className={classes.instructions}>
              <div className={classes.step1}>
                <h3>1. Download example app</h3>
                <a
                  href={downloadUrl(this.state.selectedExample)}
                  className={`${classes.download} ${classes.button} ${classes.green}`}
                >
                  Download example
                </a>
              </div>
              <div className={classes.step2}>
                <h3>
                  2. Run these commands
                </h3>
                <div
                  onClick={::this._selectCommands}
                  className={classes.field}
                  ref='commands'
                >
                  npm install<br />npm start<br /><span className={classes.comment}># open localhost:3000</span>
                </div>
              </div>
              <div className={classes.step3}>
                <h3>
                  <a href='http://localhost:3000' target='_blank'>3. Open the example app</a>
                </h3>
                {progress === 3 &&
                  <div className={classes.status}>
                    <Loading color='#8989B1' />
                    &nbsp;&nbsp;Checking status...
                  </div>
                }
              </div>
            </div>
          </div>
        }
        <div className={classes.pagination}>
          <span className={progress <= 1 ? classes.active : ''} />
          <span className={progress === 2 ? classes.active : ''} />
          <span className={progress >= 3 ? classes.active : ''} />
        </div>
      </div>
    )
  }
}

const MappedGettingStartedView = mapProps({
  params: (props) => props.params,
  projectId: (props) => props.viewer.project.id,
  user: (props) => props.viewer.user,
})(GettingStartedView)

export default Relay.createContainer(MappedGettingStartedView, {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        project: projectByName(projectName: $projectName) {
          id
        }
        user {
          name
        }
      }
    `,
  },
})
