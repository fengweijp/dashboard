import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import { Link } from 'react-router'
import mapProps from 'map-props'
import calculateSize from 'calculate-size'
import { Lokka } from 'lokka'
import { Transport } from 'lokka-transport-http'
import { isScalar } from 'utils/graphql'
import Icon from 'components/Icon/Icon'
import * as cookiestore from 'utils/cookiestore'
import Loading from 'components/Loading/Loading'
import Tether from 'components/Tether/Tether'
import HeaderCell from './HeaderCell'
import CheckboxCell from './CheckboxCell'
import Row from './Row'
import NewRow from './NewRow'
import { valueToString, toGQL } from './utils'
import classes from './DataView.scss'

function compareFields (a, b) {
  if (a.fieldName === 'id') return -1
  if (b.fieldName === 'id') return 1
  return a.fieldName.localeCompare(b.fieldName)
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
      sortBy: {
        fieldName: 'id',
        order: 'ASC',
      },
      filter: {},
      lastCursor: null,
      lastLoadedCursor: null,
      newRowVisible: false,
      selectedItemIds: [],
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
      .join(' ')

    const filterQuery = Object.keys(this.state.filter)
      .filter((fieldName) => this.state.filter[fieldName] !== null)
      .map((fieldName) => `${fieldName}: ${this.state.filter[fieldName]}`)
      .join(' ')

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
    return this._loadData()
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

  _updateItem (value, field, callback, itemId, index) {
    const mutation = `
      {
        update${this.props.model.name}(input: {
          id: "${itemId}"
          ${toGQL(value, field)}
          clientMutationId: "lokka-${Math.random().toString(36).substring(7)}"
        }) {
          clientMutationId
        }
      }
    `
    this._lokka.mutate(mutation)
      .then(() => {
        callback(true)

        const { items } = this.state
        items[index][field.fieldName] = value

        this.setState({ items })

        analytics.track('models/data: updated item', {
          project: this.props.params.projectName,
          model: this.props.params.modelName,
          field: field.fieldName,
        })
      })
      .catch(() => callback(false))
  }

  _addItem (fieldValues) {
    const inputString = fieldValues
      .mapToArray((fieldName, obj) => obj)
      .filter(({ value }) => value !== null)
      .map(({ field, value }) => toGQL(value, field))
      .join(' ')

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
        this.setState({ newRowVisible: false })

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

    return this.props.fields.mapToObject(
      (field) => field.fieldName,
      (field) => {
        const cellWidths = this.state.items
          .map((item) => item[field.fieldName])
          .map((value) => valueToString(value, field))
          .map((str) => calculateSize(str, cellFontOptions).width + 40)

        const headerWidth = calculateSize(`${field.fieldName} ${field.typeIdentifier}`, headerFontOptions).width + 90

        const maxWidth = Math.max(...cellWidths, headerWidth)
        const lowerLimit = 150
        const upperLimit = 400

        return maxWidth > upperLimit ? upperLimit : (maxWidth < lowerLimit ? lowerLimit : maxWidth)
      }
    )
  }

  _onSelectRow (itemId) {
    const index = this.state.selectedItemIds.indexOf(itemId)
    if (index > -1) {
      this.state.selectedItemIds.splice(index, 1)
      const selectedItemIds = this.state.selectedItemIds
      this.setState({selectedItemIds: selectedItemIds})
    } else {
      const selectedItemIds = this.state.selectedItemIds.concat(itemId)
      this.setState({selectedItemIds: selectedItemIds})
    }
  }

  _isSelected (itemId) {
    return this.state.selectedItemIds.indexOf(itemId) > -1
  }

  _selectAllOnClick (event) {
    if (event.target.checked) {
      const selectedItemIds = this.state.items.map((item) => item.id)
      this.setState({selectedItemIds: selectedItemIds})
    } else {
      this.setState({selectedItemIds: []})
    }
  }

  _deleteSelectedItems () {
    if (confirm(`Do you really want to delete ${this.state.selectedItemIds.length} item(s)?`)) {
      // TODO: delete items mutation
      this.setState({selectedItemIds: []})
    }
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
            </div>
          </div>
          <div className={classes.headRight}>
            <Tether
              steps={{
                STEP6_ADD_DATA_ITEM_1: `Add your first Todo item to the database.
                It doesn\'t matter what you type here.`,
                STEP7_ADD_DATA_ITEM_2: 'Well done. Let\'s add another one.',
              }}
              offsetX={-5}
              offsetY={5}
              width={290}
            >
              <div
                className={`${classes.button} ${classes.green}`}
                onClick={() => this.setState({ newRowVisible: true })}
              >
                <Icon
                  width={16}
                  height={16}
                  src={require('assets/icons/add.svg')}
                />
                <span>Add item</span>
              </div>
            </Tether>
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
            {this.state.selectedItemIds.length > 0 &&
              <div className={`${classes.button} ${classes.red}`} onClick={::this._deleteSelectedItems}>
                <Icon
                  width={16}
                  height={16}
                  src={require('assets/icons/delete.svg')}
                />
                <span>Delete Selected Items</span>
              </div>
            }
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
            <Loading color='#fff' />
          </div>
        }
        <div className={classes.table}>
          <div className={classes.tableContainer} style={{ width: tableWidth }}>
            <div className={classes.tableHead}>
              <CheckboxCell
                name='all'
                onChange={(event) => this._selectAllOnClick(event)}
                checked={this.state.selectedItemIds.length === this.state.items.length}
              />
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
            {this.state.newRowVisible &&
              <NewRow
                fields={this.props.fields}
                columnWidths={columnWidths}
                add={(data) => this._addItem(data)}
              />
            }
            <div className={classes.tableBody} onScroll={::this._handleScroll}>
              {this.state.items.map((item, index) => (
                <Row
                  key={item.id}
                  fields={this.props.fields}
                  columnWidths={columnWidths}
                  item={item}
                  update={(key, value, callback) => this._updateItem(key, value, callback, item.id, index)}
                  isSelected={this._isSelected(item.id)}
                  onSelect={(event) => this._onSelectRow(item.id)}
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
      .sort(compareFields)
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
                isRequired
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
