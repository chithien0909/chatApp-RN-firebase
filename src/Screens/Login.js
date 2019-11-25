import React, {Component} from 'react';
import {StyleSheet, Text, TextInput, View, Button} from 'react-native';
import firebaseSDK from "../../config/firebaseSDK";
// import firebase, {auth, initializeApp, storage} from 'firebase';
// import uuid from 'uuid';
export  default class Login extends Component{
    static navigationOptions = {
        title: 'RN + Firebase'
    };
    state = {
        name: '',
        email: '',
        password: '',
        avatar: ''
    };
    onPressLogin = async () =>{
        const user = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            avatar: this.state.avatar
        };
        const response = firebaseSDK.login(
            user,
            this.loginSuccess,
            this.loginFailed
        );
    };
    loginSuccess =async () => {
        console.log("Login success full");
        // alert('Login successful, navigate to chat');
        let currentUser = await firebaseSDK.getCurrentUser();
        console.log(currentUser);
        this.props.navigation.navigate('Chat',{
           name: currentUser.displayName,
           email: currentUser.email,
           avatar: currentUser.photoURL
        });
    };
    loginFailed = () => {
        console.log("Login failed");
        alert('Login failure. Please tried again.');
    };

    onChangeTextEmail = email => {
        this.setState({email});
    };
    onChangeTextPassword = password => {
        this.setState({password});
    };

    render() {
        return (
            <View>
                <Text style>Email: </Text>
                <TextInput
                    style={styles.nameInput}
                    placeholder = 'abc@gmail.com'
                    onChangeText={this.onChangeTextEmail}
                    value={this.state.email}
                />
                <Text style={styles.title}>Password:</Text>
                <TextInput
                    style={styles.nameInput}
                    onChangeText={this.onChangeTextPassword}
                    value={this.state.password}
                    secureTextEntry={true}
                />
                <Button
                    title='Login'
                    style={styles.buttonText}
                    onPress={this.onPressLogin}
                />
                <Button
                    title='Sign up'
                    style={styles.buttonText}
                    onPress={() => this.props.navigation.navigate('SignUp')}
                />
            </View>
        );
    }

}
const styles = StyleSheet.create({
    title:{
        marginTop: 16,
        marginLeft: 16,
        fontSize: 16
    },
    nameInput: {
        height: 16 * 2,
        margin: 16,
        paddingHorizontal: 16,
        borderColor: '#111',
        borderWidth: 1,
        fontSize: 16
    },
    buttonText: {
        marginLeft: 16,
        marginBottom: 10,
        fontSize: 42
    }
});