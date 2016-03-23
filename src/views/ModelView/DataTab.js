import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import mapProps from 'map-props'
import { Lokka } from 'lokka'
import { Transport } from 'lokka-transport-http'
import { isScalar } from 'utils/graphql'
import Icon from 'components/Icon/Icon'
import classes from './DataTab.scss'

export class DataTab extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    modelName: PropTypes.string.isRequired,
    fields: PropTypes.array.isRequired,
  };

  constructor (props) {
    super(props)

    const clientEndpoint = `${__BACKEND_ADDR__}/graphql/${this.props.params.projectId}`
    const token = window.localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }
    const transport = new Transport(clientEndpoint, { headers })

    this._lokka = new Lokka({ transport })

    this.state = {
      items: [],
    }
  }

  componentWillMount () {
    const fieldNames = this.props.fields
      .map((field) => field.fieldName)
      .join(',')
    const query = `
      {
        viewer {
          all${this.props.modelName}s {
            edges {
              node {
                ${fieldNames}
              }
            }
          }
        }
      }
    `
    this._lokka.query(query)
      .then((results) => {
        const items = results.viewer[`all${this.props.modelName}s`].edges.map((edge) => edge.node)
        this.setState({ items })
      })
  }

  _deleteItem (item) {
    const mutation = `
      {
        delete${this.props.modelName}(input: {
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
        this.setState({ items })
      })
  }

  render () {
    return (
      <div className={classes.root}>
        <div onClick={this._toggleOverlay} className={classes.add}>+ Add {this.props.modelName}</div>
        <table className={classes.table}>
          <thead>
            <tr>
              {this.props.fields.map((field) => (
                <th key={field.id}>{field.fieldName}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.items.map((item) => (
              <tr key={item.id}>
                {this.props.fields.map((field) => {
                  let str = 'null'
                  if (item[field.fieldName] !== null) {
                    str = item[field.fieldName].toString()
                    if (str.length > 50) {
                      str = str.substr(0, 47) + '...'
                    }
                  }
                  return <td key={field.id}>{str}</td>
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
      </div>
    )
  }
}

const MappedDataTab = mapProps({
  params: (props) => props.params,
  fields: (props) => (
    props.viewer.model.fields.edges
      .map((edge) => edge.node)
      .filter((field) => isScalar(field.typeIdentifier))
  ),
  modelName: (props) => props.viewer.model.name,
})(DataTab)

export default Relay.createContainer(MappedDataTab, {
  initialVariables: {
    modelId: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        model(id: $modelId) {
          name
          fields(first: 100) {
            edges {
              node {
                id
                fieldName
                typeIdentifier
              }
            }
          }
        }
      }
    `,
  },
})
