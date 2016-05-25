import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import { Link } from 'react-router'
import mapProps from 'map-props'
import Field from './Field'
import FieldPopup from './FieldPopup'
import ModelDescription from '../ModelDescription'
import ScrollBox from 'components/ScrollBox/ScrollBox'
import Icon from 'components/Icon/Icon'
import Tether from 'components/Tether/Tether'
import DeleteModelMutation from 'mutations/DeleteModelMutation'
import classes from './FieldsView.scss'

class FieldsView extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    fields: PropTypes.array.isRequired,
    allModels: PropTypes.array.isRequired,
    projectId: PropTypes.string.isRequired,
    model: PropTypes.object.isRequired,
  }

  static contextTypes = {
    gettingStartedState: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  }

  state = {
    showPopup: false,
    menuDropdownVisible: false,
  }

  componentDidMount () {
    analytics.track('models/fields: viewed', {
      model: this.props.params.modelName,
    })
  }

  _toggleMenuDropdown () {
    this.setState({ menuDropdownVisible: !this.state.menuDropdownVisible })
  }

  _deleteModel () {
    this._toggleMenuDropdown()

    if (window.confirm('Do you really want to delete this model?')) {
      Relay.Store.commitUpdate(new DeleteModelMutation({
        projectId: this.props.projectId,
        modelId: this.props.model.id,
      }), {
        onSuccess: () => {
          analytics.track('models: deleted model', {
            project: this.props.params.projectName,
            model: this.props.params.modelName,
          })

          this.context.router.replace(`/${this.props.params.projectName}/models`)
        },
      })
    }
  }

  render () {
    const dataViewOnClick = () => {
      if (this.context.gettingStartedState.isActive('STEP5_GOTO_DATA_TAB')) {
        this.context.gettingStartedState.nextStep()
      }
    }

    return (
      <div className={classes.root}>
        {this.state.showPopup &&
          <FieldPopup
            close={() => this.setState({ showPopup: false })}
            modelId={this.props.model.id}
            field={null}
            params={this.props.params}
            allModels={this.props.allModels}
          />
        }
        <div className={classes.head}>
          <div className={classes.headLeft}>
            <div className={classes.title}>
              {this.props.model.name}
              <span className={classes.itemCount}>{this.props.model.itemCount} items</span>
            </div>
            <div className={classes.titleDescription}>
              <ModelDescription model={this.props.model} />
            </div>
          </div>
          <div className={classes.headRight}>
            <Tether
              steps={{
                STEP3_CREATE_TEXT_FIELD: 'Add a new field called "text" and select type "String".' +
                ' Then click the "Add Field" button.',
                STEP4_CREATE_COMPLETED_FIELD: 'Good job! Create another one called "complete" with type "Boolean"',
              }}
              offsetX={-5}
              offsetY={5}
              width={320}
            >
              <div
                className={`${classes.button} ${classes.green}`}
                onClick={() => this.setState({ showPopup: true })}
              >
                <Icon
                  width={16}
                  height={16}
                  src={require('assets/icons/add.svg')}
                />
                <span>Create Field</span>
              </div>
            </Tether>
            <Tether
              steps={{
                STEP5_GOTO_DATA_TAB: 'Nice, you\'re done setting up the structure. Let\'s add some data.',
              }}
              width={200}
              offsetX={-5}
              offsetY={5}
            >
              <Link
                to={`/${this.props.params.projectName}/models/${this.props.params.modelName}/data`}
                className={classes.button}
                onClick={dataViewOnClick}
                >
                <Icon
                  width={16}
                  height={16}
                  src={require('assets/icons/data.svg')}
                />
                <span>Show Data</span>
              </Link>
            </Tether>
            <div className={classes.button} onClick={::this._toggleMenuDropdown}>
              <Icon
                width={16}
                height={16}
                src={require('assets/icons/more.svg')}
              />
            </div>
            {this.state.menuDropdownVisible &&
              <div className={classes.menuDropdown}>
                <div onClick={::this._deleteModel}>
                  Delete Model
                </div>
              </div>
            }
          </div>
        </div>
        <div className={classes.table}>
          <div className={classes.tableHead}>
            <div className={classes.fieldName}>Fieldname</div>
            <div className={classes.type}>Type</div>
            <div className={classes.description}>Description</div>
            <div className={classes.constraints}>Constraints</div>
            <div className={classes.permissions}>Permissions</div>
            <div className={classes.controls} />
          </div>
          <div className={classes.tableBody}>
            <ScrollBox>
              {this.props.fields.map((field) => (
                <Field
                  key={field.id}
                  field={field}
                  params={this.props.params}
                  modelId={this.props.model.id}
                  allModels={this.props.allModels}
                />
              ))}
            </ScrollBox>
          </div>
        </div>
      </div>
    )
  }
}

const MappedFieldsView = mapProps({
  params: (props) => props.params,
  allModels: (props) => props.viewer.project.models.edges.map((edge) => edge.node),
  fields: (props) => (
    props.viewer.model.fields.edges
      .map((edge) => edge.node)
      .sort((a, b) => a.fieldName.localeCompare(b.fieldName))
  ),
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
          ${ModelDescription.getFragment('model')}
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
