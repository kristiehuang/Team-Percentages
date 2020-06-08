import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios";
import { TextField, Button, Input } from "@material-ui/core";
import { render } from '@testing-library/react';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      names: []
    };

  }

  handleSubmit = event => {
    event.preventDefault();
    alert('An essay was submitted: ' + this.state.names);

  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
    console.log(event.target.value);
    console.log(this.state);

  }

  render() {
    return (
        <div className="App">
          <p>How white is your team?</p>

          <form onSubmit={this.handleSubmit}>
            <Input
              name="names"
              value={this.state.names}
              onChange={this.handleChange}
              label="Employees' names"
              helperText="(E.g. Abby Alligator, Ben Bulldog)"
              multiline={true}
              rows={2}
              rowsMax={8}
            />
            <Button type="submit">Add</Button>
          </form>

        </div>
      );
    } 
}

export default App;

