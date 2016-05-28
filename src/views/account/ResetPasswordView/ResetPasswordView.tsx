import * as React from 'react'
import * as Relay from 'react-relay'
import ResetPasswordMutation from '../../../mutations/ResetPasswordMutation'
import Icon from '../../../components/Icon/Icon'
import { getQueryVariable } from '../../../utils/location'
const classes: any = require('./ResetPasswordView.scss')

interface State {
  newPassword: string
}

export default class ResetPasswordView extends React.Component<{}, State> {

  state = {
    newPassword: '',
  }

  _submit () {
    const resetPasswordToken = getQueryVariable('token')
    const { newPassword } = this.state

    Relay.Store.commitUpdate(
      new ResetPasswordMutation({
        resetPasswordToken,
        newPassword,
      }),
      {
        onSuccess: (response) => {
          analytics.track('reset-password', () => {
            window.location.href = '/'
          })
        },
        onFailure: (transaction) => {
          alert(transaction.getError())
        },
      }
    )
  }

  render () {
    return (
      <div className={classes.root}>
        <div className={classes.box}>
          <div className={classes.logo}>
            <Icon
              width={60} height={70}
              src={require('assets/icons/logo.svg')}
              color='#fff'
              />
          </div>
          <div className={classes.instruction}>
            Please choose your password. <br />
            You will be logged in afterwards.
          </div>
          <div className={classes.form}>
            <input
              type='password'
              placeholder='Password'
              onChange={(e) => this.setState({ newPassword: (e.target as HTMLInputElement).value })}
              onKeyUp={(e) => e.keyCode === 13 ? this._submit() : null}
              />
            <button onClick={() => this._submit()}>Set Password</button>
          </div>
        </div>
      </div>
    )
  }
}
