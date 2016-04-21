import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Relay from 'react-relay'
import Icon from 'components/Icon/Icon'
import endpoints from 'utils/endpoints'
import classes from './Header.scss'

export default class Header extends React.Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
  }

  constructor (props) {
    super(props)

    this.state = {
      rightOverlayVisible: false,
      selectedEndpoint: window.localStorage.getItem('SELECTED_ENDPOINT') || Object.keys(endpoints)[0],
    }
  }

  _toggleRightOverlay () {
    this.setState({ rightOverlayVisible: !this.state.rightOverlayVisible })
  }

  _logout () {
    window.localStorage.clear()
    window.location.pathname = '/'
  }

  _selectEndpoint () {
    const endpoint = findDOMNode(this.refs.endpoint)
    const range = document.createRange()
    range.setStartBefore(endpoint)
    range.setEndAfter(endpoint)
    window.getSelection().addRange(range)
  }

  _changeEndpoint (e) {
    const selectedEndpoint = e.target.value
    this.setState({ selectedEndpoint })
    window.localStorage.setItem('SELECTED_ENDPOINT', selectedEndpoint)
  }

  render () {
    return (
      <div className={classes.root}>
        <div className={classes.left} title='Endpoint'>
          <select onChange={::this._changeEndpoint} value={this.state.selectedEndpoint}>
            {Object.keys(endpoints).map((endpoint) => (
              <option key={endpoint} value={endpoint}>{endpoints[endpoint].title}</option>
            ))}
          </select>
          <span onClick={::this._selectEndpoint} className={classes.endpoint} ref='endpoint'>
            https://api.graph.cool/{endpoints[this.state.selectedEndpoint].alias}/{this.props.projectId}
          </span>
        </div>
        {this.state.rightOverlayVisible &&
          <div className={classes.rightOverlay} onClick={::this._logout}>
            Logout
          </div>
        }
        <div className={classes.right} onClick={::this._toggleRightOverlay}>
          {this.props.user.name}
          <Icon
            src={require('assets/icons/arrow.svg')}
            color='#70738C'
            />
        </div>
      </div>
    )
  }
}

export default Relay.createContainer(Header, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        id
        name
      }
    `,
  },
})
