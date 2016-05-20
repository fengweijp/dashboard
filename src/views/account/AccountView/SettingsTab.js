import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Relay from 'react-relay'
import UpdateUserMutation from 'mutations/UpdateUserMutation'
import UpdatePasswordMutation from 'mutations/UpdatePasswordMutation'
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
      email: this.props.user.email,
      name: this.props.user.name,
      oldPassword: '',
      newPasswordOne: '',
      newPasswordTwo: '',
      passwordWasChanged: false,
      nameWasChanged: false,
      emailWasChanged: false,
    }
  }

  _saveChanges () {
    if (!this.state.nameWasChanged && !this.state.emailWasChanged && !this.state.passwordWasChanged) {
      alert('No changes to save!')
    }

    if (this.state.nameWasChanged || this.state.emailWasChanged) {
      this._handleUserChange()
    }

    if (this.state.passwordWasChanged) {
      this._handlePasswordChange()
    }
  }

  _handleUserChange () {
    Relay.Store.commitUpdate(new UpdateUserMutation({
      userId: this.props.user.__dataID__,
      email: this.state.email,
      name: this.state.name,
    }), {
      onSuccess: () => {
        alert('Changes to email and name were saved!')
        this.props.user.email = this.state.email
        this.props.user.name = this.state.name
        this.state.emailWasChanged = false
        this.state.nameWasChanged = false
      },
      onFailure: (transaction) => {
        alert(transaction.getError())
      },
    })
  }

  _handlePasswordChange () {
    if (this.state.newPasswordOne !== '' && this.state.newPasswordOne === this.state.newPasswordTwo) {
      Relay.Store.commitUpdate(new UpdatePasswordMutation({
        userId: this.props.user.__dataID__,
        oldPassword: this.state.oldPassword,
        newPassword: this.state.newPasswordOne,
      }), {
        onSuccess: () => {
          alert('Changes to password were saved!')
          ReactDOM.findDOMNode(this.refs.oldPassword).value = ''
          ReactDOM.findDOMNode(this.refs.newPasswordOne).value = ''
          ReactDOM.findDOMNode(this.refs.newPasswordTwo).value = ''
          this.state.passwordWasChanged = false
        },
        onFailure: (transaction) => {
          alert(transaction.getError())
        },
      })
    } else {
      alert('Please enter the same new password twice')
    }
  }

  _onChangeName (event) {
    this.state.name = event.target.value
    if (event.target.value !== this.props.user.name) {
      this.state.nameWasChanged = true
    } else {
      this.state.nameWasChanged = false
    }
  }

  _onChangeEmail (event) {
    this.state.email = event.target.value
    if (event.target.value !== this.props.user.email) {
      this.state.emailWasChanged = true
    } else {
      this.state.emailWasChanged = false
    }
  }

  _onChangePassword (event) {
    this.state.oldPassword = event.target.value
    if (event.target.value !== '') {
      this.state.passwordWasChanged = true
    } else {
      this.state.passwordWasChanged = false
    }
  }

  _onChangePasswordOne (event) {
    this.state.newPasswordOne = event.target.value
  }

  _onChangePasswordTwo (event) {
    this.state.newPasswordTwo = event.target.value
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
            ref='oldPassword'
            placeholder='Enter current password'
            className={classes.field}
            onBlur={::this._onChangePassword}
          />
          <input
            type='password'
            ref='newPasswordOne'
            placeholder='Choose new password'
            className={classes.field}
            onBlur={::this._onChangePasswordOne}
          />
          <input
            type='password'
            ref='newPasswordTwo'
            placeholder='Repeat new password'
            className={classes.field}
            onBlur={::this._onChangePasswordTwo}
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
