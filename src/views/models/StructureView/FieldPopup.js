import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import mapProps from 'map-props'
import Relay from 'react-relay'
import ClickOutside from 'react-click-outside'
import TypeSelection from './TypeSelection'
import ScrollBox from 'components/ScrollBox/ScrollBox'
import TagsInput from 'react-tagsinput'
import Icon from 'components/Icon/Icon'
import Loading from 'components/Loading/Loading'
import AddFieldMutation from 'mutations/AddFieldMutation'
import UpdateFieldMutation from 'mutations/UpdateFieldMutation'
import { isScalar } from 'utils/graphql'
import classes from './FieldPopup.scss'

import 'react-tagsinput/react-tagsinput.css'

class FieldPopup extends React.Component {

  static propTypes = {
    field: PropTypes.object,
    modelId: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired,
    allModels: PropTypes.array.isRequired,
  }

  static contextTypes = {
    gettingStartedState: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  }

  constructor (props) {
    super(props)

    const { field } = props

    this.state = {
      loading: false,
      fieldName: field ? field.fieldName : '',
      typeIdentifier: field ? field.typeIdentifier : 'Int',
      isRequired: field ? field.isRequired : true,
      isList: field ? field.isList : false,
      enumValues: field ? field.enumValues : [],
      defaultValue: field ? field.defaultValue : null,
      reverseRelationField: field ? field.reverseRelationField : null,
    }
  }

  componentWillMount () {
    window.addEventListener('keydown', this._listenForKeys, false)
  }

  componentWillUnmount () {
    window.removeEventListener('keydown', this._listenForKeys, false)
  }

  _listenForKeys = (e) => {
    if (e.keyCode === 13 && e.target === document.body) {
      this._submit()
    } else if (e.keyCode === 27 && e.target === document.body) {
      this._close()
    }
  }

  _close () {
    this.context.router.push(`/${this.props.params.projectName}/models/${this.props.params.modelName}/structure`)
  }

  _submit () {
    if (this.props.field) {
      this._update()
    } else {
      this._create()
    }
  }

  _create () {
    if (!this._isValid()) {
      return
    }

    this.setState({ loading: true })

    const {
      fieldName,
      typeIdentifier,
      enumValues,
      isList,
      isRequired,
      defaultValue,
      reverseRelationField,
    } = this.state

    Relay.Store.commitUpdate(new AddFieldMutation({
      modelId: this.props.modelId,
      fieldName,
      typeIdentifier,
      enumValues,
      isList,
      isRequired,
      defaultValue,
      relationId: ((reverseRelationField || {}).relation || {}).id,
    }), {
      onSuccess: (response) => {
        analytics.track('models/structure: created field', {
          project: this.props.params.projectName,
          model: this.props.params.modelName,
          field: fieldName,
        })

        this._close()

        // getting-started onboarding steps
        const isStep3 = this.context.gettingStartedState.isActive('STEP3_CREATE_TEXT_FIELD')
        if (isStep3 && fieldName === 'text' && typeIdentifier === 'String') {
          this.context.gettingStartedState.nextStep()
        }

        const isStep4 = this.context.gettingStartedState.isActive('STEP4_CREATE_COMPLETED_FIELD')
        if (isStep4 && fieldName === 'complete' && typeIdentifier === 'Boolean') {
          this.context.gettingStartedState.nextStep()
        }
      },
      onFailure: (transaction) => {
        alert(transaction.getError())
        this._close()
      },
    })
  }

  _update () {
    if (!this._isValid()) {
      return
    }

    this.setState({ loading: true })

    const {
      fieldName,
      typeIdentifier,
      enumValues,
      isList,
      isRequired,
      defaultValue,
      reverseRelationField,
    } = this.state

    Relay.Store.commitUpdate(new UpdateFieldMutation({
      fieldId: this.props.field.id,
      fieldName,
      typeIdentifier,
      enumValues,
      isList,
      isRequired,
      defaultValue,
      relationId: ((reverseRelationField || {}).relation || {}).id,
    }), {
      onSuccess: (response) => {
        analytics.track('models/structure: updated field', {
          project: this.props.params.projectName,
          model: this.props.params.modelName,
          field: fieldName,
        })

        this._close()
      },
      onFailure: (transaction) => {
        alert(transaction.getError())
        this._close()
      },
    })
  }

  _isValid () {
    return this.state.fieldName !== ''
  }

  _onSelectType (typeIdentifier) {
    const { field } = this.props

    this.setState({
      typeIdentifier,
      isRequired: field ? field.isRequired : true,
      isList: field ? field.isList : false,
      reverseRelationField: field ? field.reverseRelationField : null,
    })
  }

  _updateEnumValues (enumValues) {
    this.setState({ enumValues })
  }

