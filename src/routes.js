import React from 'react'
import { Route, IndexRedirect } from 'react-router'
import CoreLayout from 'layouts/CoreLayout/CoreLayout'
import HomeView from 'views/HomeView/HomeView'
import SchemaView from 'views/HomeView/SchemaView'
// import DataView from 'views/HomeView/DataView'
// import LoginView from 'views/LoginView/LoginView'

import UserQuery from 'queries/UserQuery'

export default (
  <Route path='/'>
    <Route path=':projectId' component={CoreLayout} queries={UserQuery}>
      <Route path='models'>
        <Route path=':model' component={HomeView}>
          <Route path='schema' component={SchemaView} />
      {
           // <Route path='data' component={DataView} />
      }
          <IndexRedirect to='schema' />
        </Route>
        <IndexRedirect to='default' />
      </Route>
      <IndexRedirect to='models' />
    </Route>
    <IndexRedirect to='default' />
  </Route>
)
