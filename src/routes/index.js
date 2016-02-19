import React from 'react'
import { Route, IndexRedirect } from 'react-router'

// NOTE: here we're making use of the `resolve.root` configuration
// option in webpack, which allows us to specify import paths as if
// they were from the root of the ~/src directory. This makes it
// very easy to navigate to files regardless of how deeply nested
// your current file is.
import CoreLayout from 'layouts/CoreLayout/CoreLayout'
import HomeView from 'views/HomeView/HomeView'

export default (store) => (
  <Route path='/'>
    <Route path=':project' component={CoreLayout}>
      <Route path='schemas'>
        <Route path=':schema' component={HomeView}/>
        <IndexRedirect to='default' />
      </Route>
      <IndexRedirect to='schemas' />
    </Route>
    <IndexRedirect to='default' />
  </Route>
)
