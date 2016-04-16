import React from 'react'
import { Route, IndexRoute, IndexRedirect } from 'react-router'
import Loading from 'react-loading'
import RootView from 'views/RootView/RootView'
import RootRedirectView from 'views/RootView/RootRedirectView'
import ModelView from 'views/ModelView/ModelView'
import ModelRedirectView from 'views/ModelView/ModelRedirectView'
import FieldsTab from 'views/ModelView/FieldsTab'
import DataTab from 'views/ModelView/DataTab'
import PlaygroundView from 'views/PlaygroundView/PlaygroundView'
import GettingStartedView from 'views/GettingStartedView/GettingStartedView'

import ViewerQuery from 'queries/ViewerQuery'

const loading = () => (
  <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <Loading type='bubbles' delay={0} color='#8989B1' />
  </div>
)

const redirectToRoot = () => {
  window.location.pathname = '/'
}

export default (
  <Route path='/'>
    <IndexRoute component={RootRedirectView} queries={ViewerQuery} renderLoading={loading} />
    <Route path=':projectId' component={RootView} queries={ViewerQuery}
      renderFailure={redirectToRoot} renderLoading={loading} >
      <Route path='models'>
        <IndexRoute component={ModelRedirectView} queries={ViewerQuery} renderLoading={loading} />
        <Route path=':modelId' component={ModelView}>
          <Route path='fields' component={FieldsTab} renderFailure={() => <ModelRedirectView />}
            queries={ViewerQuery} renderLoading={loading} />
          <Route path='data' component={DataTab} renderFailure={() => <ModelRedirectView />}
            queries={ViewerQuery} renderLoading={loading} />
          <IndexRedirect to='fields' />
        </Route>
      </Route>
      <Route path='playground' component={PlaygroundView} />
      <Route path='getting-started' component={GettingStartedView}
        queries={ViewerQuery} renderLoading={loading} />
      <IndexRedirect to='models' />
    </Route>
  </Route>
)
