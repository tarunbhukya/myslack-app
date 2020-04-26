import React from 'react'
import firebase from '../../firebase'
import md5 from 'md5';
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
class Register extends React.Component {

    state = {
        "username": "",
        "email": "",
        "password": "",
        "passwordConfirmation": "",
        "errors": [],
        "loading": false,
        "usersRef": firebase.database().ref('users')
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
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(createdUser => {
                console.log(createdUser);
                createdUser.user.updateProfile({
                    displayName: this.state.username,
                    photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?identicon`
                })
                .then(() => {
                    this.saveUser(createdUser).then(() => {
                        console.log("user saved");
                    })
                    this.setState({ loading: false })
                })
                .catch(err => {
                    let errors = []
                    this.setState({ loading: false, errors: errors.concat(err) })
                })
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

    saveUser = createdUser => {
        return this.state.usersRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL
        });
    }

    isFormValid = () => {
        let errors = []
        let error;
        if(this.isFormEmpty(this.state)) {
            // throw error
            error = { message: 'Fill in all the fields!' };
            this.setState({  errors: errors.concat(error)  });
            return false;
        } else if (!this.isPasswordValid(this.state)) {
            // throw error
            error = { message: 'password\'s doesn\'t match' };
            this.setState({ errors: errors.concat(error) });
            return false;
        }else {
            return true;
        }
    }

    isFormEmpty = ({username, email, password, passwordConfirmation}) => {
        return !username.length || !email.length || !password.length || !passwordConfirmation.length
    }

    isPasswordValid = ({ password, passwordConfirmation }) => {
        if (password.length < 6 || passwordConfirmation.length < 6) {
            return false;
        }else if (passwordConfirmation !== password) {
            return false;
        }else { 
            return true;
        }
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
        const { username, email, password, passwordConfirmation, errors, loading } = this.state;
        return(
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h2" icon color="blue" textAlign="center">
                        <Icon name="puzzle piece" color="blue" />
                        Register for DevChat
                    </Header>
                    <Form size="large" onSubmit={this.handleSubmit}>
                        <Segment stacked>
                            <Form.Input 
                                fluid 
                                name="username" 
                                icon="user" 
                                iconPosition="left"
                                placeholder='Username'
                                onChange={this.handleChange}
                                value={username}
                                type="text"
                                className={
                                    this.handleInputErrors(errors, 'fill')
                                 }
                             />

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

                            <Form.Input 
                                fluid 
                                name="passwordConfirmation" 
                                icon="repeat" 
                                iconPosition="left"
                                placeholder='Password Confirmation'
                                onChange={this.handleChange}
                                value={passwordConfirmation}
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
                    <Message>Already a User ? <Link to="/login">Login</Link></Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Register;