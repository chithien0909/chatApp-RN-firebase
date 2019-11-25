import React, {Component} from "react";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as Constants from 'expo-constants';
import {
    StyleSheet,
    Text, TextInput,
    View,Button,
    ImageEditor
} from 'react-native';

import firebaseSDK from "../../config/firebaseSDK";

export default class SignUp extends Component{
    state = {
        name: 'no name',
        email: 'chithien0909@gmail.com',
        password: '123456',
        avatar: ''
    };
    onPressCreate = async ()=>{

        try{
            const user = {
                name: this.state.name,
                password: this.state.password,
                email: this.state.email,
                avatar: this.state.avatar
            };
            await firebaseSDK.createAccount(user, () =>this.props.navigation.navigate('Login'));
            ;

        }catch ({message}) {
            console.log('Created account failed. catch error: '+message);
        }
    };
    onChangeTextEmail = email =>{
        this.setState({
            email
        });
    }
    onChangeTextPassword = password => {
        this.setState({
            password
        });
    }
    onChangeTextName = name => {
        this.setState({
            name
        });
    }
    onImageUpload = async ()=>{
        const {status: cameraRollPerm } = await Permissions.askAsync(
            Permissions.CAMERA_ROLL
        );
        try{
            if(cameraRollPerm === 'granted') {
                let pickerResult = await ImagePicker.launchImageLibraryAsync({
                   allowsEditing: true,
                   aspect: [4, 3]
                });
                console.log(
                    'ready to upload ... pickerResult json: '+ JSON.stringify(pickerResult)
                );
                let wantedMaxSize = 150;
                let rawHeight = pickerResult.height;
                let rawWidth = pickerResult.width;
                let ratio = rawWidth / rawHeight;
                let wantedWidth = wantedMaxSize;
                let wantedHeight = wantedMaxSize / ratio;
                //Check vertical or Horizontal
                if(rawHeight > rawWidth ) {
                    wantedWidth = wantedMaxSize * rawWidth;
                    wantedHeight = wantedMaxSize;
                }
                let resizeUri = await new Promise((resolve, reject) => {
                    ImageEditor.cropImage(pickerResult.uri,{
                        offset: {x: 0, y: 0},
                        size: {
                            width: pickerResult.width,
                            height: pickerResult.height,
                        },
                        displaySize: {width: wantedWidth, height: wantedHeight },
                        resizeMode: 'contain'
                    }, uri => resolve(uri),
                        () => reject());
                });
                let uploadUrl = await firebaseSDK.uploadImage(resizeUri);
                this.setState({avatar: uploadUrl});
                await firebaseSDK.updateAvatar(uploadUrl);
            }
        }catch (err) {
            console.log("onImageUpload error: "+ err.message);
            alert('Upload image error: ' + err.message);
        }
    };

    render() {
        return (
            <View>
                <Text style={styles.title}>Email:</Text>
                <TextInput
                    style={styles.nameInput}
                    placeHolder="test@live.com"
                    onChangeText={this.onChangeTextEmail}
                    value={this.state.email}
                />
                <Text style={styles.title}>Password:</Text>
                <TextInput
                    style={styles.nameInput}
                    onChangeText={this.onChangeTextPassword}
                    value={this.state.password}
                />
                <Text style={styles.title}>Name:</Text>
                <TextInput
                    style={styles.nameInput}
                    onChangeText={this.onChangeTextName}
                    value={this.state.name}
                />
                <Button
                    title="Signup"
                    style={styles.buttonText}
                    onPress={this.onPressCreate}
                />
                <Button
                    title="Upload Avatar"
                    style={styles.buttonText}
                    onPress={this.onImageUpload}
                />
            </View>
        );
    }
};
const offset  = 16;
const styles = StyleSheet.create({
    title: {
        marginTop: offset,
        marginLeft: offset,
        fontSize: offset
    },
    nameInput: {
        height: offset * 2,
        margin: offset,
        paddingHorizontal: offset,
        borderColor: '#111',
        borderWidth: 1,
        fontSize: offset
    },
    buttonText: {
        marginLeft: offset,
        fontSize: 42
    }
});
