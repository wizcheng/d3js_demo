import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Line from "./components/charts/Line";
import {getRandomData} from "./components/charts/line_chart";
import * as d3 from "d3";

class App extends Component {

    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this._handleChange = this._handleChange.bind(this);
        this._load = this._load.bind(this);

        this.state = {
            data: [],
            symbol: "AAPL"
        }
    }

    componentDidMount() {
        this._load(this.state.symbol);
    }

    _load(symbol) {
        d3.csv("/sample_data/"+symbol+".csv", (err, data) => {
            data.forEach((d) => { d.DateParsed = new Date(d.Date) });
            this.setState({data: data})
        });
    }

    _handleChange(event) {
        var newSymbol = event.target.value;
        this.setState({
            symbol: newSymbol
        });
        this._load(newSymbol)
    }

    render() {

        return (
            <div className="App">
                <h3>Integrate with React</h3>

                <select onChange={this._handleChange} value={this.state.symbol}>
                    <option value="GOOG">GOOG</option>
                    <option value="AAPL">AAPL</option>
                    <option value="MSFT">MSFT</option>
                    <option value="IBM">IBM</option>
                </select>

                <br/>
                <br/>

                <Line data={this.state.data} fieldX="DateParsed" fieldY="Adj Close"/>
            </div>
        );
    }
}

export default App;
