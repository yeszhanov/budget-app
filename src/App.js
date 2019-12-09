import React, { Component } from 'react';
import axios from 'axios'
import './App.css';
import { getDataFromStorage } from './helpers/main'
import { Tab } from "semantic-ui-react"
import PieChart from './components/chart'



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


  componentDidMount() {
    axios.get('https://5de789ddb1ad690014a4e4ac.mockapi.io/month')
      .then(response => this.setState({ budgetData: response.data }
      ))
  }


  handleTabChange = (e, { activeIndex }) => {
    this.setState({ currentIndex: activeIndex })

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
      tempBudgetData[currentIndex]['expenses'][expenses] = amount
      this.setState({
        budgetData: tempBudgetData,
        expenses: '',
        amount: '',
      })
    }

  }

  removeExpenses = (item) => {
    const { budgetData, currentIndex, expenses, amount } = this.state
    let tempData = [...budgetData]
    delete tempData[currentIndex]['expenses'][item]
    this.setState({
      budgetData: tempData
    })

  }
  tabNames = () => {
    const { budgetData, currentIndex } = this.state

    return budgetData.map(({ name, expenses }, idx) => {
      return (
        {
          menuItem: name,
          render: () =>
            this.state.budgetData.length ? <Tab.Pane >
              <div className='pane-wrapper'>
                <PieChart budgetData={budgetData} currentIndex={currentIndex} />
                <div className='data-table'>
                  <div className='data-table-wrapper'>
                    <div className='data-table-row'>
                      {Object.keys(expenses).map(d => <span key={d}>{d}</span>)}
                    </div>
                    <div className='data-table-row'>
                      {Object.values(expenses).map(d => <span key={d}>{d}</span>)}
                    </div>
                    <div className='data-table-row'>
                      {Object.keys(expenses).map(d => <button key={d} onClick={() => this.removeExpenses(d)}>удалить</button>)}
                    </div>
                  </div>
                  <div className="data-form-wrapper">
                    <input name='expenses' placeholder='Название расходов' onChange={(e) => this.handleChangeInput(e)} />
                    <input name='amount' type="number" placeholder='Сумма' onChange={(e) => this.handleChangeInput(e)} />
                    <button onClick={() => this.saveExpenses()}>Сохранить</button>
                  </div>
                </div>
              </div>
            </Tab.Pane> : <Tab.Pane loading ></Tab.Pane>
        }
      )

    })
  }

  render() {
    const { budgetData, currentIndex } = this.state

    return (
      <div>
        <Tab activeIndex={currentIndex} menu={{ pointing: true }} panes={this.tabNames()} onTabChange={this.handleTabChange} />

      </div>
    )
  }
}

export default Budget;