  _toggleReverseRelation () {
    if (this.state.reverseRelationField) {
      this.setState({ reverseRelationField: null })
    } else {
      const selectedModel = this.props.allModels.find((m) => m.name === this.state.typeIdentifier)
      this.setState({ reverseRelationField: selectedModel.unconnectedReverseRelationFieldsFrom[0] })
    }
  }

  render () {
    if (this.state.loading) {
      return (
        <div className={classes.background}>
          <Loading color='#fff' />
        </div>
      )
    }

    const selectedModel = this.props.allModels.find((m) => m.name === this.state.typeIdentifier)
    const showReverseRelationSection = selectedModel &&
      selectedModel.unconnectedReverseRelationFieldsFrom.length > 0 &&
      !this.props.field
    const reverseRelationFieldLink = `/${this.props.params.projectName}/models/${this.state.typeIdentifier}/structure/edit/${(this.state.reverseRelationField || {}).fieldName}` // eslint-disable-line

    return (
      <div className={classes.background}>
        <ScrollBox innerContainerClassName={classes.scrollBox}>
          <ClickOutside onClickOutside={::this._close}>
            <div className={classes.container} onKeyUp={(e) => e.keyCode === 27 ? this._close() : null}>
              <div className={classes.head}>
                <div className={classes.title}>
                  {this.props.field ? 'Change field' : 'Create a new field'}
                </div>
                <div className={classes.subtitle}>
                  You can change this field later
                </div>
              </div>
              <div className={classes.body}>
                <div className={classes.row}>
                  <div className={classes.left}>
                    Choose a name for your field
                    <Icon
                      width={20}
                      height={20}
                      src={require('assets/icons/info.svg')}
                    />
                  </div>
                  <div className={classes.right}>
                    <input
                      autoFocus={!this.props.field}
                      type='text'
                      placeholder='Fieldname'
                      defaultValue={this.state.fieldName}
                      onChange={(e) => this.setState({ fieldName: e.target.value })}
                      onKeyUp={(e) => e.keyCode === 13 ? this._submit() : null}
                    />
                  </div>
                </div>
                <div className={classes.row}>
                  <div className={classes.left}>
                    Select the type of data
                    <Icon
                      width={20}
                      height={20}
                      src={require('assets/icons/info.svg')}
                    />
                  </div>
                  <div className={classes.right}>
                    <TypeSelection
                      selected={this.state.typeIdentifier}
                      modelNames={this.props.allModels.map((m) => m.name)}
                      select={::this._onSelectType}
                    />
                  </div>
                </div>
                {this.state.typeIdentifier === 'Enum' &&
                  <div className={classes.row}>
                    <div className={classes.enumLeft}>
                      Enum Values
                    </div>
                    <div className={classes.enumRight}>
                      <TagsInput
                        onlyUnique
                        addOnBlur
                        addKeys={[9, 13, 32]}
                        value={this.state.enumValues}
                        onChange={::this._updateEnumValues}
                      />
                    </div>
                  </div>
                }
                {isScalar(this.state.typeIdentifier) &&
                  <div className={classes.rowBlock}>
                    <div className={classes.row}>
                      <div className={classes.left}>
                        Is this field required?
                        <Icon
                          width={20}
                          height={20}
                          src={require('assets/icons/info.svg')}
                        />
                      </div>
                      <div className={classes.right}>
                        <label>
                          <input
                            type='checkbox'
                            defaultChecked={this.state.isRequired}
                            onChange={(e) => this.setState({ isRequired: e.target.value })}
                            onKeyUp={(e) => e.keyCode === 13 ? this._submit() : null}
                          />
                          Required
                        </label>
                      </div>
                    </div>
                    <div className={classes.row}>
                      <div className={classes.left}>
                        Store multiple values
                        <Icon
                          width={20}
                          height={20}
                          src={require('assets/icons/info.svg')}
                        />
                      </div>
                      <div className={classes.right}>
                        <label>
                          <input
                            type='checkbox'
                            defaultChecked={this.state.isList}
                            onChange={(e) => this.setState({ isList: e.target.value })}
                            onKeyUp={(e) => e.keyCode === 13 ? this._submit() : null}
                          />
                          List
                        </label>
                      </div>
                    </div>
                  </div>
                }
                {!isScalar(this.state.typeIdentifier) &&
                  <div className={classes.rowBlock}>
                    {showReverseRelationSection &&
                      <div className={classes.reverseRelationSelection}>
                        <input
                          type='checkbox'
                          checked={!!this.state.reverseRelationField}
                          onChange={::this._toggleReverseRelation}
                        />
                        This field is related to the field
                        {selectedModel.unconnectedReverseRelationFieldsFrom.map((relatedField) => {
                          const selected = this.state.reverseRelationField === relatedField
                          return (
                            <span
                              className={`${classes.relatedField} ${selected ? classes.selected : ''}`}
                              key={relatedField.id}
                              onClick={() => this.setState({ reverseRelationField: relatedField })}
                            >
                              {relatedField.fieldName}
                            </span>
                          )
                        })}
                      </div>
                    }
                    <div className={classes.relationPhrase}>
                      <div>A</div>
                      <div className={classes.modelName}>{this.props.params.modelName}</div>
                      <div>model</div>
                      <div className={`${classes.select} ${this.state.isRequired ? classes.top : classes.bottom}`}>
                        <div
                          className={`${classes.option} ${!this.state.isRequired ? classes.selected : ''}`}
                          onClick={() => this.setState({ isRequired: false })}
                        >
                          can
                        </div>
                        <div
                          className={`${classes.option} ${this.state.isRequired ? classes.selected : ''}`}
                          onClick={() => this.setState({ isRequired: true })}
                        >
                          must
                        </div>
                      </div>
                      <div>
                        be related to
                      </div>
                      <div className={`${classes.select} ${this.state.isList ? classes.top : classes.bottom}`}>
                        <div
                          className={`${classes.option} ${!this.state.isList ? classes.selected : ''}`}
                          onClick={() => this.setState({ isList: false })}
                        >
                          one
                        </div>
                        <div
                          className={`${classes.option} ${this.state.isList ? classes.selected : ''}`}
                          onClick={() => this.setState({ isList: true })}
                        >
                          many
                        </div>
                      </div>
                      <div className={classes.modelName}>{this.state.typeIdentifier}</div>
                      <div>model{this.state.isList ? 's' : ''}</div>
                    </div>
                  </div>
                }
                {!isScalar(this.state.typeIdentifier) &&
                  <div>
                    <div className={classes.relationSchema}>
                      <div className={classes.modelName}>
                        {this.props.params.modelName}
                      </div>
                      <Icon
                        width={40}
                        height={40}
                        src={require('assets/icons/relation-one.svg')}
                      />
                      <div className={classes.arrows}>
                        <Icon
                          width={162}
                          height={18}
                          src={require('assets/icons/arrow-hor.svg')}
                        />
                        {this.state.reverseRelationField &&
                          <Icon
                            className={true ? classes.back : classes.hidden}
                            width={162}
                            height={18}
                            src={require('assets/icons/arrow-hor.svg')}
                          />
                        }
                      </div>
                      <Icon
                        width={40}
                        height={40}
                        src={
                          this.state.isList
                            ? require('assets/icons/relation-many.svg')
                            : require('assets/icons/relation-one.svg')
                        }
                      />
                      <div className={classes.modelName}>
                        {this.state.typeIdentifier}
                      </div>
                    </div>
                    {this.state.reverseRelationField &&
                      <div className={classes.reverseRelation}>
                        <Link
                          className={classes.button}
                          to={reverseRelationFieldLink}
                        >
                          Reverse Relation From&nbsp;
                          <span className={classes.accent}>
                            {this.state.typeIdentifier} ({this.state.reverseRelationField.fieldName})
                          </span>
                        </Link>
                      </div>
                    }
                  </div>
                }
              </div>
              <div className={classes.foot}>
                <div className={classes.button} onClick={::this._close}>
                  Cancel
                </div>
                <button
                  className={`${classes.button} ${this._isValid() ? classes.green : classes.disabled}`}
                  onClick={::this._submit}
                >
                  {this.props.field ? 'Update field' : 'Create field'}
                </button>
              </div>
            </div>
          </ClickOutside>
        </ScrollBox>
      </div>
    )
  }
}

