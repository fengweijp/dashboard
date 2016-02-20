/* @flow */
import React, { PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { connect } from 'react-redux'
import SideNav from 'components/SideNav/SideNav'
import {
  fetchSchemas,
  addSchema,
  publishSchemas
} from 'redux/modules/schemas'

export class HomeView extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    addSchema: PropTypes.func.isRequired,
    fetchSchemas: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    schemas: PropTypes.object.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  shouldComponentUpdate (nextProps, nextState) {
    const schemaNames = Object.keys(nextProps.schemas)
    if (schemaNames.length > 0 && !schemaNames.includes(nextProps.params.model)) {
      this.context.router.replace(`/${nextProps.params.project}/models/${schemaNames[0]}`)
      return false
    }

    return PureRenderMixin.shouldComponentUpdate(nextProps, nextState)
  }

  componentWillMount () {
    this.props.fetchSchemas(this.props.params.project)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.params.project !== nextProps.params.project) {
      this.props.fetchSchemas(nextProps.params.project)
    }
  }

  render () {
    if (Object.keys(this.props.schemas).length === 0) {
      return (
        <h2>Loading</h2>
      )
    }

    return (
      <div className='columns'>
        <div className='column is-3'>
          <SideNav
            params={this.props.params}
            models={Object.keys(this.props.schemas)}
            addSchema={this.props.addSchema}
            />
        </div>
        <div className='column is-9'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  schemas: state.schemas.toJS()
})
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchSchemas: (projectName) => {
      dispatch(fetchSchemas(projectName))
    },
    addSchema: (schemaName) => {
      dispatch(addSchema(schemaName))
      dispatch(publishSchemas())
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(HomeView)
