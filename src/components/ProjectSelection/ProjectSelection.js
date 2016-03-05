import React, { PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import classes from './ProjectSelection.scss'

export default class ProjectSelection extends React.Component {
  static propTypes = {
    select: PropTypes.func.isRequired,
    selectedProject: PropTypes.string.isRequired,
    projects: PropTypes.arrayOf(React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
    })),
  };

  constructor (props) {
    super(props)

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
    this._onSelect = ::this._onSelect

    this.state = {
      expanded: false,
    }
  }

  _onSelect (e) {
    const projectName = e.target.value
    this.props.select(projectName)
  }

  render () {
    return (
      <div className={classes.root}>
        {!this.state.expanded &&
          <div className={classes.dropdown} />
        }
        {this.state.expanded &&
          <select onChange={this._onSelect} value={this.props.selectedProject}>
            {this.props.projects.map((project) => (
              <option key={project.name} value={project.name}>{project.name}</option>
            ))}
          </select>
        }
      </div>
    )
  }
}
