import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import { Route, IndexRoute, Redirect, IndexRedirect } from 'react-router'
import Loading from 'components/Loading/Loading'
import RootView from 'views/RootView/RootView'
import RootRedirectView from 'views/RootView/RootRedirectView'
import TokenRedirectView from 'views/RootView/TokenRedirectView'
import FieldsView from 'views/models/FieldsView/FieldsView'
import DataView from 'views/models/DataView/DataView'
// import ModelView from 'views/ModelView/ModelView'
import ModelRedirectView from 'views/models/ModelRedirectView'
// import FieldsTab from 'views/ModelView/FieldsTab'
// import DataTab from 'views/ModelView/DataTab'
import PlaygroundView from 'views/playground/PlaygroundView/PlaygroundView'
import GettingStartedView from 'views/GettingStartedView/GettingStartedView'
import AccountView from 'views/account/AccountView/AccountView'
import SettingsTab from 'views/account/AccountView/SettingsTab'

// TODO https://github.com/relay-tools/react-router-relay/issues/156
class RedirectOnMount extends React.Component {
  static propTypes = {
    to: PropTypes.string.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  componentWillMount () {
    this.context.router.replace(this.props.to)
  }

  render () {
    return false
  }
}

const ViewerQuery = {
  viewer: (Component, variables) => Relay.QL`
    query {
      viewer {
        ${Component.getFragment('viewer', variables)}
      }
    }
  `,
}

/* eslint-disable react/prop-types */
const render = ({ error, props, routerProps, element }) => {
  if (error) {
    analytics.track('error', {
      error: JSON.stringify(error),
    })
    return (
      <RedirectOnMount to='/' />
    )
  }

  if (props) {
    return React.cloneElement(element, props)
  }

  return (
    <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Loading color='#8989B1' />
    </div>
  )
}
/* eslint-enable react/prop-types */

export default (
  <Route path='/'>
    <IndexRoute component={RootRedirectView} queries={ViewerQuery} render={render} />
    <Route path='token' component={TokenRedirectView} />
    <Route path=':projectName' component={RootView} queries={ViewerQuery} render={render}>
      <Route path='account' component={AccountView}>
        <Route path='settings' component={SettingsTab} queries={ViewerQuery} render={render} />
        {/* <Route path='usage' component={SettingsTab} queries={ViewerQuery} render={render} /> */}
        <IndexRedirect to='settings' />
      </Route>
      <Route path='models'>
        <IndexRoute component={ModelRedirectView} queries={ViewerQuery} render={render} />
        <Route path=':modelName/fields' component={FieldsView} queries={ViewerQuery} render={render} />
        <Route path=':modelName/data' component={DataView} queries={ViewerQuery} render={render} />
        <Redirect path=':modelName' to=':modelName/fields' />
      </Route>
      <Route path='playground' component={PlaygroundView} queries={ViewerQuery} render={render} />
      <Route path='getting-started' component={GettingStartedView} queries={ViewerQuery} render={render} />
      <IndexRedirect to='getting-started' />
    </Route>
  </Route>
)
