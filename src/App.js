/** Find out how diverse a comma-separated list of names is - perhaps
 * for a mailing list, a company employee list, etc. Just for fun! 
 * Using the diversityAPI tool.
 * How many women and people of color are on your teams?
 * Author: Kristie Huang
 */

import React, { Component, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios";
import { TextField, Button, Input } from "@material-ui/core";
import { render } from '@testing-library/react';

class App extends Component {

  constructor(props) {
    super(props);
    //STATE VS CLASS VAR = SETSTATE AUTO CALLS RENDER
    this.state = {
      input: "",
      names: [],
    };

  }
  womenTotal = 0;
  womenTotalConfidence = 0;
  pocTotal = 0;
  pocTotalConfidence = 0;


  handleSubmit = event => {
    event.preventDefault();
    alert('Checking this list of names: ' + this.state.input);
    const names = this.state.input.split(", ");
    console.log(names);

    this.calculatePercentage(names);

    this.setState({
      input: this.state.input,
      names: names
    });

  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      input: value,
      names: this.state.names,
    });


  }

  /** The logic. */
  calculatePercentage(names) {
    if (!names) {
      //error handling
    }

    for (const name of names) {
      //calculate gender + likelihood
      axios
        .get(`https://api.diversitydata.io/?fullname=${name}`)
        .then((response) => {
          const { data } = response;
          console.log("before" + this.womenTotal);
          console.log(data["gender"] === "female");

          this.womenTotal = data["gender"] === "female" ? this.womenTotal + 1 : this.womenTotal;
          this.womenTotalConfidence += data["gender probability"];
          this.pocTotal = data["ethnicity"] !== "white" ? this.pocTotal + 1 : this.pocTotal;
          this.pocTotalConfidence += data["ethnicity probability"];
          console.log(this.womenTotal);


        })
        .catch((error) => { this.calculatePercentage(false); });
      
    }



  }

  render() {


    //i want to display - gender, ethnicities
    const res = this.state.names.map((key, num) => {
      return (
        <p>{key}</p>
      );
    });

    return (
        <div className="App">
          <p>How white is your team?</p>

          <form onSubmit={this.handleSubmit}>
            <Input
              name="names"
              value={this.state.input}
              onChange={this.handleChange}
              label="Employees' names"
              helperText="(E.g. Abby Alligator, Ben Bulldog)"
              multiline={true}
              rows={2}
              rowsMax={8}
            />
            <Button type="submit">Add</Button>
        </form>
        {console.log("women total!" + this.womenTotal)}
        <p>Percentage women: {this.womenTotal / this.state.names.length}%</p>

        <p>Percentage people of color: {this.pocTotal / this.state.names.length}%</p>
        <h1>List of names:</h1>
        {res}


        </div>
      );
    } 
}

export default App;

