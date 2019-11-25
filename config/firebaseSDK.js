import firebase from "firebase";
import uuid from "uuid";
const config = {
    apiKey: "AIzaSyDB70gs-_fG1XK5V4fl8YzP6DM3Jy8FmJU",
    authDomain: "chat-app-e22d4.firebaseapp.com",
    databaseURL: "https://chat-app-e22d4.firebaseio.com",
    projectId: "chat-app-e22d4",
    storageBucket: "chat-app-e22d4.appspot.com",
    messagingSenderId: "292985410528",
    appId: "1:292985410528:web:ca3c7078e3c558a0781185"
};
class FirebaseSDK{
    constructor() {
        if(!firebase.apps.length){
            firebase.initializeApp(config);
        }else{
            console.log("firebase apps already running...")
        }
        // console.log(firebase.app().name);
    }

    login = async (user, success_callback, failed_callback) => {
        console.log("Logging in");
        const output = await firebase
            .auth()
            .signInWithEmailAndPassword (user.email, user.password)
            .then(success_callback, failed_callback);
    };
    observeAuth = () => {
        firebase.auth()
            .onAuthStateChanged(this.onAuthStateChanged);
    };

    onAuthStateChanged = user => {
        if(!user) {
            try {
                this.login(user);
            }catch ({message}) {
                console.log("Failed: "+message);
            }
        }else{
            console.log("Reusing auth");
        }
    };
    createAccount = async (user, callback) => {
        firebase.auth()
            .createUserWithEmailAndPassword(user.email, user.password)
            .then(
                function () {
                    console.log(
                        'created user successfully. User email:' +
                        user.email +
                        ' name:' +
                        user.name
                    );
                    var userf = firebase.auth().currentUser;
                    userf.updateProfile({displayName: user.name})
                        .then(function () {
                            console.log('Updated displayName successfully. name:' + user.name);
                            alert(
                                'User ' + user.name + ' was created successfully. Please login.'
                            );
                        }, function (error) {
                            console.warn('Error update displayName.');
                        });
                    callback();
                },function (error) {
                    console.log('got error:' + error.message);
                    alert('Create account failed. Error: ' + error.message);
                }
            )
    };
    uploadImage = async uri => {
        console.log('got image to upload. uri:' + uri);
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const ref = firebase
                .storage()
                .ref('avatar')
                .child(uuid.v4());
            const task = ref.put(blob);

            return new Promise((resolve, reject) => {
                task.on(
                    'state_changed',
                    () => {
                        /* noop but you can track the progress here */
                    },
                    reject /* this is where you would put an error callback! */,
                    () => resolve(task.snapshot.downloadURL)
                );
            });
        } catch (err) {
            console.log('uploadImage try/catch error: ' + err.message); //Cannot load an empty url
        }
    };
    updateAvatar = (url) => {
        //await this.setState({ avatar: url });
        var userf = firebase.auth().currentUser;
        if (userf != null) {
            userf.updateProfile({ avatar: url})
                .then(function() {
                    console.log("Updated avatar successfully. url:" + url);
                    alert("Avatar image is saved successfully.");
                }, function(error) {
                    console.warn("Error update avatar.");
                    alert("Error update avatar. Error:" + error.message);
                });
        } else {
            console.log("can't update avatar, user is not login.");
            alert("Unable to update avatar. You must login first.");
        }
    };
    onLogout = user => {
        firebase
            .auth()
            .signOut()
            .then(function () {
                console.log("Sign-out successful");
            }).catch(function (err) {
                console.log("An error happened when signing out");
        })
    };
    get uid(){
        return (firebase.auth().currentUser || {}).uid;
    }
    getCurrentUser() {

        let userf = firebase.auth().currentUser;
        return userf;
    }
    get ref(){
        return firebase.database().ref('Messages');
    }
    refOn = callback => {
        this.ref
            .limitToLast(20)
            .on('child_added',
                    snapshot => callback(this.parse(snapshot)));
    };

    get timestamp() {
        return firebase.database.ServerValue.TIMESTAMP;
    }
    parse = snapshot => {
        const { timestamp: numberStamp, text, user} = snapshot.val();
        const {key: id} = snapshot;
        const {key: _id} = snapshot;
        const timestamp = new Date(numberStamp);
        const message = {id, _id, timestamp, text, user};
        return  message;
    };
    send = messages => {
        for( let i = 0;i<messages.length;i++){
            const {text, user} = messages[i];
            const message = {text, user, createdAt: this.timestamp, };
            this.ref.push(message);
        }
    }
    refOff() {
        this.ref.off();
    }
}
const firebaseSDK = new FirebaseSDK();

export default firebaseSDK;