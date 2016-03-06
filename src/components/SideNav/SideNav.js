import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import { Link } from 'react-router'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import mapProps from 'map-props'
import classes from './SideNav.scss'

export class SideNav extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    models: PropTypes.array,
  };

  constructor (props) {
    super(props)

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)

    this._addSchema = this._addSchema.bind(this)
  }

  _addSchema () {
    // const schemaName = window.prompt('Schema name')
    // if (schemaName) {
      // this.props.addSchema(schemaName)
    // }
  }

  render () {
    return (
      <div className={classes.root}>
        <div>
          <div>MODELS</div>
          <div onClick={this._addSchema}><strong>Create new</strong></div>
        </div>
        <br />
        {this.props.models &&
          <div>
            {this.props.models.map((model) => (
              <div key={model.name}>
                <Link
                  to={`/${this.props.params.project}/models/${model.name}`}
                  activeClassName={classes.active}
                  >
                  {model.name}
                </Link>
                {
                // <div>20</div>
                }
              </div>
            ))}
          </div>
        }
      </div>
    )
  }
}

const MappedSideNav = mapProps({
  params: (props) => props.params,
  models: (props) => props.project.models,
})(SideNav)

export default Relay.createContainer(MappedSideNav, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        id
        name
        models {
          name
        }
      }
    `,
  },
})
