import React, { PropTypes } from 'react'
import 'bulma/css/bulma.css'
import 'font-awesome/css/font-awesome.css'
import '../../styles/core.scss'

// Note: Stateless/function components *will not* hot reload!
// react-transform *only* works on component classes.
//
// Since layouts rarely change, they are a good place to
// leverage React's new Stateless Functions:
// https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
//
// CoreLayout is a pure function of its props, so we can
// define it with a plain javascript function...
function CoreLayout ({ children }) {
  return (
    <div>
      <header className='header'>
        <div className='container'>
          <div className='header-left'>
            <span className='header-item'>
              <span className='select'>
                <select>
                  <option value='Production'>Production</option>
                </select>
              </span>
            </span>
          </div>

          <div className='header-right header-menu'>
            <span className='header-item'>
              <a className='button' href='#'>Account</a>
            </span>
          </div>
        </div>
      </header>
      <div className='container'>
        {children}
      </div>
    </div>
  )
}

CoreLayout.propTypes = {
  children: PropTypes.element
}

export default CoreLayout
