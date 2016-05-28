import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import { Link } from 'react-router'
import Loading from '../../../components/Loading/Loading'
import UpdateFieldDescriptionMutation from 'mutations/UpdateFieldDescriptionMutation'
import DeleteFieldMutation from 'mutations/DeleteFieldMutation'
import PermissionsLayover from './PermissionsLayover'
import Icon from 'components/Icon/Icon'
import classes from './Field.scss'

class Field extends React.Component {

  static propTypes = {
    field: PropTypes.object.isRequired,
    allModels: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
  }

  state = {
    editDescription: false,
    editDescriptionPending: false,
    showermissionsLayover: false,
  }

  _save () {
    this.refs.details.refs.component.save()
  }

  _delete () {
    if (window.confirm(`Do you really want to delete "${this.props.field.fieldName}"?`)) {
      Relay.Store.commitUpdate(new DeleteFieldMutation({
        fieldId: this.props.field.id,
        modelId: this.props.model.id,
      }), {
        onSuccess: () => {
          analytics.track('models/structure: deleted field', {
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

    this.setState({ editDescriptionPending: true })

    Relay.Store.commitUpdate(new UpdateFieldDescriptionMutation({
      fieldId: this.props.field.id,
      description,
    }), {
      onFailure: () => {
        this.setState({
          editDescription: false,
          editDescriptionPending: false,
        })
      },
      onSuccess: () => {
        analytics.track('models/structure: edited description')

        this.setState({
          editDescription: false,
          editDescriptionPending: false,
        })
      },
    })
  }

  _renderDescription () {
    if (this.state.editDescriptionPending) {
      return (
        <Loading color='#B9B9C8' />
      )
    }

    if (this.state.editDescription) {
      return (
        <input
          autoFocus
          type='text'
          placeholder='Description'
          defaultValue={this.props.field.description}
          onBlur={::this._saveDescription}
          onKeyDown={(e) => e.keyCode === 13 ? e.target.blur() : null}
        />
      )
    }

    if (!this.props.field.description) {
      return (
        <span
          className={classes.addDescription}
          onClick={() => this.setState({ editDescription: true })}
        >
          Add description
        </span>
      )
    }

    return (
      <span
        className={classes.descriptionText}
        onClick={() => this.setState({ editDescription: true })}
      >
        {this.props.field.description}
      </span>
    )
  }

  render () {
    const { field } = this.props

    let type = field.typeIdentifier
    if (field.isList) {
      type = `[${type}]`
    }
    if (field.isRequired) {
      type = `${type}!`
    }

    const editLink = `/${this.props.params.projectName}/models/${this.props.params.modelName}/structure/edit/${this.props.field.fieldName}` // eslint-disable-line

    const permissions = field.permissions.edges.map(({ node }) => node)

    return (
      <div className={classes.row}>
        <Link className={classes.fieldName} to={editLink}>{field.fieldName}</Link>
        <Link className={classes.type} to={editLink}>
          <span>{type}</span>
        </Link>
        <div className={classes.description}>
          {this._renderDescription()}
        </div>
        <div className={classes.constraints}></div>
        <div className={classes.permissions}>
          {this.state.showermissionsLayover &&
            <PermissionsLayover
              permissions={permissions}
              field={field}
              close={() => this.setState({ showermissionsLayover: false })}
            />
          }
          {permissions.length === 0 &&
            <span
              className={`${classes.permission} ${classes.add}`}
              onClick={() => this.setState({ showermissionsLayover: true })}
            >
              Add Permission
            </span>
          }
          {permissions.map((permission) => (
            <span
              key={permission.id}
              className={classes.permission}
              onClick={() => this.setState({ showermissionsLayover: true })}
            >
              {permission.userType}
            </span>
          ))}
        </div>
        <div className={classes.controls}>
          <Link to={editLink}>
            <Icon
              width={20}
              height={20}
              src={require('assets/icons/edit.svg')}
            />
          </Link>
          <span onClick={::this._delete}>
            <Icon
              width={20}
              height={20}
              src={require('assets/icons/delete.svg')}
            />
          </span>
        </div>
      </div>
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
        description
        permissions(first: 100) {
          edges {
            node {
              id
              userType
              comment
              allowRead
              allowCreate
              allowUpdate
              allowDelete
            }
          }
        }
      }
    `,
  },
})
