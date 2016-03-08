import React from 'react'
import { Route, IndexRoute, IndexRedirect } from 'react-router'
import Loading from 'react-loading'
import CoreLayout from 'layouts/CoreLayout/CoreLayout'
import ModelView from 'views/ModelView/ModelView'
import ModelRedirectView from 'views/ModelView/ModelRedirectView'
import SchemaTab from 'views/ModelView/SchemaTab'
import DataTab from 'views/ModelView/DataTab'
import PlaygroundView from 'views/PlaygroundView/PlaygroundView'

import UserQuery from 'queries/UserQuery'
import SchemaQuery from 'queries/SchemaQuery'

const loading = () => (
  <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <Loading type='bubbles' delay={0} color='#8989B1' />
  </div>
)

export default (
  <Route path='/'>
    <Route path=':projectId' component={CoreLayout} queries={UserQuery} renderLoading={loading} >
      <Route path='models'>
        <IndexRoute component={ModelRedirectView} queries={SchemaQuery} renderLoading={loading} />
        <Route path=':modelId' component={ModelView}>
          <Route path='schema' component={SchemaTab} renderFailure={() => <ModelRedirectView />}
            queries={SchemaQuery} renderLoading={loading} />
          <Route path='data' component={DataTab} queries={UserQuery} renderLoading={loading} />
          <IndexRedirect to='schema' />
        </Route>
      </Route>
      <Route path='playground' component={PlaygroundView} />
      <IndexRedirect to='models' />
    </Route>
    <IndexRedirect to='default' />
  </Route>
)
