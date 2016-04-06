import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Relay from 'react-relay'
import Icon from 'components/Icon/Icon'
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

  render () {
    return (
      <div className={classes.root}>
        <div className={classes.left} onClick={::this._selectEndpoint} title='Endpoint'>
          <Icon
            src={require('assets/icons/api.svg')}
            color='#70738C'
            width={20}
            height={20}
            />
          <span className={classes.endpoint} ref='endpoint'>
            https://api.graph.cool/graphql/{this.props.projectId}
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
