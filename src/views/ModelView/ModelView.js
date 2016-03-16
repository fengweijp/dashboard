import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classes from './ModelView.scss'

export default class ModelView extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    params: PropTypes.object.isRequired,
  };

  render () {
    return (
      <div className={classes.root}>
        <div className={classes.head}>
          <Link
            to={`/${this.props.params.projectId}/models/${this.props.params.modelId}/fields`}
            className={classes.tab}
            activeClassName={classes.tabActive}
            >
            Fields
          </Link>
          <Link
            to={`/${this.props.params.projectId}/models/${this.props.params.modelId}/permission`}
            className={classes.tab}
            activeClassName={classes.tabActive}
            >
            Permission
          </Link>
          <Link
            to={`/${this.props.params.projectId}/models/${this.props.params.modelId}/data`}
            className={classes.tab}
            activeClassName={classes.tabActive}
            >
            Data
          </Link>
        </div>
        {this.props.children}
      </div>
    )
  }
}