const MappedFieldPopup = mapProps({
  params: (props) => props.params,
  allModels: (props) => props.viewer.project.models.edges.map((edge) => edge.node),
  field: (props) => props.viewer.field,
  modelId: (props) => props.viewer.model.id,
})(FieldPopup)

export default Relay.createContainer(MappedFieldPopup, {
  initialVariables: {
    modelName: null, // injected from router
    projectName: null, // injected from router
    fieldName: null, // injected from router
  },
  prepareVariables: prevVariables => ({
    ...prevVariables,
    fieldExists: !!prevVariables.fieldName,
  }),
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        model: modelByName(projectName: $projectName, modelName: $modelName) {
          id
        }
        field: fieldByName(
          projectName: $projectName
          modelName: $modelName
          fieldName: $fieldName
        ) @include(if: $fieldExists) {
          id
          fieldName
          typeIdentifier
          isRequired
          isList
          enumValues
          defaultValue
          relation {
            id
          }
          reverseRelationField {
            fieldName
          }
        }
        project: projectByName(projectName: $projectName) {
          models(first: 100) {
            edges {
              node {
                id
                name
                unconnectedReverseRelationFieldsFrom(relatedModelName: $modelName) {
                  id
                  fieldName
                  relation {
                    id
                  }
                }
              }
            }
          }
        }
      }
    `,
  },
})
