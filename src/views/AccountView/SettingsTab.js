import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import UpdateUserMutation from '../../mutations/UpdateUserMutation'
import mapProps from 'map-props'
import classes from './SettingsTab.scss'

class SettingsTab extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  }

  constructor (props) {
    super(props)

    this.state = {
      email: props.user.email,
      name: props.user.name,
      password: props.user.password,
      emailError: false,
      nameError: false,
      passwordError: false,
    }

    console.log(this.state)
  }
  _saveChanges () {
    Relay.Store.commitUpdate(new UpdateUserMutation({
      email: this.state.email,
      name: this.state.name,
    }), {
      onSuccess: () => {
        alert('Changes were saved!')
      },
      onFailure: (transaction) => {
        alert(transaction.getError())
      },
    })
  }

  _onChangeName (event) {
    this.state.name = event.target.value
  }

  _onChangeEmail (event) {
    this.state.email = event.target.value
  }

  render () {
    return (
      <div className={classes.root}>
        <div className={classes.category}>
          <div className={classes.title}>
            Name
          </div>
          <input
            type='text'
            placeholder='Your name'
            defaultValue={this.props.user.name}
            className={classes.field}
            onBlur={::this._onChangeName}
          />
        </div>
        <div className={classes.category}>
          <div className={classes.title}>
            Email
          </div>
          <input
            type='text'
            placeholder='Your email'
            defaultValue={this.props.user.email}
            className={classes.field}
            onBlur={::this._onChangeEmail}
          />
        </div>
        <div className={classes.category}>
          <div className={classes.title}>
            Change password
          </div>
          <input
            type='password'
            placeholder='Enter current password'
            className={classes.field}
          />
          <input
            type='password'
            placeholder='Choose new password'
            className={classes.field}
          />
          <input
            type='password'
            placeholder='Repeat new password'
            className={classes.field}
          />
        </div>
        <div className={classes.saveChanges} onClick={::this._saveChanges}>
          Save changes
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
