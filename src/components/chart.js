import React, { Component } from 'react'
import Chart from "chart.js";


let myPieChart;
export default class PieChart extends Component {
  chartRef = React.createRef();
  state = {
    storeBudgetData: null
  }
  componentDidUpdate(prevProps, prevState) {
    const { budgetData, currentIndex } = this.props

    if (prevProps.currentIndex !== this.props.currentIndex) {
      this.buildChart()
    }
    this.buildChart()



  }
  componentDidMount() {

    this.buildChart()
  }

  buildChart = () => {
    const myChartRef = this.chartRef.current.getContext("2d");
    const { budgetData, currentIndex } = this.props
    let colors = []

    Object.keys(budgetData[currentIndex].expenses).map(d => colors.push(this.getRandomColor()))
    if (myPieChart) myPieChart.destroy();

    myPieChart = new Chart(myChartRef, {
      type: 'pie',
      options: {
        maintainAspectRatio: false,
        responsive: true,
      },
      data: {
        labels: Object.keys(budgetData[currentIndex].expenses),
        datasets: [{
          data: Object.values(budgetData[currentIndex].expenses),
          backgroundColor: colors,
        }]
      }
    });

  }

  getRandomColor = () => {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  render() {

    return (
      <div >
        <canvas
          className='chart-wrapper'
          id="myChart"
          ref={this.chartRef}
        />
      </div>
    )
  }
}
