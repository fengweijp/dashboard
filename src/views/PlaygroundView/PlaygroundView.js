import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import mapProps from 'map-props'
import { Lokka } from 'lokka'
import { Transport } from 'lokka-transport-http'
import GraphiQL from 'graphiql'
import { saveQuery } from 'utils/QueryHistoryStorage'
import QueryHistory from 'components/QueryHistory/QueryHistory'
import Icon from 'components/Icon/Icon'
import endpoints from 'utils/endpoints'
import classes from './PlaygroundView.scss'
import LoginClientUserMutation from 'mutations/LoginClientUserMutation'

import 'graphiql/graphiql.css'

const DASHBOARD_ADMIN = {
  id: '0',
  email: 'ADMIN',
  roles: null,
}

const DEFAULT_QUERY = `{
  allUsers {
    id
    email
  }
}`

class PlaygroundView extends React.Component {
  static propTypes = {
    projectId: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props)

    const clientEndpoint = `${__BACKEND_ADDR__}/graphql/${this.props.projectId}`
    const token = window.localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}`, 'X-GraphCool-Source': 'dashboard:playground' }
    const transport = new Transport(clientEndpoint, { headers })

    this._lokka = new Lokka({ transport })

    this.state = {
      users: [DASHBOARD_ADMIN],
      historyVisible: false,
      query: undefined,
      variables: undefined,
      selectedEndpoint: window.localStorage.getItem('SELECTED_ENDPOINT') || 'SIMPLE',
      selectedUserId: DASHBOARD_ADMIN.id,
      selectedUserToken: null,
    }
  }

  componentWillMount () {
    const query = `
      {
        viewer {
          allUsers {
            edges {
              node {
                id
                email
                roles
              }
            }
          }
        }
      }
    `
    this._lokka.query(query)
      .then((results) => {
        const users = results.viewer.allUsers.edges.map((edge) => edge.node)
        this.setState({ users: [DASHBOARD_ADMIN, ...users] })
      })
  }

  componentDidMount () {
    analytics.track('playground: viewed', {
      project: this.props.params.projectName,
    })
  }

  _onHistoryQuerySelect (query) {
    if (query) {
      this.setState({
        query: query.query,
        variables: query.variables,
      })
    }

    this.setState({ historyVisible: false })
  }

  _changeEndpoint (e) {
    const selectedEndpoint = e.target.value
    this.setState({ selectedEndpoint })
    window.localStorage.setItem('SELECTED_ENDPOINT', selectedEndpoint)

    analytics.track('playground: endpoint changed', {
      project: this.props.params.projectName,
      endpoint: selectedEndpoint,
    })
  }

  _changeUser (e) {
    const selectedUserId = e.target.value

    if (selectedUserId === DASHBOARD_ADMIN.id) {
      this.setState({selectedUserId, selectedUserToken: null})
    } else {
      Relay.Store.commitUpdate(new LoginClientUserMutation({
        clientUserId: selectedUserId,
        projectId: this.props.projectId,
      }), {
        onSuccess: (response) => {
          this.setState({selectedUserId, selectedUserToken: response.signinClientUser.token})

          analytics.track('playground: user changed', {
            project: this.props.params.projectName,
            userId: selectedUserId,
          })
        },
        onFailure: (transaction) => {
          alert(transaction.getError())
        },
      })
    }
  }

  render () {
    const token = this.state.selectedUserToken || window.localStorage.getItem('token')
    const fetcher = (graphQLParams) => (
      fetch(`${__BACKEND_ADDR__}/${endpoints[this.state.selectedEndpoint].alias}/${this.props.projectId}`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-GraphCool-Source': 'dashboard:playground',
        },
        body: JSON.stringify(graphQLParams),
      })
      .then((response) => {
        // exclude IntrospectionQuery
        if (response.ok && !graphQLParams.query.includes('IntrospectionQuery')) {
          analytics.track('playground: run', {
            project: this.props.params.projectName,
            endpoint: this.state.selectedEndpoint,
          })

          // save query for query history
          const query = {
            query: graphQLParams.query,
            variables: graphQLParams.variables,
            date: new Date(),
          }
          saveQuery(query, this.props.projectId)
        }

        return response.json()
      })
    )

    return (
      <div className={classes.root}>
        <div className={classes.head}>
          <div
            className={classes.history}
            onClick={() => this.setState({ historyVisible: !this.state.historyVisible })}
            >
            {this.state.historyVisible &&
              <div className={classes.historyOverlay}>
                <QueryHistory
                  projectId={this.props.projectId}
                  onQuerySelect={::this._onHistoryQuerySelect}
                  />
              </div>
            }
            <Icon
              src={require(`assets/icons/${this.state.historyVisible ? 'close' : 'history'}.svg`)}
              width={20}
              height={20}
              />
            <span>{this.state.historyVisible ? 'Close' : 'History'}</span>

          </div>
          <div className={classes.endpoint}>
            <select onChange={::this._changeEndpoint} value={this.state.selectedEndpoint}>
              {Object.keys(endpoints).map((endpoint) => (
                <option key={endpoint} value={endpoint}>{endpoints[endpoint].title}</option>
              ))}
            </select>
          </div>
          <div className={classes.user}>
            <select value={this.state.selectedUserId} onChange={::this._changeUser}>
              {this.state.users.map((user) => {
                const rolesStr = user.roles ? `(${user.roles.join(', ')})` : ''
                return (
                  <option key={user.id} value={user.id}>
                    {user.email} {rolesStr}
                  </option>
                )
              })}
            </select>
          </div>
        </div>
        <GraphiQL
          key={this.state.selectedEndpoint}
          fetcher={fetcher}
          query={this.state.query || DEFAULT_QUERY}
          variables={this.state.variables || ''}
          />
      </div>
    )
  }
}

const MappedPlaygroundView = mapProps({
  projectId: (props) => props.viewer.project.id,
  params: (props) => props.params,
})(PlaygroundView)

export default Relay.createContainer(MappedPlaygroundView, {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        project: projectByName(projectName: $projectName) {
          id
        }
      }
    `,
  },
})
