import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Icon from 'components/Icon/Icon'
import classes from './ProjectSelection.scss'

const ProjectPropType = React.PropTypes.shape({
  name: React.PropTypes.string.isRequired,
  id: React.PropTypes.string.isRequired,
})

export default class ProjectSelection extends React.Component {
  static propTypes = {
    add: PropTypes.func.isRequired,
    selectedProject: ProjectPropType.isRequired,
    projects: PropTypes.arrayOf(ProjectPropType).isRequired,
  };

  constructor (props) {
    super(props)

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
    this._toggle = ::this._toggle
    this._onAdd = ::this._onAdd

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

  render () {
    return (
      <div className={classes.root}>
        <div className={classes.head} onClick={this._toggle}>
          {this.props.selectedProject.name}
          <div className={`${classes.arrow} ${this.state.expanded ? classes.up : ''}`}>
            <Icon
              src={require('assets/icons/arrow.svg')}
              color='#fff'
              />
          </div>
        </div>
        {this.state.expanded &&
          <div className={classes.overlay}>
            {this.props.projects.map((project) => (
              <Link
                key={project.name}
                className={classes.listElement}
                onClick={this._toggle}
                to={`/${project.id}`}
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
            <div className={classes.add} onClick={this._onAdd}>+ New Project</div>
          </div>
        }
      </div>
    )
  }
}
