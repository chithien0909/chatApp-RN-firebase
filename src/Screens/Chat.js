import React, {Component} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import firebaseSDK from "../../config/firebaseSDK";
import {View} from 'react-native';
import {KeyboardAvoidingView} from 'react-native';
// type Props = {
//   name?: string,
//   email?: string,
//   avatar?: string
// };
 class Chat extends Component{
  constructor(props) {
    super(props);
    console.ignoredYellowBox = [
      'Setting a timer'
    ]
  }

  static navigationOptions = ({navigation}) => ({
    title: (navigation.state.params || {}).name || 'Chat!'
  });
  state = {
    messages: []
  };
  get user() {
    return {
      name: this.props.navigation.state.params.name,
      email: this.props.navigation.state.params.email,
      avatar: this.props.navigation.state.params.avatar,
      id: firebaseSDK.uid,
      _id: firebaseSDK.uid, // need for gifted-chat
    };
  }
  render(){
    return (
        <View style={{flex: 1}}>

          <GiftedChat
              messages={this.state.messages}
              onSend={firebaseSDK.send}
              user={this.user}
          />
          <KeyboardAvoidingView
              behavior={'padding'}
              keyboardVerticalOffset={85}/>
        </View>
    )
  }

  componentDidMount() {
    firebaseSDK.refOn(message =>
        this.setState((previousState) => ({
          messages: GiftedChat.append(previousState.messages, message),
        }))
    );
  }
  componentWillUnmount() {
    firebaseSDK.refOff();
  }
}
export default Chat;