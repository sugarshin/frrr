import React, { Component } from 'react';
import { render } from 'react-dom';

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="app">
        <span>{this.props.name}</span>
        <button>button</button>
      </div>
    );
  }
}

const div = document.createElement('div');
div.className = 'root';
document.body.appendChild(div);

render(<App name="ボタン" />, div);
