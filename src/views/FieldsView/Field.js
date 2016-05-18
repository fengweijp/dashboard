import React, { PropTypes } from 'react'
import Relay from 'react-relay'
// import FieldDetails from './FieldDetails'
import UpdateFieldDescriptionMutation from 'mutations/UpdateFieldDescriptionMutation'
import DeleteFieldMutation from 'mutations/DeleteFieldMutation'
import classes from './Field.scss'

class Field extends React.Component {

  static propTypes = {
    showDetails: PropTypes.bool.isRequired,
    toggleShowDetails: PropTypes.func.isRequired,
    field: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    modelId: PropTypes.string.isRequired,
  };

  state = {
    editDescription: false,
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
        modelId: this.props.modelId,
      }), {
        onSuccess: () => {
          analytics.track('models/fields: deleted field', {
            project: this.props.params.projectName,
            model: this.props.params.modelName,
            field: this.props.field.fieldName,
          })
        },
      })
    }
  }

  _saveDescription (e) {
    const description = e.target.value
    if (this.props.field.description === description) {
      this.setState({ editDescription: false })
      return
    }

    Relay.Store.commitUpdate(new UpdateFieldDescriptionMutation({
      fieldId: this.props.field.id,
      description,
    }), {
      onFailure: () => {
        this.setState({ editDescription: false })
      },
      onSuccess: () => {
        analytics.track('models/fields: edited description')

        this.setState({ editDescription: false })
      },
    })
  }

  render () {
    const { field } = this.props

    return (
      <div className={classes.row}>
        <div className={classes.fieldName}>{field.fieldName}</div>
        <div className={classes.type}><span>{field.typeIdentifier}{field.isRequired ? '!' : ''}</span></div>
        <div className={classes.description}>
          {this.state.editDescription &&
            <input
              autoFocus
              type='text'
              placeholder='Description'
              defaultValue={field.description}
              onBlur={::this._saveDescription}
              onKeyDown={(e) => e.keyCode === 13 ? e.target.blur() : null}
            />
          }
          {!this.state.editDescription && field.description &&
            <span
              className={classes.descriptionText}
              onClick={() => this.setState({ editDescription: true })}
            >
              {field.description}
            </span>
          }
          {!this.state.editDescription && !field.description &&
            <span
              className={classes.addDescription}
              onClick={() => this.setState({ editDescription: true })}
            >
              Add description
            </span>
          }
        </div>
        <div className={classes.constraints}></div>
        <div className={classes.permissions}>
          {field.permissions.edges.map(({ node }) => (
            <span key={node.id}>{node.userType}</span>
          ))}
        </div>
      </div>
    )

    //    return (
    //      <tbody
    //        className={`${this.props.showDetails ? classes.detailsVisible : ''} ${classes.root}`}
    //      >
    //        <tr
    //          key={field.fieldName}
    //          className={classes.field}
    //        >
    //          <td>{field.fieldName}</td>
    //          <td>
    //            <span className={classes.type}>
    //              {field.typeIdentifier}<span className={classes.cardinality}>{field.isList ? 'many' : 'one'}</span>
    //            </span>
    //          </td>
    //          <td className={classes.constraints}>
    //            {field.isRequired
    //              ? <span className={classes.constraint}>required</span>
    //              : ''}
    //            <div className={classes.permissions}>
    //              {field.permissions.edges.map(({ node }) => (
    //                <span
    //                  key={node.id}
    //                  data-tip={`${node.userType} ${node.comment ? `(${node.comment})` : ''}`}
    //                >
    //                  {node.userType.substr(0, 1)}
    //                </span>
    //              ))}
    //            </div>
    //          </td>
    //          <td className={classes.toggle}>
    //            {this.props.showDetails &&
    //              <div className={classes.toggleContainer}>
    //                <div className={classes.grey} onClick={::this._toggleDetails}>
    //                  <Icon
    //                    width={24}
    //                    height={24}
    //                    src={require('assets/icons/close.svg')}
    //                  />
    //                </div>
    //                <div className={classes.green} onClick={::this._save}>
    //                  <Icon
    //                    width={24}
    //                    height={24}
    //                    src={require('assets/icons/check.svg')}
    //                  />
    //                </div>
    //              </div>
    //            }
    //            {!this.props.showDetails &&
    //              <div className={classes.toggleContainer}>
    //                <div className={classes.green} onClick={::this._toggleDetails}>
    //                  <Icon src={require('assets/icons/edit.svg')} />
    //                </div>
    //                <div className={classes.grey} onClick={::this._delete}>
    //                  <Icon src={require('assets/icons/delete.svg')} />
    //                </div>
    //              </div>
    //            }
    //          </td>
    //        </tr>
    //        {this.props.showDetails &&
    //          <tr className={classes.details}>
    //            <td colSpan={4}>
    //              <FieldDetails
    //                ref='details'
    //                field={field}
    //                close={this.props.toggleShowDetails}
    //              />
    //            </td>
    //          </tr>
    //        }
    //      </tbody>
    //    )
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
        description
        permissions(first: 100) {
          edges {
            node {
              id
              userType
              comment
            }
          }
        }
      }
    `,
  },
})
