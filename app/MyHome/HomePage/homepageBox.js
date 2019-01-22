import React,{Component} from 'react';
import {View, Text,Dimensions} from 'react-native';
import HomePage1 from './buyers/homePage'
import HomePage2 from './seller/homePage'
import axios from "../../axios";
import {Toast} from "antd-mobile/lib/index";
// import Dimensions from 'Dimensions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getData} from '../../components/active/reducer';

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
    }
    


    render(){
        
        return (
            <View style={{}}>
                {
                    global.roleStr == 1 ? (
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
    dispath => bindActionCreators({getData},dispath)
)(MineBox);