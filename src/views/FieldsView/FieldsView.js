import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import mapProps from 'map-props'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Field from './Field'
import Icon from 'components/Icon/Icon'
import classes from './FieldsView.scss'

class FieldsView extends React.Component {
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
    return (
      <div className={classes.root}>
        <div className={classes.head}>
          <div className={classes.headLeft}>
            <div className={classes.title}>
              {this.props.model.name}
              <span className={classes.itemCount}>{this.props.model.itemCount} items</span>
            </div>
            <div className={classes.titleDescription}>
              A book is a collection of words. Sometimes they make sense.
            </div>
          </div>
          <div className={classes.headRight}>
            <div className={`${classes.button} ${classes.green}`}>
              <Icon
                width={16}
                height={16}
                src={require('assets/icons/add.svg')}
              />
              <span>Create Field</span>
            </div>
            <div className={classes.button}>
              <Icon
                width={16}
                height={16}
                src={require('assets/icons/data.svg')}
              />
              <span>Show Data</span>
            </div>
            <div className={classes.button}>
              <Icon
                width={16}
                height={16}
                src={require('assets/icons/more.svg')}
              />
            </div>
          </div>
        </div>
        <div className={classes.table}>
          <div className={classes.tableHead}>
            <div className={classes.fieldName}>Fieldname</div>
            <div className={classes.type}>Type</div>
            <div className={classes.description}>Description</div>
            <div className={classes.constraints}>Constraints</div>
            <div className={classes.permissions}>Permissions</div>
          </div>
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
        </div>
      </div>
    )
  }
}

const MappedFieldsView = mapProps({
  params: (props) => props.params,
  allModels: (props) => props.viewer.project.models.edges.map((edge) => edge.node),
  fields: (props) => props.viewer.model.fields.edges.map((edge) => edge.node),
  model: (props) => props.viewer.model,
  projectId: (props) => props.viewer.project.id,
})(FieldsView)

export default Relay.createContainer(MappedFieldsView, {
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
