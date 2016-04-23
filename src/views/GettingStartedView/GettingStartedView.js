import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import mapProps from 'map-props'
import { Link } from 'react-router'
import { findDOMNode } from 'react-dom'
import Loading from 'react-loading'
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

  componentWillMount () {
    if (!this.context.gettingStartedState.isActive()) {
      this.context.router.replace(`/${this.props.params.projectName}/models`)
    }
  }

  _getStarted () {
    if (this.context.gettingStartedState.isActive('STEP1_OVERVIEW')) {
      this.context.gettingStartedState.nextStep()
    }
  }

  _skipGettingStarted () {
    if (window.confirm('Do you really want skip the getting started tour?')) {
      this.context.gettingStartedState.skip()
    }
  }

  _selectProjectId () {
    const projectId = findDOMNode(this.refs.projectId)
    const range = document.createRange()
    range.setStartBefore(projectId)
    range.setEndAfter(projectId)
    window.getSelection().addRange(range)
  }

  render () {
    const { progress } = this.context.gettingStartedState
    const overlayActive = progress === 0 || progress === 4
    const firstName = this.props.user.name.split(' ')[0]

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
                It will take about 3 mintues and show you the basic features<br />
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
                Now it’s time to test the backend from an actual app. We already prepared an example for you.
              </p>
            </div>
            <div className={classes.image}>
              <img src={require('assets/graphics/getting-started-3.svg')} />
            </div>
            <div className={classes.instructions}>
              <div className={classes.step1}>
                <h3>1. Download example app</h3>
                <a
                  href='https://github.com/graphcool-examples/react-relay-todo-example/archive/master.zip'
                  className={`${classes.download} ${classes.button} ${classes.green}`}
                >
                  Download example
                </a>
              </div>
              <div className={classes.step2}>
                <h3>
                  2. Copy your <strong>Project ID</strong> and follow&nbsp;
                  <a
                    href='https://github.com/graphcool-examples/react-relay-todo-example#getting-started'
                    target='_blank'
                  >
                    these instructions
                  </a>
                </h3>
                <div
                  onClick={::this._selectProjectId}
                  className={classes.field}
                  ref='projectId'
                >
                  {this.props.projectId}
                </div>
              </div>
            </div>
            {progress === 3 &&
              <div className={classes.status}>
                <Loading type='bubbles' delay={0} color='#8989B1' />
                &nbsp;&nbsp;Waiting for first API call...
              </div>
            }
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
