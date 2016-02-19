import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchProjects, addProject } from 'redux/modules/projects'
import 'bulma/css/bulma.css'
import 'font-awesome/css/font-awesome.css'
import '../../styles/core.scss'

export class CoreLayout extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    fetchOnDidMount: PropTypes.func.isRequired,
    addProject: PropTypes.func.isRequired,
    projects: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props)

    this._onSelect = this._onSelect.bind(this)
    this._addProject = this._addProject.bind(this)
  }

  componentDidMount () {
    this.props.fetchOnDidMount()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.projects.length > 0 && !nextProps.projects.includes(nextProps.params.project)) {
      this.context.router.replace(`/${nextProps.projects[0]}`)
    }
  }

  _onSelect (e) {
    this.context.router.push(`/${e.target.value}`)
  }

  _addProject () {
    const schemaName = window.prompt('Project name')
    if (schemaName) {
      this.props.addProject(schemaName)
    }
  }

  render () {
    if (this.props.projects.length === 0) {
      return (
        <h2>Loading</h2>
      )
    }

    const graphQL = `http://${__SERVER_ADDR__}/graphql/${this.props.params.project}`

    return (
      <div>
        <header className='header'>
          <div className='container'>
            <div className='header-left'>
              <span className='header-item'>
                <span className='select'>
                  <select onChange={this._onSelect} value={this.props.params.project}>
                    {this.props.projects.map((project) => (
                      <option key={project} value={project}>{project}</option>
                    ))}
                  </select>
                </span>
                <span onClick={this._addProject}>
                  <i className='fa fa-plus'></i>
                </span>
              </span>
            </div>

            <div className='header-right header-menu'>
              <span className='header-item'>
                <a target='_blank' href='http://slack.graph.cool'>
                  <img src='http://slack.graph.cool/badge.svg' />
                </a>
              </span>
              <span className='header-item'>
                <a className='button' target='_blank' href={graphQL}>GraphQL</a>
              </span>
            </div>
          </div>
        </header>
        <div className='container'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  projects: state.projects.toJS()
})
const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchOnDidMount: () => {
    dispatch(fetchProjects())
  },
  addProject: (projectName) => {
    dispatch(addProject(projectName))
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(CoreLayout)
