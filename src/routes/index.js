import React from 'react'
import { Route, IndexRedirect } from 'react-router'

// NOTE: here we're making use of the `resolve.root` configuration
// option in webpack, which allows us to specify import paths as if
// they were from the root of the ~/src directory. This makes it
// very easy to navigate to files regardless of how deeply nested
// your current file is.
import CoreLayout from 'layouts/CoreLayout/CoreLayout'
import HomeView from 'views/HomeView/HomeView'
import SchemaView from 'views/HomeView/SchemaView'
import DataView from 'views/HomeView/DataView'

export default (store) => (
  <Route path='/'>
    <Route path=':project' component={CoreLayout}>
      <Route path='models'>
        <Route path=':model' component={HomeView}>
          <Route path='schema' component={SchemaView} />
          <Route path='data' component={DataView} />
          <IndexRedirect to='schema' />
        </Route>
        <IndexRedirect to='default' />
      </Route>
      <IndexRedirect to='models' />
    </Route>
    <IndexRedirect to='default' />
  </Route>
)
