import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classes from './ModelView.scss'

export default class ModelView extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    // fetchSchemas: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    // schemas: PropTypes.object.isRequired
  };

  static contextTypes = {
    // router: PropTypes.object.isRequired
  };

  // shouldComponentUpdate (nextProps, nextState) {
    // const schemaNames = Object.keys(nextProps.schemas)
    // if (schemaNames.length > 0 && !schemaNames.includes(nextProps.params.model)) {
      // this.context.router.replace(`/${nextProps.params.project}/models/${schemaNames[0]}`)
      // return false
    // }

    // return PureRenderMixin.shouldComponentUpdate(nextProps, nextState)
  // }

  // componentWillMount () {
    // this.props.fetchSchemas(this.props.params.project)
  // }

  // componentWillReceiveProps (nextProps) {
    // if (this.props.params.project !== nextProps.params.project) {
      // this.props.fetchSchemas(nextProps.params.project)
    // }
  // }

  render () {
    return (
      <div className={classes.root}>
        <div className={classes.head}>
          <Link
            to={`/${this.props.params.projectId}/models/${this.props.params.modelId}/schema`}
            className={classes.tab}
            activeClassName={classes.tabActive}
            >
            Schema
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
