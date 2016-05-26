import React, { PropTypes } from 'react'
import { Link } from 'react-router'
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
    close: PropTypes.func.isRequired,
    model: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    allModels: PropTypes.array.isRequired,
  }

  static contextTypes = {
    gettingStartedState: PropTypes.object.isRequired,
  }

  constructor (props) {
    super(props)

    const field = props.field || {}

    this.state = {
      loading: false,
      fieldName: field.fieldName || '',
      typeIdentifier: field.typeIdentifier || 'Int',
      isRequired: field.isRequired || false,
      isList: field.isList || false,
      enumValues: field.enumValues || [],
      defaultValue: null,
      reverseRelationField: field.reverseRelationField,
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
      this.props.close()
    }
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
      relationId,
    } = this.state

    Relay.Store.commitUpdate(new AddFieldMutation({
      modelId: this.props.model.id,
      fieldName,
      typeIdentifier,
      enumValues,
      isList,
      isRequired,
      defaultValue,
      relationId,
    }), {
      onSuccess: (response) => {
        analytics.track('models/fields: created field', {
          project: this.props.params.projectName,
          model: this.props.params.modelName,
          field: fieldName,
        })

        this.props.close()

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
      relationId,
    } = this.state

    Relay.Store.commitUpdate(new UpdateFieldMutation({
      fieldId: this.props.field.id,
      fieldName,
      typeIdentifier,
      enumValues,
      isList,
      isRequired,
      defaultValue,
      relationId,
    }), {
      onSuccess: (response) => {
        analytics.track('models/fields: updated field', {
          project: this.props.params.projectName,
          model: this.props.params.modelName,
          field: fieldName,
        })

        this.props.close()
      },
      onFailure: (transaction) => {
        alert(transaction.getError())
      },
    })
  }

  _isValid () {
    return this.state.fieldName !== ''
  }

  _onSelectType (typeIdentifier) {
    const field = this.props.field || {}

    this.setState({
      typeIdentifier,
      isList: field.isList,
      isRequired: field.isRequired,
      reverseRelationField: field.reverseRelationField,
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

    return (
      <div className={classes.background}>
        <ScrollBox innerContainerClassName={classes.scrollBox}>
          <ClickOutside onClickOutside={this.props.close}>
            <div className={classes.container} onKeyUp={(e) => e.keyCode === 27 ? this.props.close() : null}>
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
                      autoFocus={this.props.field === null}
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
                    {selectedModel.unconnectedReverseRelationFieldsFrom.length > 0 &&
                      <div className={classes.reverseRelationSelection}>
                        <input
                          type='checkbox'
                          checked={this.state.reverseRelationField}
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
                      <div className={classes.modelName}>{this.props.model.name}</div>
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
                        {this.props.model.name}
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
                          to={`/${this.props.params.projectName}/models/${this.state.typeIdentifier}/fields`}
                        >
                          Reverse Relation From <span className={classes.accent}>{this.state.typeIdentifier}</span>
                        </Link>
                      </div>
                    }
                  </div>
                }
              </div>
              <div className={classes.foot}>
                <div className={classes.button} onClick={this.props.close}>
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

export default Relay.createContainer(FieldPopup, {
  fragments: {
    field: () => Relay.QL`
      fragment on Field {
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
    `,
  },
})
