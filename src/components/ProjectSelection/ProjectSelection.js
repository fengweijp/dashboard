import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Icon from 'components/Icon/Icon'
import classes from './ProjectSelection.scss'
import ProjectSettingsOverlay from 'components/ProjectSettingsOverlay/ProjectSettingsOverlay'

const ProjectPropType = React.PropTypes.shape({
  webhookUrl: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  id: React.PropTypes.string.isRequired,
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
    this._toggle = ::this._toggle
    this._toggleProjectSettings = ::this._toggleProjectSettings
    this._onAdd = ::this._onAdd

    this.state = {
      expanded: false,
      projectSettingsVisible: false,
    }
  }

  _toggle () {
    this.setState({ expanded: !this.state.expanded })
  }

  _onAdd () {
    this.props.add()
  }

  _toggleProjectSettings () {
    this.setState({ projectSettingsVisible: !this.state.projectSettingsVisible })
  }

  render () {
    return (
      <div className={classes.root}>
        {this.state.projectSettingsVisible &&
          <ProjectSettingsOverlay
            project={this.props.selectedProject}
            hide={this._toggleProjectSettings}
            params={this.props.params}
          />
        }
        <div className={classes.head} onClick={this._toggle}>
          <div onClick={(e) => { e.stopPropagation(); this._toggleProjectSettings() }} className={classes.gear}>
            <Icon
              width={20} height={20}
              src={require('assets/icons/gear.svg')}
              color='#fff'
              />
          </div>
          <span className={classes.title}>
            {this.props.selectedProject.name}
          </span>
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
