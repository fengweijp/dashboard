import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import mapProps from 'map-props'
import classes from './SettingsTab.scss'

class SettingsTab extends React.Component {
  static propTypes = {
    deleteMe: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired,
  };

  render () {
    return (
      <div className={classes.root}>
        <input type='text' placeholder='Your name' />
        {this.props.deleteMe}
      </div>
    )
  }
}

const MappedSettingsTab = mapProps({
  deleteMe: (props) => props.viewer.id,
  params: (props) => props.params,
})(SettingsTab)

export default Relay.createContainer(MappedSettingsTab, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id
      }
    `,
  },
})
