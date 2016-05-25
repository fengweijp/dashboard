import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ScrollBox from 'components/ScrollBox/ScrollBox'
import Icon from 'components/Icon/Icon'
import classes from './ProjectSelection.scss'

const ProjectPropType = React.PropTypes.shape({
  webhookUrl: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
})

export default class ProjectSelection extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    add: PropTypes.func.isRequired,
    selectedProject: ProjectPropType.isRequired,
    projects: PropTypes.arrayOf(ProjectPropType).isRequired,
  };

  constructor (props) {
    super(props)

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)

    this.state = {
      expanded: false,
    }
  }

  _toggle () {
    this.setState({ expanded: !this.state.expanded })
  }

  _onAdd () {
    this.props.add()
  }

  _onSelectProject () {
    this._toggle()

    analytics.track('sidenav: selected project')
  }

  render () {
    return (
      <div className={classes.root}>
        <div className={classes.head} onClick={::this._toggle}>
          <div className={classes.logo}>
            <Icon
              width={30}
              height={35}
              src={require('assets/icons/logo.svg')}
              color='#fff'
              />
          </div>
          <span className={classes.title}>
            {this.props.selectedProject.name}
          </span>
          <div className={`${classes.arrow} ${this.state.expanded ? classes.up : ''}`}>
            <Icon
              width={11}
              height={6}
              src={require('assets/icons/arrow.svg')}
              color='#fff'
              />
          </div>
        </div>
        {this.state.expanded &&
          <div className={classes.overlay}>
            <ScrollBox>
              <div className={classes.listHead}>All Projects</div>
              {this.props.projects.map((project) => (
                <Link
                  key={project.name}
                  className={classes.listElement}
                  onClick={::this._onSelectProject}
                  to={`/${project.name}`}
                  activeClassName={classes.listElementActive}
                  >
                  {project.name}
                  <div title='Duplicate' className={classes.listElementDuplicate}>
                    <Icon
                      src={require('assets/icons/model.svg')}
                      color='#fff'
                      />
                  </div>
                </Link>
              ))}
              <div className={classes.add} onClick={::this._onAdd}>+ New Project</div>
            </ScrollBox>
          </div>
        }
      </div>
    )
  }
}
