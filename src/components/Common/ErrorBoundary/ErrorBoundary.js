import React, {Component} from 'react';
import './errorBoundary.scss'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  componentDidCatch(error, info) {
    this.setState({hasError: true});
  }

  render() {
    if (this.state.hasError) {
      return <div className={'error-boundary-wrapper'}>
        <div className={'error-boundary-container'}>
          <div>
            <i className={'uil-annoyed'} style={{fontSize: 80}}/>
          </div>
          <h1 className={'error-boundary-heading'}>
            Ooops! Something went wrong.
          </h1>
          <h5 className={'error-boundary-heading'}>
            This page didn't load the content correctly. See the JavaScript console for technical details.
          </h5>
        </div>
      </div>
    }
    return this.props.children;
  }
}

export default ErrorBoundary;