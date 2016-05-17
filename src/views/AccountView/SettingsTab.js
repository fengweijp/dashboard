import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import mapProps from 'map-props'
import classes from './SettingsTab.scss'

class SettingsTab extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  };

  render () {
    return (
      <div className={classes.root}>
        <div className={classes.category}>
          <div className={classes.title}>
            Name
          </div>
          <input type='text' placeholder='Your name' value={this.props.user.name} className={classes.field} />
        </div>
        <div className={classes.category}>
          <div className={classes.title}>
            Email
          </div>
          <input type='text' placeholder='Your email' value={this.props.user.email} className={classes.field} />
        </div>
      </div>
    )
  }
}

const MappedSettingsTab = mapProps({
  user: (props) => props.viewer.user,
  params: (props) => props.params,
})(SettingsTab)

export default Relay.createContainer(MappedSettingsTab, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          name
          email
        }
      }
    `,
  },
})
