import { StackNavigator, SwitchNavigator } from 'react-navigation';
import WelcomePage from './main/WelcomePage';
import Home from './main/Tab/tab';
import Login from './main/Login/Login';
import Registered from './main/Login/registered';
import FindPassword from './main/Login/findPassword';
import Wallet from './MyHome/Mine/wallet';
import TopUp from './MyHome/Mine/topUp';
import Withdrawal from './MyHome/Mine/withdrawal';
import WalletDetail from './MyHome/Mine/walletDetail';
import UserMessage from './MyHome/Mine/Message';
import Security from './MyHome/Mine/Security';
import Pay from './MyHome/HomePage/buyers/pay';




const SimpleApp = StackNavigator({

    TopUp:{
        screen: TopUp,
        navigationOptions: {
            headerTitle:'充值',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f94939'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    UserMessage:{
        screen: UserMessage,
        navigationOptions: {
            headerTitle:'基本信息',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f94939'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    Security:{
        screen: Security,
        navigationOptions: {
            headerTitle:'安全设置',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f94939'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    Pay:{
        screen: Pay,
        navigationOptions: {
            headerTitle:'确认支付',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f94939'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    WalletDetail:{
        screen: WalletDetail,
        navigationOptions: {
            headerTitle:'明细',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f94939'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    Withdrawal:{
        screen: Withdrawal,
        navigationOptions: {
            headerTitle:'提现',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f94939'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },

    Wallet:{
        screen: Wallet,
        navigationOptions: {
            headerTitle:'账户余额',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f94939'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },

    Home: {
        screen: Home,
        navigationOptions: {
            header: null,
        }
    },

},{
    initialRouteName: 'Home'
});

const WelcomeHome = StackNavigator({
    WelcomePage:{
        screen: WelcomePage,
        navigationOptions: {
            header: null,
        }
    }
});

const LoginHome = StackNavigator({
    Login:{
        screen: Login,
        navigationOptions: {
            header: null,
        }
    },

    Registered:{
        screen: Registered,
        navigationOptions: {
            headerTitle:'注册',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f94939'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    FindPassword:{
        screen: FindPassword,
        navigationOptions: {
            headerTitle:'找回密码',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f94939'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },

});


export default SwitchNavigator(
    {
        WelcomeHome: WelcomeHome,
        SimpleApp: SimpleApp,
        LoginHome: LoginHome
    },
    {
        initialRouteName: 'WelcomeHome',
    }
);
