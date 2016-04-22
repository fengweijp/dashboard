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

  _skipGettingStarted () {
    if (window.confirm('Do you really want skip the getting started tour?')) {
      this.context.gettingStartedState.skip()
    }
  }

  render () {
    const { progress } = this.context.gettingStartedState
    const overlayActive = progress === 0 || progress === 4

    return (
      <div className={classes.root}>
        {progress === 0 &&
          <div className={classes.overlay}>
            <div>
              <h2><strong>Hi there</strong>, welcome to our Dashboard.</h2>
              <p>
                To make your start a bit easier, we have prepared a little tour for you.
              </p>
              <p>
                It will take about 3 mintues and show you the basic features<br />
                by creating a GraphQL backend for an example Todo app.
              </p>
            </div>
            <div className={classes.buttons}>
              <div className={classes.green} style={{width: 260}} onClick={::this._getStarted}>Let’s go</div>
              <div className={classes.grey} style={{width: 170}} onClick={::this._skipGettingStarted}>Skip tour</div>
            </div>
          </div>
        }
        {progress <= 1 &&
          <div className={`${classes.step} ${overlayActive ? classes.blurred : ''}`}>
            <div className={classes.text}>
              <h2>1. Create <strong>Todo</strong> model</h2>
              <p>
                In this first step you need to create a new <i>model</i> called <strong>Todo</strong>. A model defines the structure of your data.
              </p>
              <p>
                Then you will add two <i>fields</i>: text and complete. Fields are the properties of your model. Each field has a type.
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
                In this step you will add some data to the <strong>Todo</strong> model you just created. It doesn’t matter what you add, it’s just about populating the database.
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

      //<div className={classes.root}>
        //<div className={classes.progressBarBackground} style={{width: `${100 * progress / 3}%`}}>
          //<div className={classes.progressBar} />
        //</div>
        //<div className={classes.steps}>
          //<div className={`${classes.step} ${progress === 0 ? classes.currentStep : ''}`}>
            //<h3>1. Create Todo model</h3>
            //<img src={require('assets/graphics/getting-started-1.svg')} />
            //<p>
              //First create a new model called Todo.
              //Add two fields to its schema as illustrated
              //above. The model defines the structure
              //of your data.
            //</p>
            //<span className={classes.action} onClick={::this._getStarted}>Get started</span>
          //</div>
          //<div className={`${classes.step} ${progress === 1 ? classes.currentStep : ''}`}>
            //<h3>2. Add some data</h3>
            //<img src={require('assets/graphics/getting-started-2.svg')} />
            //<p>
              //Now that you have created a model it’s
              //time to add some example of data. Open
              //the Data tab and add a few Todos.
            //</p>
            //<Link
              //to={`/${this.props.params.projectId}/getting-started`}
              //className={classes.action}
            //>
              //Add data
            //</Link>
          //</div>
          //<div className={`${classes.step} ${progress === 2 ? classes.currentStep : ''}`}>
            //<h3>3. Run example app</h3>
            //<img src={require('assets/graphics/getting-started-3.svg')} />
            //<p>
              //Please download one of our example
              //projects and enter your API key. you can
              //also check out the interactive playgroud.
            //</p>
            //<a
              //href='https://github.com/graphcool-examples/react-relay-todo-example'
              //target='_blank'
              //className={classes.action}
            //>
              //Download example
            //</a>
            //{progress === 2 &&
              //<div>
                //<Loading type='bubbles' delay={0} color='#8989B1' />
                //Waiting for first API call...
              //</div>
            //}
            //{progress === 3 &&
              //<div>
                //Received an API call. Well done!
              //</div>
            //}
          //</div>
        //</div>
      //</div>
