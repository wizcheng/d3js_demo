import React, { Component } from 'react';
import * as d3 from "d3"
import {createChart, getRandomData} from "./line_chart";

export default class Chart extends Component {

    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    }


    componentWillReceiveProps(nextProps){
        this.state.chart.update(nextProps.data);
    }

    componentDidMount() {

        const svg = d3.select(this.refs.svg);

        const chart = createChart({
            svg: svg,
            data: this.props.data,
            fieldX: this.props.fieldX,
            fieldY: this.props.fieldY
        });

        this.setState({
            chart: chart
        });
        //chart.update(getRandomData(10, 3, 15));

    }

    render() {

        const style = {
            backgroundColor: "#eeeeee"
        };

        return (
            <div>
                <svg ref="svg" width="500" height="300" style={style}/>
            </div>
        );
    }
}
