import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import mapProps from 'map-props'
import PureRenderMixin from 'react-addons-pure-render-mixin'
// import { findDOMNode } from 'react-dom'
import Icon from 'components/Icon/Icon'
import classes from './SchemaTab.scss'

// const types = {
//   'Int': 'Integer',
//   'Float': 'Float',
//   'String': 'Text',
//   'Boolean': 'Boolean',
//   'GraphQLID': 'ID',
// }

export default class SchemaTab extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    fields: PropTypes.array.isRequired,
    models: PropTypes.array.isRequired,
  };

  constructor (props) {
    super(props)

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)

    this._addField = ::this._addField
  }

  _addField () {
    // const name = findDOMNode(this.refs.name).value
    // const type = JSON.parse(findDOMNode(this.refs.type).value)
    // const list = findDOMNode(this.refs.list).checked
    // const nullable = findDOMNode(this.refs.nullable).checked
    // const unique = findDOMNode(this.refs.unique).checked
    // this.props.addField(serializeField({
    //   type: type.name,
    //   relation: type.relation,
    //   name,
    //   nullable,
    //   list,
    //   unique,
    // }))
    // findDOMNode(this.refs.name).value = ''
    // findDOMNode(this.refs.list).checked = false
    // findDOMNode(this.refs.nullable).checked = false
    // findDOMNode(this.refs.unique).checked = false
  }

  _removeField (fieldName) {

  }

  render () {
    return (
      <div className={classes.root}>
        <div className={classes.add}>+ Add field</div>
        <table className={classes.table}>
          <thead>
            <tr>
              <th>Fieldname</th>
              <th>Type</th>
              <th>Required</th>
              <th>Unique</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.props.fields
              .map((field) => (
                <tr key={field.fieldName} className={field.isSystem ? classes.disabled : ''}>
                  <td>{field.fieldName}</td>
                  <td>
                    <span className={classes.type}>
                      {field.typeIdentifier}<span className={classes.cardinality}>{field.isList ? 'many' : 'one'}</span>
                    </span>
                  </td>
                  <td>{field.isRequired ? 'required' : ''}</td>
                  <td>{field.isUnique ? 'unique' : ''}</td>
                  <td>
                    {!field.isSystem &&
                      <span onClick={() => this._removeField(field.name)}>
                        <Icon
                          glyph={require('assets/icons/delete.svg')}
                          color='#000'
                          />
                      </span>
                    }
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    )
  }
}

const MappedSchemaTab = mapProps({
  params: (props) => props.params,
  models: (props) => (
    props.viewer.user.projects
      .find((project) => project.id === props.params.projectId)
      .models
  ),
  fields: (props) => (
    props.viewer.user.projects
      .find((project) => project.id === props.params.projectId)
      .models
      .find((model) => model.name === props.params.modelId)
      .schema
  ),
})(SchemaTab)

export default Relay.createContainer(MappedSchemaTab, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          name
          projects {
            id
            models {
              name
              schema {
                fieldName
                typeIdentifier
                typeData
                isRequired
                isList
                isUnique
                isSystem
              }
            }
          }
        }
      }
    `,
  },
})
