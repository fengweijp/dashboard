import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import Icon from 'components/Icon/Icon'
import classes from './Header.scss'

export default class Header extends React.Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
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

  render () {
    return (
      <div className={classes.root}>
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
