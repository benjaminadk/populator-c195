import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import { List, ListItem } from 'material-ui/List'
import LinearProgress from 'material-ui/LinearProgress'
import Snackbar from 'material-ui/Snackbar'
import PersonIcon from 'material-ui/svg-icons/social/person-outline'
import '../styles/Home.css'
import axios from 'axios'

export default class Home extends Component {
  
  state = {
    host: '',
    user: '',
    password: '',
    database: '',
    createUsername: '',
    createPassword: '',
    open: false,
    message: '',
    users: null,
    progress: false
  }
  
  handleChange = (e,d) => this.setState({ [e.target.name]: d})
  
  handlePopulate = async () => {
    const host = window.localStorage.getItem('HOST')
    const user = window.localStorage.getItem('USER')
    const password = window.localStorage.getItem('PASS')
    const database = window.localStorage.getItem('NAME')
    const users = this.state.users
    if(users.length < 3) {
      await this.setState({ open: true, message: 'Must have at least 3 Users'})
      return
    }
    await this.setState({ progress: true })
    const response = await axios({
      method: 'post',
      url: '/api/populate',
      data: {
        host, user, password, database, users
      }
    })
    if(response.status === 200) {
      await this.setState({ 
        open: true, 
        progress: false,
        message: 'Database Populated in ' + response.data + ' seconds' })
    }
  }
  
  handleCreateUser = async () => {
    const host = window.localStorage.getItem('HOST')
    const user = window.localStorage.getItem('USER')
    const password = window.localStorage.getItem('PASS')
    const database = window.localStorage.getItem('NAME')
    const { createUsername, createPassword } = this.state
    const response = await axios({
      method: 'post',
      url: '/api/add-user',
      data: {
        host, user, password, database, createUsername, createPassword
      }
    })
    this.setState({ createUsername: '', createPassword: '' })
    if(response.status === 200) {
      this.setState({ open: true, message: 'User Created' })
    }
  }
  
  handleFetchUserNames = async () => {
    const host = window.localStorage.getItem('HOST')
    const user = window.localStorage.getItem('USER')
    const password = window.localStorage.getItem('PASS')
    const database = window.localStorage.getItem('NAME')
    const response = await axios({
      method: 'post',
      url: '/api/get-users',
      data: {
        host, user, password, database
      }
    })
    this.setState({ users: response.data })
  }
  
  handleRequestClose = () => this.setState({ open: false })
  
  handleConnParams = () => {
    const { host, user, password, database } = this.state
    if(!host || !user || !password || !database) {
      this.setState({ open: true, message: 'Error: Missing Connection Parameters'})
      return
    }
    window.localStorage.setItem('HOST', host)
    window.localStorage.setItem('USER', user)
    window.localStorage.setItem('PASS', password)
    window.localStorage.setItem('NAME', database)
  }
  
  render() {
    return([
      <div key='main-view' id='mainContainer'>
        <div id='column1'>
          <h3 className='col-header'>Connection Parameters</h3>
          <TextField 
            floatingLabelText='Server IP Address'
            hintText='xx.xxx.xxx.xxx'
            onChange={this.handleChange}
            value={this.state.host}
            name='host'
            fullWidth
          />
          <br/>
          <TextField
            floatingLabelText='Username'
            hintText='UCertify Username'
            onChange={this.handleChange}
            value={this.state.user}
            name='user'
            fullWidth
          />
          <br/>
          <TextField
            floatingLabelText='Password'
            hintText='UCertify Password'
            type='password'
            onChange={this.handleChange}
            value={this.state.password}
            name='password'
            fullWidth
          />
          <br/>
          <TextField
            floatingLabelText='Database Name'
            onChange={this.handleChange}
            value={this.state.database}
            name='database'
            fullWidth
          />
          <br/>
          <RaisedButton
            label='Store Connection Parameters'
            secondary
            onClick={this.handleConnParams}
          />
        </div>
        <div id='column2'>
          <h3 className='col-header'>Create User</h3>
          <TextField
            floatingLabelText='UserName'
            onChange={this.handleChange}
            value={this.state.createUsername}
            name='createUsername'
            fullWidth
          />
          <br/>
          <TextField
            floatingLabelText='Password'
            onChange={this.handleChange}
            value={this.state.createPassword}
            name='createPassword'
            fullWidth
          />
          <br/>
          <RaisedButton
            label='Create User'
            primary
            onClick={this.handleCreateUser}
          />
          <br/>
          <RaisedButton
            label='Populate'
            onClick={this.handlePopulate}
            disabled={this.state.users === null ? true : false}
            secondary
          />
        </div>
        <div id='column3'>
          <h3 className='col-header'>All Users</h3>
            {this.state.users && <List> {this.state.users.map(u => {
              return(<ListItem primaryText={u} leftIcon={<PersonIcon/>}/>)})}</List>}
          <RaisedButton
            label='Fetch User Names'
            primary
            onClick={this.handleFetchUserNames}
          />
          <br/>
          <RaisedButton
            label='Go to Table Views'
            secondary
            onClick={() => this.props.history.push('/tables')}
          />
        </div>
        {this.state.progress && <LinearProgress 
          mode="indeterminate"
          style={{ width: '99vw', height: '3vh' }}
        />}
      </div>,
      <Snackbar key='snackbar'
        open={this.state.open}
        message={this.state.message}
        autoHideDuration={10000}
        onRequestClose={this.handleRequestClose}
      />
    ])
  }
}