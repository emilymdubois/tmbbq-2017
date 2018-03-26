import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store'
import { Sidebar } from './components/sidebar';
import { Map } from './components/map';
import './site.css';

class Application extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { width: 0, height: 0 };
  }

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  renderVisualComponents = () => {
    const { width } = this.state;
    const largeFormat = width > 500;
    const sharedSidebarClasses = 'flex-child flex-parent flex-parent--column bg-white';
    if (largeFormat) {
      return (
        <div className="flex-parent viewport-full relative clip">
          <Sidebar classes={`${sharedSidebarClasses} h-full w360`} />
          <Map classes='flex-child flex-child--grow relative' zoom={5.5} />
        </div>
      )
    } else {
      return (
        <div className="flex-parent viewport-full relative clip">
          <Map classes='absolute top left bottom right h300' zoom={4} />
          <Sidebar classes={`${sharedSidebarClasses} mt300`} />
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        <Provider store={store}>
          {this.renderVisualComponents()}
        </Provider>
      </div>
    );
  }
}

ReactDOM.render(<Application />, document.getElementById('app'));
