import React from 'react'
import { Route, IndexRedirect } from 'react-router'
import Loading from 'react-loading'
import CoreLayout from 'layouts/CoreLayout/CoreLayout'
import ModelView from 'views/ModelView/ModelView'
import SchemaTab from 'views/ModelView/SchemaTab'
import DataTab from 'views/ModelView/DataTab'

import UserQuery from 'queries/UserQuery'

const loading = () => (
  <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <Loading type='bubbles' delay={0} color='#8989B1' />
  </div>
)

export default (
  <Route path='/'>
    <Route path=':projectId' component={CoreLayout} queries={UserQuery} renderLoading={loading} >
      <Route path='models'>
        <Route path=':modelId' component={ModelView}>
          <Route path='schema' component={SchemaTab} queries={UserQuery} renderLoading={loading} />
          <Route path='data' component={DataTab} queries={UserQuery} renderLoading={loading} />
          <IndexRedirect to='schema' />
        </Route>
        <IndexRedirect to='default' />
      </Route>
      <IndexRedirect to='models' />
    </Route>
    <IndexRedirect to='default' />
  </Route>
)
