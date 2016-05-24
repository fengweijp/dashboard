import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import Loading from '../../components/Loading/Loading'
import UpdateModelDescriptionMutation from 'mutations/UpdateModelDescriptionMutation'
import classes from './ModelDescription.scss'

class ModelDescription extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
  }

  state = {
    showPopup: false,
    menuDropdownVisible: false,
    editDescription: false,
    editDescriptionPending: false,
  }

  _saveDescription (e) {
    const description = e.target.value
    if (this.props.model.description === description) {
      this.setState({ editDescription: false })
      return
    }

    this.setState({ editDescriptionPending: true })

    Relay.Store.commitUpdate(new UpdateModelDescriptionMutation({
      modelId: this.props.model.id,
      description,
    }), {
      onFailure: () => {
        this.setState({
          editDescription: false,
          editDescriptionPending: false,
        })
      },
      onSuccess: () => {
        analytics.track('models: edited description')

        this.setState({
          editDescription: false,
          editDescriptionPending: false,
        })
      },
    })
  }

  render () {
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
          defaultValue={this.props.model.description}
          onBlur={::this._saveDescription}
          onKeyDown={(e) => e.keyCode === 13 ? e.target.blur() : null}
        />
      )
    }

    return (
      <span
        className={classes.descriptionText}
        onClick={() => this.setState({ editDescription: true })}
      >
        {this.props.model.description || 'Add description'}
      </span>
    )
  }
}

export default Relay.createContainer(ModelDescription, {
  fragments: {
    model: () => Relay.QL`
      fragment on Model {
        id
        description
      }
    `,
  },
})
