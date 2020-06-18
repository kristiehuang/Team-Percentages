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
      womenTotal: 0,
      womenTotalConfidence: 0,
      pocTotal: 0,
      pocTotalConfidence: 0,
    };

  }



  handleSubmit = event => {
    event.preventDefault();

    alert('Checking this list of names: ' + this.state.input);
    const names = this.state.input.split(", ");

    this.setState({
      names: names,
      womenTotal: 0,
      womenTotalConfidence: 0,
      pocTotal: 0,
      pocTotalConfidence: 0,
    });
    this.calculatePercentage(names);


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
          console.log("before" + this.state.womenTotal);
          console.log(data["gender"] === "female");

          this.setState({
            womenTotal: data["gender"] === "female" ? this.state.womenTotal + 1 : this.state.womenTotal,
            womenTotalConfidence: this.state.womenTotalConfidence + data["gender probability"],
            pocTotal: data["ethnicity"] !== "white" ? this.state.pocTotal + 1 : this.state.pocTotal,
            pocTotalConfidence: this.state.pocTotalConfidence + data["ethnicity probability"],
          });

          console.log(this.state.womenTotal);


        })
        .catch((error) => { this.calculatePercentage(false); });
      
    }



  }

  render() {


    //i want to display - gender, ethnicities
    const allNameLabels = this.state.names.map((key, num) => {
      return (
        <p>{key}</p>
      );
    });

    const womenPercent = this.state.womenTotal ?
      this.state.womenTotal * 100 / this.state.names.length : 0;
    
    const pocPercent = this.state.pocTotal ?
      this.state.pocTotal * 100 / this.state.names.length : 0;

    return (
        <div className="App">
        <p>How many women and people of color are on your teams?</p>
        <p>Comma-separated list, please.</p>

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
        {console.log("women total!")}

        {console.log(this.state)}
        <p>Percentage women: {womenPercent}%</p>

        <p>Percentage people of color: {pocPercent}%</p>
        <h1>List of names:</h1>
        {allNameLabels}


        </div>
      );
    } 
}

export default App;

