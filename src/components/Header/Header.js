import React from 'react'
import Icon from 'components/Icon/Icon'
import classes from './Header.scss'

export default class Header extends React.Component {

  render () {
    return (
      <div className={classes.root}>
        <a className={classes.playground} href='#'>
          <Icon width={8} height={10} glyph={require('assets/icons/play.svg')} />
          Playground
        </a>
      </div>
    )
  }
}
