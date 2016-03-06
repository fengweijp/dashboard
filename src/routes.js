import React from 'react'
import { Route, IndexRedirect } from 'react-router'
import CoreLayout from 'layouts/CoreLayout/CoreLayout'
import ModelView from 'views/ModelView/ModelView'
import SchemaTab from 'views/ModelView/SchemaTab'
import DataTab from 'views/ModelView/DataTab'

import UserQuery from 'queries/UserQuery'

export default (
  <Route path='/'>
    <Route path=':projectId' component={CoreLayout} queries={UserQuery}>
      <Route path='models'>
        <Route path=':modelId' component={ModelView}>
          <Route path='schema' component={SchemaTab} queries={UserQuery} />
          <Route path='data' component={DataTab} queries={UserQuery} />
          <IndexRedirect to='schema' />
        </Route>
        <IndexRedirect to='default' />
      </Route>
      <IndexRedirect to='models' />
    </Route>
    <IndexRedirect to='default' />
  </Route>
)
