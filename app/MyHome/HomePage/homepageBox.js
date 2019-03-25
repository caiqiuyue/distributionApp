import React,{Component} from 'react';
import {View, Text,Platform} from 'react-native';
import HomePage1 from './buyers/homePage'
import HomePage2 from './seller/homePage'
import axios from "../../axios";
import {Toast} from "antd-mobile/lib/index";
import JPushModule from 'jpush-react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getData, setRoleStr} from '../../components/active/reducer';

class MineBox extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }


    getMyMsg = () => {
        axios.post(`/notice/getMessageList`, {
            current:1,
            pageSize:10
        })
            .then( (response)=> {
                let unread = [];

                unread = response.data.data.messageList&&response.data.data.messageList.filter(item=>{return item.status==0});
                this.props.getData(unread);
            })
            .catch(function (error) {
                console.log(error);
            })
    };

    componentWillMount() {
        this.getMyMsg();
        global.stopMsgTime = setInterval(this.getMyMsg, 300000);
        if(!this.props.reduxData.roleStr) {
            this.props.setRoleStr(global.roleStr);
        }
    }


    componentDidMount() {

        console.log('componentDidMount');

        const { navigate } = this.props.navigation;

        if(Platform.OS === 'android'){
            JPushModule.notifyJSDidLoad(resultCode=>console.log(resultCode))//报错
        }


        JPushModule.addReceiveCustomMsgListener((message) => {
            console.warn(message);
        });
        JPushModule.addReceiveNotificationListener((message) => {
            console.warn("receive notification: " + message);
        });

        JPushModule.addReceiveOpenNotificationListener((map) => {
            navigate('Message',{ user:"" })

        })
    }





    componentWillUnmount() {

        JPushModule.removeReceiveCustomMsgListener();

        JPushModule.removeReceiveNotificationListener();

    }



    render(){
        const {roleStr} = this.props.reduxData;
        return (
            <View style={{}}>
                {
                    roleStr == 1 ? (
                        <HomePage1   navigation={this.props.navigation}/>
                    ) : (
                        <HomePage2  navigation={this.props.navigation}/>
                    )
                }
            </View>
        )
    }
}



export default connect (
    state => ({reduxData: state.reduxData}),
    dispath => bindActionCreators({getData, setRoleStr},dispath)
)(MineBox);