import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

const root = document.getElementById('root')
const muiTheme = getMuiTheme({
    fontFamily: 'Roboto'
})

ReactDOM.render(
    <MuiThemeProvider theme={muiTheme}>
        <App />
    </MuiThemeProvider>, root)

