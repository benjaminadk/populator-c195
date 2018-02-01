import React, { Component } from 'react'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import axios from 'axios'
import '../styles/Tables.css'

export default class Tables extends Component {
  
  state = {
    tableTitle: 'Blank Table',
    header1: '1',
    header2: '2',
    header3: '3',
    header4: '4',
    header5: '5',
    header6: '6',
    header7: '7',
    select: 1,
    data: null
  }
  
  handleSelect = (e, i, v) => this.setState({ select: v })
  
  handleQuery = async () => {
    const response = await axios({
      method: 'post',
      url: '/api/tables',
      data: {
        host: window.localStorage.getItem('HOST'),
        user: window.localStorage.getItem('USER'),
        password: window.localStorage.getItem('PASS'),
        database: window.localStorage.getItem('NAME'),
        index: this.state.select
      }
    })
    if(this.state.select === 1) {
        this.setState({ 
          tableTitle: 'Customer Data', 
          header1: 'Customer ID', 
          header2: 'Name', 
          header3: 'Address', 
          header4: 'City',
          header5: 'Country',
          header6: 'Phone',
          header7: null
        })
    }
    else if(this.state.select === 2) {
      this.setState({
        tableTitle: 'User Data', 
          header1: 'User ID', 
          header2: 'Username', 
          header3: 'Password', 
          header4: null,
          header5: null,
          header6: null,
          header7: null
      })
    }
    else if(this.state.select === 3) {
      this.setState({
        tableTitle: 'Appointment Data',
        header1: 'Apt ID',
        header2: 'Customer Name',
        header3: 'Title',
        header4: 'Description',
        header5: 'Start',
        header6: 'End',
        header7: 'Contact'
      })
    }
    this.setState({ data: response.data })
  }
  
  render() {
    const { tableTitle, header1, header2, header3, header4, header5, header6, header7, data, select } = this.state
    return(
      <div id='tablesContainer'>
        <div id='controls'>
          <div>
            <h3 className='col-header'>Controls</h3>
            <SelectField
              floatingLabelText='Select Database Table'
              floatingLabelStyle={{ color: '#00BCD4' }}
              value={this.state.select}
              onChange={this.handleSelect}
              autoWidth
            >
              <MenuItem value={1} primaryText='Customer'/>
              <MenuItem value={2} primaryText='User'/>
              <MenuItem value={3} primaryText='Appointment'/>
            </SelectField>
            <br/>
            <RaisedButton
              label='Execute Query'
              onClick={this.handleQuery}
              primary
            />
          </div>
          <RaisedButton
            label='Go Back to Main Page'
            onClick={() => this.props.history.push('/')}
            secondary
          />
        </div>
        <div id='table'>
          <h3 className='col-header'>{tableTitle}</h3>
          <Table>
            <TableHeader>
              <TableRow>
                {header1 && <TableHeaderColumn>{header1}</TableHeaderColumn>}
                {header2 && <TableHeaderColumn>{header2}</TableHeaderColumn>}
                {header3 && <TableHeaderColumn>{header3}</TableHeaderColumn>}
                {header4 && <TableHeaderColumn>{header4}</TableHeaderColumn>}
                {header5 && <TableHeaderColumn>{header5}</TableHeaderColumn>}
                {header6 && <TableHeaderColumn>{header6}</TableHeaderColumn>}
                {header7 && <TableHeaderColumn>{header7}</TableHeaderColumn>}
              </TableRow>
            </TableHeader>
            <TableBody 
              stripedRows
              displayRowCheckbox={false}
            >
            {data && data.map(d => {
              if(select === 1) {
                return(
                  <TableRow key={d.customerId}>
                    <TableRowColumn>{d.customerId}</TableRowColumn>
                    <TableRowColumn>{d.customerName}</TableRowColumn>
                    <TableRowColumn>{d.address}</TableRowColumn>
                    <TableRowColumn>{d.city}</TableRowColumn>
                    <TableRowColumn>{d.country}</TableRowColumn>
                    <TableRowColumn>{d.phone}</TableRowColumn>
                  </TableRow>
                )}
              else if(select === 2) {
                return(
                  <TableRow key={d.userId}>
                    <TableRowColumn>{d.userId}</TableRowColumn>
                    <TableRowColumn>{d.userName}</TableRowColumn>
                    <TableRowColumn>{d.password}</TableRowColumn>
                  </TableRow>
                )
              }
              else if(select === 3) {
                return(
                  <TableRow key={d.appointmentId}>
                    <TableRowColumn style={{ width: '1vw'}}>{d.appointmentId}</TableRowColumn>
                    <TableRowColumn>{d.customerName}</TableRowColumn>
                    <TableRowColumn>{d.title}</TableRowColumn>
                    <TableRowColumn>{d.description}</TableRowColumn>
                    <TableRowColumn>{d.start}</TableRowColumn>
                    <TableRowColumn>{d.end}</TableRowColumn>
                    <TableRowColumn>{d.contact}</TableRowColumn>
                  </TableRow>
                )
              }
              else {
                return null
              }
              })}
            </TableBody>
          </Table>
        </div>
      </div>
      )      
  }
}