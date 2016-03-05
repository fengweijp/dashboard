import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import classes from './SideNav.scss'

export default class SideNav extends React.Component {
  static propTypes = {
    addSchema: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    models: PropTypes.array,
  };

  constructor (props) {
    super(props)

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)

    this._addSchema = this._addSchema.bind(this)
  }

  _addSchema () {
    const schemaName = window.prompt('Schema name')
    if (schemaName) {
      this.props.addSchema(schemaName)
    }
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
