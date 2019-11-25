import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Chat from "./src/Screens/Chat";
import Login from "./src/Screens/Login";
import SignUp from "./src/Screens/SignUp";
const navigator = createStackNavigator({
    Chat,
    Login,
    SignUp
},{
    initialRouteName: 'Login',
    headerLayoutPreset: 'center',
    defaultNavigationOptions: {
        title: 'Messenger'
    }
});
const App = createAppContainer(navigator);
export default App;
