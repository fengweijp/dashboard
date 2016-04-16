import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import { Link } from 'react-router'
import DeleteModelMutation from 'mutations/DeleteModelMutation'
import Icon from 'components/Icon/Icon'
import classes from './ModelView.scss'

export default class ModelView extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    params: PropTypes.object.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props)

    this._deleteModel = ::this._deleteModel
  }

  _deleteModel () {
    if (window.confirm('Do you really want to delete this model?')) {
      Relay.Store.commitUpdate(new DeleteModelMutation({
        projectId: this.props.params.projectId,
        modelId: this.props.params.modelId,
      }))

      this.context.router.replace(`/${this.props.params.projectId}/models`)
    }
  }

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
            to={`/${this.props.params.projectId}/models/${this.props.params.modelId}/data`}
            className={classes.tab}
            activeClassName={classes.tabActive}
            >
            Data
          </Link>
          <span className={classes.delete} onClick={this._deleteModel}>
            <Icon src={require('assets/icons/delete.svg')} />
          </span>
        </div>
        {this.props.children}
      </div>
    )
  }
}
