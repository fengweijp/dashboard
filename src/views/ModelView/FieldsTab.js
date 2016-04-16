import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import mapProps from 'map-props'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import NewFieldLine from './NewFieldLine'
import Field from './Field'
import classes from './FieldsTab.scss'

export default class FieldsTab extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    fields: PropTypes.array.isRequired,
    allModels: PropTypes.array.isRequired,
  };

  constructor (props) {
    super(props)

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }

  render () {
    const modelNames = this.props.allModels.map((model) => model.name)

    return (
      <div className={classes.root}>
        <table className={classes.table}>
          <thead>
            <tr>
              <th>Fieldname</th>
              <th>Type</th>
              <th>Constraints</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <NewFieldLine
              modelNames={modelNames}
              params={this.props.params}
            />
            <tr className={classes.spacer}>
              <td />
              <td />
              <td />
              <td />
            </tr>
          </tbody>
          {this.props.fields.map((field) => (
            <Field
              key={field.id}
              field={field}
              params={this.props.params}
            />
          ))}
        </table>
      </div>
    )
  }
}

const MappedFieldsTab = mapProps({
  params: (props) => props.params,
  allModels: (props) => props.viewer.project.models.edges.map((edge) => edge.node),
  fields: (props) => props.viewer.model.fields.edges.map((edge) => edge.node),
})(FieldsTab)

export default Relay.createContainer(MappedFieldsTab, {
  initialVariables: {
    modelId: null, // injected from router
    projectId: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        model(id: $modelId) {
          id
          name
          fields(first: 100) {
            edges {
              node {
                id
                ${Field.getFragment('field')}
              }
            }
          }
        }
        project(id: $projectId) {
          models(first: 100) {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      }
    `,
  },
})
