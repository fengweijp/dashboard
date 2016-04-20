import React, { PropTypes } from 'react'
import Loading from 'react-loading'
import { Link } from 'react-router'
import classes from './GettingStartedView.scss'

export default class GettingStartedView extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
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

  render () {
    const { progress } = this.context.gettingStartedState

    return (
      <div className={classes.root}>
        <div className={classes.progressBarBackground} style={{width: `${100 * progress / 3}%`}}>
          <div className={classes.progressBar} />
        </div>
        <div className={classes.steps}>
          <div className={`${classes.step} ${progress === 0 ? classes.currentStep : ''}`}>
            <h3>1. Create Todo model</h3>
            <img src={require('assets/graphics/getting-started-1.svg')} />
            <p>
              First create a new model called Todo.
              Add two fields to its schema as illustrated
              above. The model defines the structure
              of your data.
            </p>
            <span className={classes.action} onClick={::this._getStarted}>Get started</span>
          </div>
          <div className={`${classes.step} ${progress === 1 ? classes.currentStep : ''}`}>
            <h3>2. Add some data</h3>
            <img src={require('assets/graphics/getting-started-2.svg')} />
            <p>
              Now that you have created a model it’s
              time to add some example of data. Open
              the Data tab and add a few Todos.
            </p>
            <Link
              to={`/${this.props.params.projectId}/getting-started`}
              className={classes.action}
            >
              Add data
            </Link>
          </div>
          <div className={`${classes.step} ${progress === 2 ? classes.currentStep : ''}`}>
            <h3>3. Run example app</h3>
            <img src={require('assets/graphics/getting-started-3.svg')} />
            <p>
              Please download one of our example
              projects and enter your API key. you can
              also check out the interactive playgroud.
            </p>
            <a
              href='https://github.com/graphcool-examples/react-relay-todo-example'
              target='_blank'
              className={classes.action}
            >
              Download example
            </a>
            {progress === 2 &&
              <div>
                <Loading type='bubbles' delay={0} color='#8989B1' />
                Waiting for first API call...
              </div>
            }
            {progress === 3 &&
              <div>
                Received an API call. Well done!
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}
