import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import mapProps from 'map-props'
import classes from './GettingStartedView.scss'

class GettingStartedView extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    currentStep: PropTypes.number.isRequired,
  };

  render () {
    return (
      <div className={classes.root}>
        <div className={classes.progressBarBackground} style={{width: `${100 * this.props.currentStep / 3}%`}}>
          <div className={classes.progressBar} />
        </div>
        <div className={classes.steps}>
          <div className={`${classes.step} ${this.props.currentStep === 0 ? classes.currentStep : ''}`}>
            <h3>1. Create a Todo Model</h3>
            <img src={require('assets/graphics/getting-started-1.svg')} />
            <p>
              First create a new model called Todo.
              Add two fields to its schema as illustrated
              above. The model defines the structure
              of your data.
            </p>
          </div>
          <div className={`${classes.step} ${this.props.currentStep === 1 ? classes.currentStep : ''}`}>
            <h3>2. Add some data</h3>
            <img src={require('assets/graphics/getting-started-2.svg')} />
            <p>
              Now that you have created a model it’s
              time to add some example of data. Open
              the Data tab and add a few Todos.
            </p>
          </div>
          <div className={`${classes.step} ${this.props.currentStep === 2 ? classes.currentStep : ''}`}>
            <h3>3. Try it out</h3>
            <img src={require('assets/graphics/getting-started-3.svg')} />
            <p>
              Please download one of our example
              projects and enter your API key. you can
              also check out the interactive playgroud.
            </p>
          </div>
        </div>
      </div>
    )
  }
}

const MappedGettingStartedView = mapProps({
  params: (props) => props.params,
  currentStep: (props) => 1,
})(GettingStartedView)

export default Relay.createContainer(MappedGettingStartedView, {
  initialVariables: {
    projectId: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id
      }
    `,
  },
})
