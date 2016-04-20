import React, { PropTypes } from 'react'
import classes from './PermissionType.scss'

export default class PermissionType extends React.Component {

  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    dataCallback: PropTypes.func,
    userType: PropTypes.string.isRequired,
    userPath: PropTypes.string,
  };

  constructor (props) {
    super(props)

    this.state = {
      userType: props.userType,
      userPath: props.userPath,
    }
  }

  _onChangeUserType (e) {
    const userType = e.target.value
    this.setState({ userType }, () => {
      this.props.dataCallback(this.state)
    })
  }

  render () {
    return (
      <div className={`${classes.root} ${this.props.className}`}>
        <div className={classes.container}>
          <select
            disabled={this.props.disabled}
            onChange={::this._onChangeUserType}
            value={this.state.userType}
          >
            <option value='GUEST'>Guest</option>
            <option value='AUTHENTICATED'>Authenticated</option>
            <option value='RELATED'>Related</option>
          </select>
          {this.state.userType === 'RELATED' &&
            <input disabled={this.props.disabled} type='text' placeholder='Path to field' />
          }
          {this.state.userType === 'AUTHENTICATED' &&
            <input disabled={this.props.disabled} type='checkbox' />
          }
          {this.state.userType === 'AUTHENTICATED' &&
            <select disabled={this.props.disabled}>
              <option value='GUEST'>Admin</option>
            </select>
          }
        </div>
      </div>
    )
  }
}
