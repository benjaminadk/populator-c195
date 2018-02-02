import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog'
import { Step, Stepper, StepLabel, StepContent } from 'material-ui/Stepper'
import HelpIcon from 'material-ui/svg-icons/action/help-outline'
import Home from './Home'
import Tables from './Tables'

class App extends Component {
  
  state = {
    open: false,
    finished: false,
    stepIndex: 0
  }
  
  handleDocumentation = () => this.setState({ open: true })
  
  handleRequestClose = () => this.setState({ open: false })
  
  handleNext = () => this.setState({ stepIndex: this.state.stepIndex + 1, finished: this.state.stepIndex >= 4 })
  
  handlePrev = () => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  }
  
  renderStepActions = (step) => {
    const {stepIndex} = this.state
    return(
        <div>
          <RaisedButton
            label={stepIndex === 4 ? 'Finish' : 'Next'}
            disableTouchRipple={true}
            disableFocusRipple={true}
            primary={true}
            onClick={this.handleNext}
            style={{marginRight: 12}}
          />
          {step > 0 && (
          <FlatButton
            label="Back"
            disabled={stepIndex === 0}
            disableTouchRipple={true}
            disableFocusRipple={true}
            onClick={this.handlePrev}
          />
        )}
        </div>
      )
  }
  
  render() {
    return (
      <BrowserRouter>
        <div>
          <AppBar
            title='Populator C195'
            iconElementRight={<FlatButton 
                                label='Documentation' 
                                labelPosition='before'
                                onClick={this.handleDocumentation}
                                icon={<HelpIcon/>}/>}
          />
          <Dialog
            open={this.state.open}
            onRequestClose={this.handleRequestClose}
            title='Documentation'
            contentStyle={{ width: '85vw', maxWidth: 'none' }}
            autoScrollBodyContent
          >
            <h3>Step By Step Instruction</h3>
            <Stepper
              activeStep={this.state.stepIndex}
              orientation='vertical'
            >
              <Step>
                <StepLabel>Gather UCertify Database Information</StepLabel>
                <StepContent>
                  <p>
                      Access C195 through the WGU Website. Open the Course Materials. On the main menu, click on 
                      the MySQL Database Option. Once the screen is loaded click on Create Database then click on
                      Get Connection String.  Values will appear. These values correspond to the Connection Information
                      form on this page. Copy and Paste the values to the Populator form. Click the Store Connection 
                      Parameters Button to save your Connection Parameters to Local Storage for use throughout the site.
                      Your private data is never stored anywhere except in your own Local Storage.
                  </p>
                  {this.renderStepActions(0)}
                </StepContent>
              </Step>
              <Step>
                <StepLabel>Add User to Database</StepLabel>
                <StepContent>
                  <p>
                    Instead of Auto Populating Users you can create and add your own. Fill in the UserName and Password
                    Text Fields in the middle form. Click the Add User Button. Add as many Users as you want.
                    I found 3 to be a good number since there are 3 branch offices. As of right now, you must 
                    have at least 3 Users for Populator to work. If you have more only the first 3 will be used in populating.
                  </p>
                  {this.renderStepActions(1)}
                </StepContent>
              </Step>
              <Step>
                <StepLabel>Fetching All Users</StepLabel>
                <StepContent>
                  <p>
                    I think it is important that Users are created and that they are available when Appoinments are Auto 
                    Populated.  The userName of the User can be listed as the contact and will make report generation easier
                    in the future. To assure User creation and availability click the Fetch User Name Button. A list should
                    appear and the Populate Button should now be enabled.
                  </p>
                  {this.renderStepActions(2)}
                </StepContent>
              </Step>
              <Step>
                <StepLabel>Populate Your Database</StepLabel>
                <StepContent>
                  <p>
                    Simply click the Populate Button.  This should automatically generate fake data and populate 
                    your database. The following amounts of data are inserted: 2 countries, 10 cities, 100 addresses, 100 customers 
                    and 300 appointments. Data is structured such that the 100 customers are split between the 3 branch offices. 30 
                    to New York, 30 to Phoenix and 40 to London, based on proximity of the customer to that branch.  Three 
                    appoinments will be given to each customer, including an introduction and two consulting appoinments. All data
                    is cleared before population and Auto Increment is activated for the relevant id properties.
                  </p>
                  {this.renderStepActions(3)}
                </StepContent>
              </Step>
              <Step>
                <StepLabel>Check the Results</StepLabel>
                <StepContent>
                  <p>
                    A snackbar will eventually show up telling you that the database population process is complete. 
                    There will also be a time is seconds. Data is viewable by clicking the Table 
                    View Button. A more thorough solution is to download MySQL Workbench a view your data there.
                  </p>
                  {this.renderStepActions(4)}
                </StepContent>
              </Step>
            </Stepper>
            <div>
              <h3>Additional Thoughts</h3>
              <ul>
                <li>
                  Download MySQL Workbench - It should be the main tool to work with this database. This program is just a way to 
                  save a lot of typing.
                </li>
                <br/>
                <li>
                  I made this first version of Populator C195 in a few hours, and as a result there is not much in the way of 
                  validation for the forms, or any error handling on the frontend for that matter. Sorry.  Appoinments are each
                  one hour long and should begin on the current date for each branch. Office hours are 9-5 with the last appointment
                  starting at 4.  All times are UTC with the appropriate adjustment for Feb 1.  I am still learning amount times, 
                  but it is my understanding that a locales variance from UTC can change with daylight savings.  For example, the 
                  New York times are 5 hours ahead when converted to UTC. A 9:00 am appoinment is 14:00:00 UTC.
                </li>
                <br/>
                <li>
                  I made this app, more to keep my JavaScript skills sharp, than anything else. Since this is the Software Development 
                  Program, if anyone wants to contribute to Populator C195, please contact me. I thought about giving the user more 
                  control over the fake data they generate, but just getting something working has been my initial goal. 
                </li>
                <br/>
                <li>
                  I find this class and project to be weird. I understand the data structures, but wish they let us create our own.  
                  I don't know, maybe having a somewhat vague goal is a good thing. I do wish that the college offered more than 
                  the UCertify textbook. Code along videos, building small components would be cool.
                </li>
                <br/>
                <li>
                  <a href="mailto:bbroo43@wgu.edu?Subject=Populator%20C195">Email Me</a>
                </li>
              </ul>
            </div>
          </Dialog>
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route path='/tables' component={Tables}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App
