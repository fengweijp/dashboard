import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { connect } from 'react-redux'
import classes from './DataView.scss'

export class DataView extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    fields: PropTypes.array.isRequired
  };

  constructor (props) {
    super(props)

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }

  render () {
    if (this.props.fields.length === 0) {
      return (
        <h2>Loading</h2>
      )
    }

    return (
      <div>
        <div>
          <Link
            to={`/${this.props.params.project}/models/${this.props.params.model}/schema`}
            activeClassName={classes.active}
            >
            Schema
          </Link>
          <span> </span>
          <Link
            to={`/${this.props.params.project}/models/${this.props.params.model}/data`}
            activeClassName={classes.active}
            >
            Data
          </Link>
        </div>
        <div>
          ok
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  fields: state.schemas.toJS()[ownProps.params.model].fields
})
const mapDispatchToProps = (dispatch, ownProps) => ({
})
export default connect(mapStateToProps, mapDispatchToProps)(DataView)
