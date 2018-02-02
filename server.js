// import express from 'express'
// import mysql from 'mysql'
// import bodyParser from 'body-parser'
// import Chance from 'chance'
// import moment from 'moment'
// import path from 'path'
const express = require("express")
const mysql = require("mysql")
const bodyParser = require("body-parser")
const Chance = require("chance")
const moment = require("moment")
const path = require("path")

const server = express()
const chance = new Chance()
const PORT = process.env.PORT || 8081

server.use(bodyParser.json())

server.use(express.static(path.join(__dirname, 'client/build')))

// POST ROUTES
// MAIN POPULATE ROUTE 
server.post('/api/populate', (req, res) => {
  var timer = 0
  var counter = setInterval(() => timer++, 1000)
  
  const { host, user, password, database, users } = req.body
  const connection = mysql.createConnection({ host, user, password, database })
  
  connection.connect(err => {
    if(err) {
      console.error('Error Opening Connection: ' + err.stack)
      res.status(500).json({ error: 'Unable to connect to database'})
      return
    }
  })
  
  connection.query('TRUNCATE TABLE country')
  connection.query('TRUNCATE TABLE city')
  connection.query('TRUNCATE TABLE address')
  connection.query('TRUNCATE TABLE customer')
  connection.query('TRUNCATE TABLE appointment')
  
  const countries = ['United States', 'England']
    
  countries.forEach(c => {
    let obj = { country: c }
    connection.query('INSERT INTO country SET ?', obj, (error, results, fields) => {
      if(error) throw error
    })
  })
  
  const cities = [['New York',1], ['Washington DC',1], ['Miami',1], ['Dallas',1], ['Phoenix',1], ['Los Angeles',1], 
    ['London',2], ['Liverpool',2], ['Manchester',2], ['Oxford',2]]
  
  cities.forEach(c => {
    let obj = { city: c[0], countryId: c[1] }
    connection.query('INSERT INTO city SET ?', obj, (error, results, fields) => {
      if(error) throw error
    })
  })
  
  for(let i = 1; i < 11; i++) {
    for(let j = 1; j < 11; j++) {
      let obj = { 
        address: chance.address(), 
        cityId: i, 
        postalCode: chance.zip(), 
        phone: chance.phone({ formatted: false })}
      
      connection.query('INSERT INTO address SET ?', obj, (error, results, fields) => {
        if(error) throw error
      })
    }
  }
  
  for(let i = 1; i < 101; i++) {
    let obj = { customerName: chance.name(), addressId: i, active: 1 }
    connection.query('INSERT INTO customer SET ?', obj, (error, results, fields) => {
      if(error) throw error
    })
  }
  
  const titles = ['Consultation', 'Introduction', 'Consultation']
  const descriptions = ['First Meeting', 'Retirement Planning', 'Stock Market Guidance', 'Tax Preparation']
  const timeslots = ['09','10','11','12','13','14','15','16']
  var location
  var contact
  var offset
  var count = 0
  let date = moment().format('YYYY-MM-DD')
  
  for(let i = 1; i < 301; i++) {
    if(i < 91) { location = 'New York', contact = users[0], offset = '-05:00' }
    else if(i > 90 && i < 181) { location = 'Phoenix', contact = users[1], offset = '-07:00' }
    else { location = 'London', contact = users[2], offset = '+00:00' }
    
    if(i % 8 === 0) { date = moment(date).add(1, 'd').format('YYYY-MM-DD') }
    
    if(count === 90) { 
      date = moment().format('YYYY-MM-DD')
      count = 0
    }
    
    let dateTimeString = `${date}T${timeslots[i % 8]}:00:00${offset}`
    let start = moment(dateTimeString).format()
    let end = moment(dateTimeString).add(1,'h').format()
    
    let obj = { 
      customerId: Math.ceil(i / 3), 
      title: titles[i % 3], 
      description: i % 3 === 1 ? descriptions[0] : descriptions[(Math.floor(Math.random() * 3)) + 1],
      location,
      contact,
      start,
      end
    }
    count++
    connection.query('INSERT INTO appointment SET ?', obj, (error, results, fields) => {
      if(error) throw error
    })
    
  }
  
  connection.end(err => {
    if(err) console.error('Error Ending Connection: ' + err.stack)
    console.log('Connection Terminated')
    clearInterval(counter)
    res.status(200).json(timer)
  })
})

// ROUTE TO CREATE A SINGLE USER
server.post('/api/add-user', (req, res) => {
  const { host, user, password, database, createUsername, createPassword } = req.body
  const connection = mysql.createConnection({ host, user, password, database })
  
  connection.connect(err => {
    if(err) {
      console.error('Error Opening Connection: ' + err.stack)
      res.status(500).json({ error: 'Unable to connect to database'})
      return
    }
  })
  
  let obj = { userName: createUsername, password: createPassword }
  connection.query('INSERT INTO user SET ?', obj, (error, results, fields) => {
    if(error) throw error
    res.status(200).json({ message: 'user added' })
  })
  
  connection.end(err => {
    if(err) console.error('Error Ending Connection: ' + err.stack)
    console.log('Connection Terminated')
  })
})

// ROUTE TO FETCH ALL USERS
server.post('/api/get-users', (req, res) => {
  const { host, user, password, database } = req.body
  const connection = mysql.createConnection({ host, user, password, database })
  const users = []
  
  connection.connect(err => {
    if(err) {
      console.error('Error Opening Connection: ' + err.stack)
      res.status(500).json({ error: 'Unable to connect to database'})
      return
    }
  })
  
  connection.query('SELECT * FROM user', (error, results, fields) => {
    if(error) throw error
    results.forEach(r => users.push(r.userName))
    res.status(200).json(users)
  })
  
  connection.end(err => {
    if(err) console.error('Error Ending Connection: ' + err.stack)
    console.log('Connection Terminated')
  })
})

// ROUTE TO GET DATA FOR TABLE VIEWS
server.post('/api/tables', (req, res) => {
  const { host, user, password, database, index } = req.body
  const connection = mysql.createConnection({ host, user, password, database })
  
  connection.connect(err => {
    if(err) {
      console.error('Error Opening Connection: ' + err.stack)
      res.status(500).json({ error: 'Unable to connect to database'})
      return
    }
  })
  if(index === 1) {
    connection.query(`SELECT customer.customerId, customer.customerName, address.address, city.city, country.country, address.phone 
                    FROM customer 
                    INNER JOIN address ON customer.addressId = address.addressId 
                    INNER JOIN city ON address.cityId = city.cityId
                    INNER JOIN country ON city.countryId = country.countryId`, (error, results, fields) => {
    if(error) throw error
    res.status(200).json(results)
    })
  }
  else if(index === 2) {
    connection.query('SELECT userId, userName, password FROM user', (error, results, fields) => {
      if(error) throw error
      res.status(200).json(results)
    })
  }
  else if(index === 3) {
    connection.query(`SELECT appointment.appointmentId, customer.customerName, appointment.title, appointment.description, appointment.start, appointment.end, appointment.contact 
                      FROM appointment
                      INNER JOIN customer ON appointment.customerId = customer.customerId`, (error, results, fields) => {
    if(error) throw error
    res.status(200).json(results)
    })
  }
  
  connection.end(err => {
    if(err) console.error('Error Ending Connection: ' + err.stack)
    console.log('Connection Terminated')
  })
})

server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

server.listen(PORT, () => console.log(`SERVER LISTENING ON PORT ${PORT}`))