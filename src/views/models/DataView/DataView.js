import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import { Link } from 'react-router'
import { findDOMNode } from 'react-dom'
import mapProps from 'map-props'
import calculateSize from 'calculate-size'
import { Lokka } from 'lokka'
import { Transport } from 'lokka-transport-http'
import { isScalar, isValidValueForType } from 'utils/graphql'
import Icon from 'components/Icon/Icon'
import * as cookiestore from 'utils/cookiestore'
import Tether from 'components/Tether/Tether'
import Loading from 'react-loading'
import HeaderCell from './HeaderCell'
import Row from './Row'
import Cell from './Cell'
import classes from './DataView.scss'

function mapToObject ({ array, key, val }) {
  return array.reduce((o, v) => {
    o[key(v)] = val(v)
    return o
  }, {})
}

class DataView extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    fields: PropTypes.array.isRequired,
    projectId: PropTypes.string.isRequired,
    model: PropTypes.object.isRequired,
  }

  static contextTypes = {
    gettingStartedState: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  }

  constructor (props) {
    super(props)

    const clientEndpoint = `${__BACKEND_ADDR__}/graphql/${this.props.projectId}`
    const token = cookiestore.get('graphcool_token')
    const headers = { Authorization: `Bearer ${token}`, 'X-GraphCool-Source': 'dashboard:data-tab' }
    const transport = new Transport(clientEndpoint, { headers })

    this._lokka = new Lokka({ transport })

    this.state = {
      menuDropdownVisible: false,
      items: [],
      loading: true,
      editingFieldId: null,
      savingFieldId: null,
      sortBy: { fieldName: 'id', order: 'ASC' },
      filter: {},
      lastCursor: null,
      lastLoadedCursor: null,
    }
  }

  componentWillMount () {
    this._reloadData()
  }

  componentDidMount () {
    analytics.track('models/data: viewed', {
      model: this.props.params.modelName,
    })
  }

  _toggleMenuDropdown () {
    this.setState({ menuDropdownVisible: !this.state.menuDropdownVisible })
  }

  _handleScroll (e) {
    if (e.target.scrollHeight - (e.target.scrollTop + e.target.offsetHeight) < 50) {
      this._loadNextPage()
    }
  }

  _setSortOrder (field) {
    const order = this.state.sortBy.fieldName === field.fieldName
      ? (this.state.sortBy.order === 'ASC' ? 'DESC' : 'ASC')
      : 'ASC'

    this.setState({
      sortBy: {
        fieldName: field.fieldName,
        order,
      },
    }, this._reloadData)
  }

  _loadData (afterCursor = null) {
    const fieldNames = this.props.fields
      .map((field) => isScalar(field.typeIdentifier)
        ? field.fieldName
        : `${field.fieldName} { id }`)
      .join(',')

    const filterQuery = Object.keys(this.state.filter)
      .filter((fieldName) => this.state.filter[fieldName] !== null)
      .map((fieldName) => `${fieldName}: ${this.state.filter[fieldName]}`)
      .join(',')

    const filter = filterQuery !== '' ? `filter: { ${filterQuery} }` : ''
    const after = afterCursor !== null ? `after: "${afterCursor}"` : ''
    const orderBy = `orderBy: ${this.state.sortBy.fieldName}_${this.state.sortBy.order}`
    const query = `
      {
        viewer {
          all${this.props.model.name}s(first: 50 ${after} ${filter} ${orderBy}) {
            edges {
              node {
                ${fieldNames}
              }
              cursor
            }
          }
        }
      }
    `
    return this._lokka.query(query)
    .then((results) => {
      const edges = results.viewer[`all${this.props.model.name}s`].edges
      if (edges.length !== 0) {
        this.setState({lastCursor: edges[edges.length-1].cursor})
      }
      return results
    })
  }

  _loadNextPage () {
    if (this.state.lastLoadedCursor !== null && this.state.lastCursor === this.state.lastLoadedCursor) {
      return
    }

    this.setState({ loading: true })
    this._loadData(this.state.lastCursor)
      .then((results) => {
        const items = results.viewer[`all${this.props.model.name}s`].edges.map(({ node }) => node)
        this.setState({
          items: this.state.items.concat(items),
          loading: false,
        })
      })
    this.setState({ lastLoadedCursor: this.state.lastCursor })
  }

  _reloadData () {
    this.setState({ loading: true })
    this._loadData()
    .then((results) => {
      const items = results.viewer[`all${this.props.model.name}s`].edges.map((edge) => edge.node)
      this.setState({ items, loading: false })
    })
  }

  _updateFilter (value, field) {
    const { filter } = this.state
    filter[field.fieldName] = value
    this.setState({ filter }, this._reloadData)
  }

  _deleteItem (item) {
    this.setState({ loading: true })
    const mutation = `
      {
        delete${this.props.model.name}(input: {
          id: "${item.id}",
          clientMutationId: "lokka-${Math.random().toString(36).substring(7)}"
        }) {
          clientMutationId
        }
      }
    `
    this._lokka.mutate(mutation)
      .then(() => {
        const items = this.state.items.filter((i) => i.id !== item.id)
        this.setState({ items, loading: false })

        analytics.track('models/data: deleted item', {
          project: this.props.params.projectName,
          model: this.props.params.modelName,
        })
      })
  }

  _startEditing (field, fieldId) {
    if (field.fieldName !== 'id' && this.state.editingFieldId === null) {
      this.setState({editingFieldId: fieldId})
    }
  }

  _isValidValue (field, value) {
    if (value === '' && !field.isRequired) {
      return true
    }
    if (field.isList) {
      if (value === '[]') {
        return true
      }
      if (value[0] !== '[' || value[value.length-1] !== ']') {
        return false
      } else {
        value = value.substring(1, value.length - 1)
      }
    }

    let invalidValue = false;
    (field.isList ? value.split(',').map((x) => x.trim()) : [value]).forEach((value) => {
      if (!isValidValueForType(value, isScalar(field.typeIdentifier) ? field.typeIdentifier : 'GraphQLID')) {
        invalidValue = true
        return
      }
    })

    return !invalidValue
  }

  _updateFieldOnEnter (e, item, field, fieldId, value) {
    if (e.keyCode === 13) {
      this._updateField(item, field, fieldId, value)
    }
  }

  _updateField (item, field, fieldId, value) {
    if (value === '') {
      // todo: this should set to null but currently null is not supported by our api
      this.setState({editingFieldId: null, savingFieldId: null})
      return
    }

    const newDisplayValue = isScalar(field.typeIdentifier)
    ? (field.isList
      ? value.substring(1, value.length-1).split(',')
        .map((x) => field.typeIdentifier === 'String' ? x.trim().substring(1, x.trim().length-1) : x)
      : value)
    : {id: value}

    const fieldHasChanged =
      (item[field.fieldName] == null ? item[field.fieldName] : item[field.fieldName].toString()) !==
      newDisplayValue.toString()

    if (!fieldHasChanged) {
      this.setState({editingFieldId: null, savingFieldId: null})
      return
    }

    if (!this._isValidValue(field, value)) {
      alert(`'${value}' is not a valid value for field ${field.fieldName}`)
      return
    }

    this.setState({ savingFieldId: fieldId })
    const inputString = this._parseValueForField(field, value)
    const mutation = `
      {
        update${this.props.model.name}(input: {
          id: "${item.id}",
          ${inputString},
          clientMutationId: "lokka-${Math.random().toString(36).substring(7)}"
        }) {
          clientMutationId
        }
      }
    `
    this._lokka.mutate(mutation)
      .then(() => {
        item[field.fieldName] = newDisplayValue
        this.setState({
          editingFieldId: null,
          savingFieldId: null,
        })

        analytics.track('models/data: updated item', {
          project: this.props.params.projectName,
          model: this.props.params.modelName,
          field: field.fieldName,
        })
      })
  }

  _parseValueForField (field, rawValue) {
    if (rawValue === '') {
      // todo: this should set to null but currently null is not supported by our api
      return ''
    }
    const key = isScalar(field.typeIdentifier) ? field.fieldName : `${field.fieldName}Id`

    const parseSingle = (rawValue) => {
      switch (field.typeIdentifier) {
        case 'String': return `"${rawValue}"`
        case 'Int': return parseInt(rawValue, 10)
        case 'Float': return parseFloat(rawValue)
        case 'Boolean': return `${rawValue === 'true'}`
        case 'Enum' : return rawValue
        default: return `"${rawValue}"`
      }
    }

    if (field.isList) {
      return `${key}: ${rawValue}`
    } else {
      return `${key}: ${parseSingle(rawValue)}`
    }
  }

  _add () {
    const fieldValues = this.props.fields
      .filter((field) => field.fieldName !== 'id')
      .map((field) => {
        const rawValue = findDOMNode(this.refs[field.id]).value
        const parsedValue = this._parseValueForField(field, rawValue)

        return {field, rawValue, parsedValue}
      })

    const invalidFields = fieldValues.filter(({field, rawValue}) => !this._isValidValue(field, rawValue))
    if (invalidFields.length !== 0) {
      alert(`'${invalidFields[0].rawValue}' is not a valid value for field ${invalidFields[0].field.fieldName}`)
      return
    }

    const inputString = fieldValues.map(({parsedValue}) => parsedValue)

    this.setState({ loading: true })
    const mutation = `
      {
        create${this.props.model.name}(input: {
          ${inputString},
          clientMutationId: "lokka-${Math.random().toString(36).substring(7)}"
        }) {
          clientMutationId
        }
      }
    `
    this._lokka.mutate(mutation)
      .then(::this._reloadData)
      .then(() => {
        analytics.track('models/data: created item', {
          project: this.props.params.projectName,
          model: this.props.params.modelName,
        })

        // getting-started onboarding step
        if (this.props.model.name === 'Todo' && (
           this.context.gettingStartedState.isActive('STEP6_ADD_DATA_ITEM_1') ||
           this.context.gettingStartedState.isActive('STEP7_ADD_DATA_ITEM_2')
             )) {
          this.context.gettingStartedState.nextStep()
        }
      })
  }

  _filterOnEnter (e) {
    if (e.keyCode === 13) {
      this.setState({filter: e.target.value, items: [], loading: true}, () => this._reloadData())
    }
  }

  _filterOnBlur (e) {
    if (this.state.filter !== e.target.value) {
      this.setState({filter: e.target.value, items: [], loading: true}, () => this._reloadData())
    }
  }

  _listenForEnter (e) {
    if (e.keyCode === 13) {
      this._add()
    }
  }

  valueOrDefault (value, field) {
    if (value !== null && value !== undefined) {
      return value
    }
    if (field.defaultValue !== undefined) {
      return field.defaultValue
    }
    return null
  }

  renderContent () {
    return (
      <div onScroll={::this._handleScroll} className={classes.root}>
        <table className={classes.table}>
          <thead>
            <tr>
              {this.props.fields.map((field) => (
                <th key={field.id} onClick={() => this._setSortOrder(field)}>
                  {field.fieldName}
                  {this.state.sortBy.fieldName === field.fieldName && <Icon
                    src={require('assets/icons/arrow.svg')}
                    color='#70738C'
                    className={this.state.sortBy.order === 'DESC' ? classes.reverse : ''}
                    />}
                </th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr id='newDataItem' className={classes.addRow}>
              <td>ID (generated)</td>
              {this.props.fields.filter((f) => f.fieldName !== 'id').map((field) => {
                let element
                switch (field.isList ? 'String' : field.typeIdentifier) {
                  case 'Boolean':
                    element = (
                      <select defaultValue='false' ref={field.id} key={field.id}>
                        <option value='true'>true</option>
                        <option value='false'>false</option>
                      </select>
                    )
                    break
                  case 'Enum':
                    element = (
                      <select defaultValue={field.defaultValue} ref={field.id} key={field.id}>
                        {field.enumValues.map((value) =>
                          <option key={value} value={value}>{value}</option>
                        )}
                      </select>
                    )
                    break
                  default:
                    element = (
                      <input
                        onKeyUp={::this._listenForEnter}
                        ref={field.id}
                        placeholder={field.defaultValue !== null ? field.defaultValue : field.fieldName}
                        type='text'
                      />
                    )
                    if (
                      this.props.model.name === 'Todo' &&
                      field.fieldName === 'text' &&
                      (this.context.gettingStartedState.isActive('STEP6_ADD_DATA_ITEM_1') ||
                      this.context.gettingStartedState.isActive('STEP7_ADD_DATA_ITEM_2'))) {
                      element = (
                        <Tether
                          steps={{
                            STEP6_ADD_DATA_ITEM_1: `Add your first Todo item to the database.
                            It doesn\'t matter what you type here.`,
                            STEP7_ADD_DATA_ITEM_2: 'Well done. Let\'s add another one.',
                          }}
                          offsetX={-10}
                          offsetY={5}
                          width={290}
                        >
                          {element}
                        </Tether>
                      )
                    }
                }
                return (
                  <td key={field.id}>{element}</td>
                )
              })}
              <td onClick={::this._add} className={classes.addButton}>
                <span>Add item</span>
              </td>
            </tr>
            {this.state.items.map((item) => (
              <tr key={item.id}>
                {this.props.fields.map((field) => {
                  let str = 'null'
                  const fieldValue = isScalar(field.typeIdentifier)
                    ? this.valueOrDefault(item[field.fieldName], field)
                    : (item[`${field.fieldName}`] !== null ? item[`${field.fieldName}`].id : null)
                  if (fieldValue !== null) {
                    str = field.isList
                    ? `[${field.typeIdentifier === 'String'
                      ? fieldValue.toString().split(',').reduce((acc, e, i) => acc + `${i !== 0 ? ',': ''} "${e}"`, '')
                      : fieldValue.toString()}]`
                    : fieldValue.toString()
                    if (str.length > 50) {
                      str = str.substr(0, 47) + '...'
                    }
                  }
                  const fieldId = `${item.id}:${field.id}`
                  if (this.state.editingFieldId === fieldId) {
                    return <td key={fieldId}>
                      {!field.isList && field.typeIdentifier === 'Boolean'
                      ? <select onChange={(e) => this._updateField(item, field, fieldId, e.target.value)}
                        onBlur={(e) => this._updateField(item, field, fieldId, e.target.value)}
                        autoFocus defaultValue={str}>
                        <option value={'true'}>true</option>
                        <option value={'false'}>false</option>
                      </select>
                      : !field.isList && field.typeIdentifier === 'Enum'
                      ? <select defaultValue={str}
                        onChange={(e) => this._updateField(item, field, fieldId, e.target.value)}
                        onBlur={(e) => this._updateField(item, field, fieldId, e.target.value)}>
                        {field.enumValues.map((value) =>
                          <option key={value} value={value}>{value}</option>
                        )}
                      </select>
                      : <input autoFocus type='text' defaultValue={str}
                        onKeyUp={(e) => this._updateFieldOnEnter(e, item, field, fieldId, e.target.value)}
                        onBlur={(e) => this._updateField(item, field, fieldId, e.target.value)} />}
                    </td>
                  } else {
                    return <td className={classes.padding}
                      onDoubleClick={() => this._startEditing(field, fieldId)} key={fieldId}>{str}</td>
                  }
                })}
                <td>
                  <span onClick={() => this._deleteItem(item)}>
                    <Icon src={require('assets/icons/delete.svg')} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {this.state.loading && (
          <div style={{width: '100%', height: 50, marginTop: -70, display: 'flex',
            alignItems: 'center', justifyContent: 'center'}}>
            <Loading type='bubbles' delay={0} color='#8989B1' />
          </div>
        )}
      </div>
    )
  }

  _mapToCells = (item, columnWidths) => {
    return this.props.fields.map((field) => {
      return {
        field,
        value: item[field.fieldName],
        width: columnWidths[field.fieldName],
      }
    })
  }

  _calculateColumnWidths () {
    const cellFontOptions = {
      font: 'Open Sans',
      fontSize: '12px',
    }
    const headerFontOptions = {
      font: 'Open Sans',
      fontSize: '12px',
    }

    return mapToObject({
      array: this.props.fields,
      key: (field) => field.fieldName,
      val: (field) => {
        const cellWidths = this.state.items
          .map((item) => item[field.fieldName])
          .map((value) => Cell.valueToString(value, field))
          .map((str) => calculateSize(str, cellFontOptions).width + 40)

        const headerWidth = calculateSize(`${field.fieldName} ${field.typeIdentifier}`, headerFontOptions).width + 90

        const maxWidth = Math.max(...cellWidths, headerWidth)
        const lowerLimit = 150
        const upperLimit = 400

        return maxWidth > upperLimit ? upperLimit : (maxWidth < lowerLimit ? lowerLimit : maxWidth)
      },
    })
  }

  render () {
    const columnWidths = this._calculateColumnWidths()
    const tableWidth = this.props.fields.reduce((sum, { fieldName }) => sum + columnWidths[fieldName], 0)

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
            <div
              className={`${classes.button} ${classes.green}`}
              onClick={() => this.setState({ showPopup: true })}
            >
              <Icon
                width={16}
                height={16}
                src={require('assets/icons/add.svg')}
              />
              <span>Add item</span>
            </div>
            <Link
              to={`/${this.props.params.projectName}/models/${this.props.params.modelName}/fields`}
              className={classes.button}
              >
              <Icon
                width={16}
                height={16}
                src={require('assets/icons/edit.svg')}
              />
              <span>Edit Structure</span>
            </Link>
            <div className={classes.button} onClick={::this._toggleMenuDropdown}>
              <Icon
                width={16}
                height={16}
                src={require('assets/icons/more.svg')}
              />
            </div>
            {this.state.menuDropdownVisible &&
              <div className={classes.menuDropdown}>

              </div>
            }
          </div>
        </div>
        {this.state.loading &&
          <div className={classes.loading}>
            <Loading type='bubbles' delay={0} color='#fff' />
          </div>
        }
        <div className={classes.table}>
          <div className={classes.tableContainer} style={{ width: tableWidth }}>
            <div className={classes.tableHead}>
              {this.props.fields.map((field) => (
                <HeaderCell
                  key={field.id}
                  field={field}
                  width={columnWidths[field.fieldName]}
                  sortOrder={this.state.sortBy.fieldName === field.fieldName ? this.state.sortBy.order : null}
                  toggleSortOrder={() => this._setSortOrder(field)}
                  updateFilter={(value) => this._updateFilter(value, field)}
                />
              ))}
            </div>
            <div className={classes.tableBody} onScroll={::this._handleScroll}>
              {this.state.items.map((item) => (
                <Row
                  cells={this._mapToCells(item, columnWidths)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const MappedDataView = mapProps({
  params: (props) => props.params,
  fields: (props) => (
    props.viewer.model.fields.edges
      .map((edge) => edge.node)
      .filter((field) => isScalar(field.typeIdentifier) || !field.isList)
      .sort((a, b) => a.fieldName.localeCompare(b.fieldName))
  ),
  model: (props) => props.viewer.model,
  projectId: (props) => props.viewer.project.id,
})(DataView)

export default Relay.createContainer(MappedDataView, {
  initialVariables: {
    modelName: null, // injected from router
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        model: modelByName(projectName: $projectName, modelName: $modelName) {
          name
          itemCount
          fields(first: 100) {
            edges {
              node {
                id
                fieldName
                typeIdentifier
                isList
                enumValues
                defaultValue
              }
            }
          }
        }
        project: projectByName(projectName: $projectName) {
          id
        }
      }
    `,
  },
})
