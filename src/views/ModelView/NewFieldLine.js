import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import { findDOMNode } from 'react-dom'
// import TagsInput from 'react-tagsinput'
import AddFieldMutation from 'mutations/AddFieldMutation'
import Tether from 'components/Tether/Tether'
import Icon from 'components/Icon/Icon'
import classes from './NewFieldLine.scss'

import 'react-tagsinput/react-tagsinput.css'

const types = {
  'Int': 'Integer',
  'Float': 'Float',
  'Boolean': 'Boolean',
  'String': 'String',
  'GraphQLID': 'ID',
  'Enum': 'Enum',
}

export default class NewFieldLine extends React.Component {

  static propTypes = {
    modelNames: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired,
    callback: PropTypes.func.isRequired,
    projectId: PropTypes.string.isRequired,
    modelId: PropTypes.string.isRequired,
  };

  static contextTypes = {
    gettingStartedState: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props)

    this.state = {
      typeIdentifier: Object.keys(types)[0],
      enumValues: [],
      defaultValue: null,
    }
  }

  _addField () {
    const fieldName = findDOMNode(this.refs.fieldName).value
    const typeIdentifier = findDOMNode(this.refs.typeIdentifier).value
    const enumValues = this.state.enumValues
    const isList = findDOMNode(this.refs.list).checked
    const isRequired = findDOMNode(this.refs.required).checked
    const defaultValue = this.state.defaultValue

    if (!fieldName) {
      return
    }

    Relay.Store.commitUpdate(new AddFieldMutation({
      modelId: this.props.modelId,
      projectId: this.props.projectId,
      fieldName,
      typeIdentifier,
      enumValues,
      isList,
      isRequired,
      defaultValue,
    }), {
      onSuccess: (response) => {
        this.props.callback(response.addField.fieldEdge.node)
        this._reset()

        // getting-started onboarding step
        if (
           (this.context.gettingStartedState.isActive('STEP3_CREATE_TEXT_FIELD') &&
            fieldName === 'text' && typeIdentifier === 'String') ||
          (this.context.gettingStartedState.isActive('STEP4_CREATE_COMPLETED_FIELD') &&
           fieldName === 'complete' && typeIdentifier === 'Boolean')
        ) {
          this.context.gettingStartedState.nextStep()
        }
      },
      onFailure: (transaction) => {
        alert(transaction.getError())
      },
    })
  }

  _reset () {
    this.setState({
      typeIdentifier: Object.keys(types)[0],
      enumValues: [],
      defaultValue: null,
    })
    findDOMNode(this.refs.fieldName).value = ''
    findDOMNode(this.refs.list).checked = false
    findDOMNode(this.refs.required).checked = false
  }

  _onEnumChange (enumValues) {
    this.setState({ enumValues })
  }

  _onSelectTypeIdentifier (e) {
    this.setState({ typeIdentifier: e.target.value })
  }

  _onCheckRequired (e) {
    if (e.target.checked && this.state.defaultValue === null) {
      const defaultValue = window.prompt('Please enter a default value')
      if (defaultValue) {
        this.setState({ defaultValue })
      } else {
        findDOMNode(this.refs.required).checked = false
      }
    }
  }

  render () {
    return (
      <tr className={classes.root}>
        <td className={classes.fieldName}>
          <Tether
            steps={{
              STEP3_CREATE_TEXT_FIELD: 'Add a new field called "text" and select type "String".' +
              ' Then click the "Add Field" button.',
              STEP4_CREATE_COMPLETED_FIELD: 'Good job! Create another one called "complete" with type "Boolean"',
            }}
            offsetX={-26}
            offsetY={10}
          >
            <input
              ref='fieldName'
              type='text'
              placeholder='Fieldname'
              id='newFieldName'
            />
          </Tether>
        </td>
        <td className={classes.type}>
          <div>
            <select
              onChange={::this._onSelectTypeIdentifier}
              ref='typeIdentifier'
              value={this.state.typeIdentifier}
              >
              {Object.keys(types).map((type) => (
                <option key={type} value={type}>{types[type]}</option>
              ))}
              {this.props.modelNames.map((modelName) => (
                <option key={modelName} value={modelName}>{modelName}</option>
              ))}
            </select>
            <label>
              <input ref='list' type='checkbox' />
              <span>List</span>
            </label>
          </div>
        </td>
        <td className={classes.constraints}>
          <label>
            <input onChange={::this._onCheckRequired} ref='required' type='checkbox' />
            <span>Required</span>
          </label>
        </td>
        <td className={classes.submit}>
          <button onClick={::this._addField}>
            Add field
            <Icon src={require('assets/icons/enter.svg')} />
          </button>
        </td>
      </tr>
    )
  }
}
