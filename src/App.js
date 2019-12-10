import React, { Component } from 'react';
import axios from 'axios'
import './App.css';
import { Tab, Statistic, Button, Input } from "semantic-ui-react"
import Chart from "chart.js";

let doughnutChart;
class Budget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      budgetData: [],
      currentIndex: '1',
      expenses: '',
      amount: '',
    }
  }
  chartRef = React.createRef();

  componentDidUpdate(prevProps, prevState) {

    if (prevState.currentIndex !== this.state.currentIndex) {
      this.buildChart()
    }
  }

  componentDidMount() {
    axios.get('https://5de789ddb1ad690014a4e4ac.mockapi.io/month')
      .then(response => this.setState({ budgetData: response.data }, () => this.buildChart()
      ))
  }


  handleTabChange = (e, { activeIndex }) => {
    this.setState({ currentIndex: activeIndex })

  }

  buildChart = () => {
    const myChartRef = this.chartRef.current.getContext("2d");
    const { budgetData, currentIndex } = this.state
    let colors = []

    Object.keys(budgetData[currentIndex].expenses).map(d => colors.push(this.getRandomColor()))
    if (doughnutChart) doughnutChart.destroy();

    doughnutChart = new Chart(myChartRef, {
      type: 'pie',
      options: {
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

  handleChangeInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  saveExpenses = () => {
    const { budgetData, currentIndex, expenses, amount } = this.state
    let tempBudgetData = budgetData

    if (expenses !== '' && amount !== '' && !(expenses in tempBudgetData[currentIndex]['expenses'])) {
      tempBudgetData[currentIndex]['expenses'][expenses] = Number(amount)
      this.setState({
        budgetData: tempBudgetData,
        expenses: '',
        amount: '',
      })
      doughnutChart.destroy()
      this.buildChart()
    }

  }

  removeExpenses = (item) => {
    const { budgetData, currentIndex } = this.state
    let tempData = [...budgetData]
    delete tempData[currentIndex]['expenses'][item]
    this.setState({
      budgetData: tempData
    })
    doughnutChart.destroy()
    this.buildChart()

  }

  tabNames = () => {
    const { budgetData } = this.state

    return budgetData.map(({ name, expenses }, idx) => {
      return (
        {
          menuItem: name,
          render: () =>
            this.state.budgetData.length ? <Tab.Pane >
              <div className='pane-wrapper'>
                <canvas
                  className='chart-wrapper'
                  id="myChart"
                  ref={this.chartRef}
                />
                <div className='data-table'>
                  <div className='data-table-wrapper'>
                    <div className='data-table-row'>
                      {Object.keys(expenses).map(d => <span key={d}>{d}</span>)}
                    </div>
                    <div className='data-table-row'>
                      {Object.values(expenses).map(d => <span key={d}>{d}</span>)}
                    </div>
                    <div className='data-table-row'>
                      {Object.keys(expenses).map(d => <Button compact key={d} onClick={() => this.removeExpenses(d)}>удалить</Button>)}
                    </div>
                  </div>
                  <div className="data-form-wrapper">
                    <Input name='expenses' value={this.state.expenses} placeholder='Название расходов' onChange={(e) => this.handleChangeInput(e)} />
                    <Input name='amount' value={this.state.amount} type="number" placeholder='Сумма' onChange={(e) => this.handleChangeInput(e)} />
                    <Button compact onClick={() => this.saveExpenses()}>Сохранить</Button>
                  </div>
                  <Statistic label='Всего расходов' value={Object.values(expenses).reduce((a, b) => a + b, 0)} />
                </div>

              </div>
            </Tab.Pane> : <Tab.Pane loading ></Tab.Pane>
        }
      )

    })
  }

  render() {
    const { currentIndex } = this.state

    return (
      <div>
        <Tab activeIndex={currentIndex} menu={{ pointing: true }} panes={this.tabNames()} onTabChange={this.handleTabChange} />
      </div>
    )
  }
}

export default Budget;
