import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import mapProps from 'map-props'
import classes from './DataTab.scss'
import { Lokka } from 'lokka'
import { Transport } from 'lokka-transport-http'

const lokka = new Lokka({
  transport: new Transport('http://localhost:60000/graphql/cilkohu7e00063mi6s5sjtrqn'),
})

export class DataTab extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    modelName: PropTypes.string.isRequired,
    fields: PropTypes.array.isRequired,
  };

  constructor (props) {
    super(props)

    this.state = {
      items: [],
    }
  }

  componentWillMount () {
    const fieldNames = this.props.fields.map((field) => field.fieldName).join(',')
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
    lokka.query(query)
      .then((results) => {
        const items = results.viewer.allStorys.edges.map((edge) => edge.node)
        this.setState({ items })
      })
  }

  render () {
    return (
      <div className={classes.root}>
        <table>
          <thead>
            <tr>
              {this.props.fields.map((field) => (
                <th>{field.fieldName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {this.state.items.map((item) => (
              <tr>
                {this.props.fields.map((field) => {
                  return <td>{item[field.fieldName]}</td>
                })}
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
  fields: (props) => props.viewer.model.fields.edges.map((edge) => edge.node),
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
              }
            }
          }
        }
      }
    `,
  },
})
