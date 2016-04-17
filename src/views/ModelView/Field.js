import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import Icon from 'components/Icon/Icon'
import FieldDetails from './FieldDetails'
import DeleteFieldMutation from 'mutations/DeleteFieldMutation'
import classes from './Field.scss'

class Field extends React.Component {

  static propTypes = {
    showDetails: PropTypes.bool.isRequired,
    toggleShowDetails: PropTypes.func.isRequired,
    field: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props)
  }

  _toggleDetails () {
    this.props.toggleShowDetails()
  }

  _save () {
    this.refs.details.refs.component.save()
  }

  _delete () {
    if (window.confirm(`Do you really want to delete "${this.props.field.fieldName}"?`)) {
      Relay.Store.commitUpdate(new DeleteFieldMutation({
        fieldId: this.props.field.id,
        projectId: this.props.params.projectId,
        modelId: this.props.params.modelId,
      }))
    }
  }

  render () {
    const { field } = this.props

    return (
      <tbody
        className={`${this.props.showDetails ? classes.detailsVisible : ''} ${classes.root}`}
      >
        <tr
          key={field.fieldName}
          className={classes.field}
        >
          <td>{field.fieldName}</td>
          <td>
            <span className={classes.type}>
              {field.typeIdentifier}<span className={classes.cardinality}>{field.isList ? 'many' : 'one'}</span>
            </span>
          </td>
          <td className={classes.constraints}>
            {field.isRequired
              ? <span className={classes.constraint}>required</span>
              : ''}
            <div className={classes.permissions}>
              {field.permissions.edges.map(({ node }) => (
                <span
                  key={node.id}
                  data-tip={`${node.userType} ${node.comment ? `(${node.comment})` : ''}`}
                >
                  {node.userType.substr(0, 1)}
                </span>
              ))}
            </div>
          </td>
          <td className={classes.toggle}>
            {this.props.showDetails &&
              <div className={classes.toggleContainer}>
                <div className={classes.grey} onClick={::this._toggleDetails}>
                  <Icon
                    width={24}
                    height={24}
                    src={require('assets/icons/close.svg')}
                  />
                </div>
                <div className={classes.green} onClick={::this._save}>
                  <Icon
                    width={24}
                    height={24}
                    src={require('assets/icons/check.svg')}
                  />
                </div>
              </div>
            }
            {!this.props.showDetails &&
              <div className={classes.toggleContainer}>
                <div className={classes.green} onClick={::this._toggleDetails}>
                  <Icon src={require('assets/icons/edit.svg')} />
                </div>
                <div className={classes.grey} onClick={::this._delete}>
                  <Icon src={require('assets/icons/delete.svg')} />
                </div>
              </div>
            }
          </td>
        </tr>
        {this.props.showDetails &&
          <tr className={classes.details}>
            <td colSpan={4}>
              <FieldDetails
                ref='details'
                field={field}
                close={this.props.toggleShowDetails}
              />
            </td>
          </tr>
        }
      </tbody>
    )
  }
}

export default Relay.createContainer(Field, {
  fragments: {
    field: () => Relay.QL`
      fragment on Field {
        id
        fieldName
        typeIdentifier
        isRequired
        isList
        permissions(first: 100) {
          edges {
            node {
              id
              userType
              comment
            }
          }
        }
        ${FieldDetails.getFragment('field')}
      }
    `,
  },
})
