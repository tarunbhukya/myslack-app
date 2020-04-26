import React from 'react'
import firebase from '../../firebase'
import {
    Grid,
    Form, 
    Message, 
    Segment, 
    Button, 
    Header, 
    Icon
 } from 'semantic-ui-react';
import {
    Link
} from 'react-router-dom';


class Login extends React.Component {

    state = {
        "email": "",
        "password": "",
        "errors": [],
        "loading": false
    };

    handleChange = event => {
        this.setState({ [event.target.name] : event.target.value })
    };

    handleSubmit = event => {
        event.preventDefault();
        if(this.isFormValid()) {
            this.setState({ errors: [], loading: true })
            firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(loggedInUser => {
            this.setState({ loading: false })
               console.log(loggedInUser);
            })
            .catch(err => {
                console.log(err);
                let errors = []
                this.setState({ loading: false, errors: errors.concat(err) })
            });
        }else {
            console.log(this.state.errors);
        }
    };

   
    isFormValid = () => {
        let errors = []
        let error;
        if(this.isFormEmpty(this.state)) {
            // throw error
            error = { message: 'Fill in all the fields!' };
            this.setState({  errors: errors.concat(error)  });
            return false;
        }else {
            return true;
        }
    }

    isFormEmpty = ({email, password}) => {
        return !email.length || !password.length ;
    }


    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>)   

    handleInputErrors = (errors, inputName) => {
        return errors.some(error => 
            error.message.toLowerCase().includes(inputName) 
        )
        ? "error"
        : ""
    }

    render() {
        const { email, password, errors, loading } = this.state;
        return(
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h2" icon color="violet" textAlign="center">
                        <Icon name="code branch" color="violet" />
                        Register for DevChat
                    </Header>
                    <Form size="large" onSubmit={this.handleSubmit}>
                        <Segment stacked>
                        

                            <Form.Input 
                                fluid 
                                name="email" 
                                icon="mail" 
                                iconPosition="left"
                                placeholder='Email Address'
                                onChange={this.handleChange}
                                value={email}
                                type="email"
                                className={
                                   this.handleInputErrors(errors, 'email')
                                }
                             />

                            <Form.Input 
                                fluid 
                                name="password" 
                                icon="lock" 
                                iconPosition="left"
                                placeholder='Password'
                                onChange={this.handleChange}
                                value={password}
                                type="password"
                                className={
                                    this.handleInputErrors(errors, 'password')
                                 }
                             />

                             <Button
                              fluid 
                              color="blue"
                              disabled={loading} 
                              className={loading ? "loading" : ""}
                              size="large">Submit</Button>
                        </Segment>
                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {
                               this.displayErrors(errors) 
                            }
                        </Message>
                    )}
                    <Message>Not a user ? ? <Link to="/register">Register</Link></Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Login;