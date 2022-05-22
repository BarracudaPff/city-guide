import React from 'react';
import {LogBox, SafeAreaView, View} from 'react-native';
import MapScreen from './src/map';

// Ignore log notification by message
LogBox.ignoreLogs([]);

const Index = () => {
    return (
        <View style={{flex: 1}}>
            {/*<SafeAreaView style={{flex: 1, backgroundColor: '#F4F9FD'}}>*/}
            <MapScreen/>
            {/*<Provider store={store}>*/}
            {/*    <AppNavigator/>*/}
            {/*    <Toast position={"bottom"}/>*/}
            {/*</Provider>*/}
            {/*</SafeAreaView>*/}
        </View>
);
};

export default Index;
