import React from 'react';
import {View, Text} from 'react-native';
// import SignUpScreen from './src/component/SignUpScreen';
import LoginScreen from './src/component/LoginScreen';

const App = () => {
    return (
        <View>
            <Text>Test용 앱 화면</Text>
            {/* <SignUpScreen /> */}
            <LoginScreen />
        </View>
    );
};

export default App;