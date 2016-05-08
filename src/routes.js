import React from 'react'
import Relay from 'react-relay'
import { Route, IndexRoute, IndexRedirect } from 'react-router'
import Loading from 'react-loading'
import RootView from 'views/RootView/RootView'
import RootRedirectView from 'views/RootView/RootRedirectView'
import TokenRedirectView from 'views/RootView/TokenRedirectView'
import ModelView from 'views/ModelView/ModelView'
import ModelRedirectView from 'views/ModelView/ModelRedirectView'
import FieldsTab from 'views/ModelView/FieldsTab'
import DataTab from 'views/ModelView/DataTab'
import PlaygroundView from 'views/PlaygroundView/PlaygroundView'
import GettingStartedView from 'views/GettingStartedView/GettingStartedView'

const ViewerQuery = {
  viewer: (Component, variables) => Relay.QL`
    query {
      viewer {
        ${Component.getFragment('viewer', variables)}
      }
    }
  `,
}

const toRoot = () => {
  window.location.pathname = '/'
}

/* eslint-disable react/prop-types */
const render = (onError = (() => {})) => ({ done, error, props, routerProps, element }) => {
  if (error) {
    return onError()
  }

  if (props) {
    return React.cloneElement(element, props)
  }

  return (
    <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Loading type='bubbles' delay={0} color='#8989B1' />
    </div>
  )
}
/* eslint-enable react/prop-types */

export default (
  <Route path='/'>
    <IndexRoute component={RootRedirectView} queries={ViewerQuery} />
    <Route path='token' component={TokenRedirectView} />
    <Route path=':projectName' component={RootView} queries={ViewerQuery} render={render(toRoot)}>
      <Route path='models'>
        <IndexRoute component={ModelRedirectView} queries={ViewerQuery} render={render(toRoot)} />
        <Route path=':modelName' component={ModelView} queries={ViewerQuery}
          render={render(() => <ModelRedirectView />)}>
          <Route path='fields' component={FieldsTab} queries={ViewerQuery} render={render()} />
          <Route path='data' component={DataTab} queries={ViewerQuery} render={render()} />
          <IndexRedirect to='fields' />
        </Route>
      </Route>
      <Route path='playground' component={PlaygroundView} queries={ViewerQuery} render={render(toRoot)} />
      <Route path='getting-started' component={GettingStartedView} queries={ViewerQuery} render={render(toRoot)} />
      <IndexRedirect to='getting-started' />
    </Route>
  </Route>
)
