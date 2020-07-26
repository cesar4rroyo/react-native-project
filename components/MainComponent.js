import React, { Component } from "react";
import Menu from "./MenuComponent";
import Dishdetail from "./DishdetailComponent";
import { View, Platform } from "react-native"
import { createStackNavigator, createDrawerNavigator } from "react-navigation"
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import Home from './HomeComponent';
import Contact from "./ContactComponent";
import AboutUs from "./AboutComponent";

const MenuNavigator = createStackNavigator({
    Menu: { screen: Menu },
    Dishdetail: { screen: Dishdetail }
}, {
    initialRouteName: "Menu",
    navigationOptions: {
        headerStyle: {
            backgroundColor: "#512DA8",

        },
        headerTintColor: "#fff",
        headerTitleStyle: {
            color: "#fff"
        }
    }
})
const HomeNavigator = createStackNavigator({
    Home: { screen: Home }
}, {
    navigationOptions: ({ navigation }) => ({
        headerStyle: {
            backgroundColor: "#512DA8"
        },
        headerTitleStyle: {
            color: "#fff"
        },
        headerTintColor: "#fff"
    })
});

const ContactNavigator = createStackNavigator({
    Contact: { screen: Contact },

}, {
    navigationOptions: ({ navigation }) => ({
        headerStyle: {
            backgroundColor: "#512DA8"
        },
        headerTitleStyle: {
            color: "#fff"
        },
        headerTintColor: "#fff"
    })
})
const AboutComponent = createStackNavigator({
    AboutUs: { screen: AboutUs },

}, {
    navigationOptions: ({ navigation }) => ({
        headerStyle: {
            backgroundColor: "#512DA8"
        },
        headerTitleStyle: {
            color: "#fff"
        },
        headerTintColor: "#fff"
    })
})

const MainNavigator = createDrawerNavigator({
    Home:
    {
        screen: HomeNavigator,
        navigationOptions: {
            title: 'Home',
            drawerLabel: 'Home'
        }
    },
    About:
    {
        screen: AboutComponent,
        navigationOptions: {
            title: 'About Us',
            drawerLabel: 'About Us'
        }
    },
    Menu:
    {
        screen: MenuNavigator,
        navigationOptions: {
            title: 'Menu',
            drawerLabel: 'Menu'
        },
    },
    Contact:
    {
        screen: ContactNavigator,
        navigationOptions: {
            title: 'Contact Us',
            drawerLabel: 'Contact Us'
        }
    },

}, {
    drawerBackgroundColor: '#D1C4E9'
});



class Main extends Component {


    render() {
        return (
            <View style={{ flex: 1, paddingTop: Platform.OS === "android" ? 0 : ExpoStatusBar }}>
                <MainNavigator />
            </View>
        )
    }


}

export default Main;