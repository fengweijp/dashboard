import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classes from './AccountView.scss'

export default class AccountView extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    params: PropTypes.object.isRequired,
  };

  render () {
    return (
      <div className={classes.root}>
        <div className={classes.head}>
          <div className={classes.title}>
            Account
          </div>
          <div className={classes.tabs}>
            <Link
              to={`/${this.props.params.projectName}/account/settings`}
              className={classes.tab}
              activeClassName={classes.tabActive}
            >
              Settings
            </Link>
            <Link
              to={`/${this.props.params.projectName}/account/usage`}
              className={classes.tab}
              activeClassName={classes.tabActive}
            >
              Usage
            </Link>
          </div>
        </div>
        {this.props.children}
      </div>
    )
  }
}
