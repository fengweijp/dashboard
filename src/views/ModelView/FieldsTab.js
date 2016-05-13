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
    projectId: PropTypes.string.isRequired,
    model: PropTypes.object.isRequired,
  };

  static contextTypes = {
    gettingStartedState: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props)

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)

    this.state = {
      toggledFieldId: null,
      sortOrder: 'ASC',
    }
  }

  componentDidMount () {
    analytics.track('models/fields: viewed', {
      model: this.props.params.modelName,
    })
  }

  _sortFields (fields, sortOrder) {
    return fields.sort(function (a, b, order = sortOrder) {
      const nameA = a.fieldName.toLowerCase()
      const nameB = b.fieldName.toLowerCase()
      const modifier = sortOrder === 'ASC' ? 1 : -1
      if (nameA < nameB) {
        return modifier * -1
      }
      if (nameA > nameB) {
        return modifier * 1
      }
      return 0
    })
  }

  _toggleFieldDetails (field) {
    const toggledFieldId = this.state.toggledFieldId === field.id ? null : field.id
    this.setState({ toggledFieldId })

    analytics.track(`models/fields: ${toggledFieldId ? 'opened' : 'closed'} field details`)
  }

  render () {
    const modelNames = this.props.allModels.map((model) => model.name)

    const newFieldCallback = (field) => {
      // don't toggle up while onboarding
      if (this.context.gettingStartedState.isActive) {
        return
      }

      this.setState({ toggledFieldId: field.id })
    }

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
              callback={newFieldCallback}
              projectId={this.props.projectId}
              modelId={this.props.model.id}
              defaultRequired={this.props.model.itemCount > 0}
            />
            <tr className={classes.spacer}>
              <td />
              <td />
              <td />
              <td />
            </tr>
          </tbody>
          {this._sortFields(this.props.fields, this.state.sortOrder).map((field) => (
            <Field
              showDetails={this.state.toggledFieldId === field.id}
              toggleShowDetails={() => this._toggleFieldDetails(field)}
              key={field.id}
              field={field}
              params={this.props.params}
              modelId={this.props.model.id}
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
  model: (props) => props.viewer.model,
  projectId: (props) => props.viewer.project.id,
})(FieldsTab)

export default Relay.createContainer(MappedFieldsTab, {
  initialVariables: {
    modelName: null, // injected from router
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        model: modelByName(projectName: $projectName, modelName: $modelName) {
          id
          name
          itemCount
          fields(first: 100) {
            edges {
              node {
                id
                fieldName
                ${Field.getFragment('field')}
              }
            }
          }
        }
        project: projectByName(projectName: $projectName) {
          id
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
