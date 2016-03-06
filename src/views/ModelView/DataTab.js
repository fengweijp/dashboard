import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import PureRenderMixin from 'react-addons-pure-render-mixin'
// import classes from './DataTab.scss'

export class DataTab extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props)

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }

  render () {
    return (
      <div>
        <div>
        data
        </div>
      </div>
    )
  }
}

export default Relay.createContainer(DataTab, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          name
          projects {
            models {
              data
            }
          }
        }
      }
    `,
  },
})
