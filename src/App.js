/** Find out how diverse a comma-separated list of names is - perhaps
 * for a mailing list, a company employee list, etc. Just for fun! 
 * Using the diversityAPI tool.
 * How many women and people of color are on your teams?
 * Author: Kristie Huang
 */

import React, { Component, useEffect } from 'react';
import './App.css';
import axios from "axios";
import { TextField, Button, Input } from "@material-ui/core";

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

    for (const name of names) {
      //calculate gender + likelihood
      axios
        .get(`https://api.diversitydata.io/?fullname=${name}`)
        .then((response) => {
          const { data } = response;

          console.log(data);
          this.setState({
            womenTotal: data["gender"] === "female" ? this.state.womenTotal + 1 : this.state.womenTotal,
            womenTotalConfidence: this.state.womenTotalConfidence + data["gender probability"],
            pocTotal: data["ethnicity"] !== "white" ? this.state.pocTotal + 1 : this.state.pocTotal,
            pocTotalConfidence: this.state.pocTotalConfidence + data["ethnicity probability"],
          });


        })
        .catch((error) => { alert("There was an error. Try again?"); });

    }



  }

  render() {

    const allNameLabels = this.state.names.map((key, num) => {
      return (
        <p>{key}</p>
      );
    });

    const womenPercent = this.state.womenTotal ?
      (this.state.womenTotal * 100 / this.state.names.length).toFixed(1) : 0;
    const womenConfPercent = this.state.womenTotalConfidence ?
      (this.state.womenTotalConfidence * 100 / this.state.names.length).toFixed(1) : 0;
    const pocPercent = this.state.pocTotal ?
      (this.state.pocTotal * 100 / this.state.names.length).toFixed(1) : 0;
    const pocConfPercent = this.state.pocTotalConfidence ?
      (this.state.pocTotalConfidence * 100 / this.state.names.length).toFixed(1) : 0;

    return (
      <div className="App">

        <h1>How many <u>women</u> and <u>people of color</u> are on your teams?</h1>
        <p class="Subtitle">Comma-separated list, please.  API by diversitydata.io.</p>

        <form onSubmit={this.handleSubmit}>
          <Input
            name="names"
            value={this.state.input}
            onChange={this.handleChange}
            label="Employees' names"
            placeholder="(E.g. Abby Alligator, Ben Bulldog)"
            multiline={true}
            rows={1}
            rowsMax={8}
            fullWidth={true}
            color='primary'
            margin='none'
          />

          <Button
            type="submit"
            size='large'
            color='primary'
          >
            Run
          </Button>
        </form>
        <h2>Your Results</h2>
        <p>Women: {womenPercent}%</p>
        <p class="Subtitle">{womenConfPercent}% sure.</p>
        <p>People of color: {pocPercent}%</p>
        <p class="Subtitle">{pocConfPercent}% sure.</p>


      </div>
    );
  }
}

export default App;

