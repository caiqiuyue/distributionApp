import React,{Component} from 'react';
import {View,DeviceEventEmitter, Text, TouchableHighlight, Image, ScrollView, StyleSheet,Platform} from 'react-native';

import Dimensions from "Dimensions";
import right from "./style/right.png";
import wallet from './style/wallet.png'
import mineTop from "./style/mineTop.png";
import setup from "./style/setup.png";
import user from "./style/user.png";
import {Toast} from "antd-mobile";

import LinearGradient from 'react-native-linear-gradient';
import axios from "../../axios";

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setRoleStr} from '../../components/active/reducer';

class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            userInfo:{},
            account:0
        }

    }

    //退出登陆
    logOut=()=>{

        storage.remove({
            key: 'TOKEN'
        });

        clearInterval(global.stopMsgTime);


        storage.remove({
            key: 'username'
        });

        const { navigate } = this.props.navigation;

        global.TOKEN='';

        navigate('Login',{ user: '' })
        global.roleStr = null;

    };

    //退出登陆
    yu_e=()=>{

        const { navigate } = this.props.navigation;
        navigate('Wallet',{ user: '' })


    };

    message=()=>{

        const { navigate } = this.props.navigation;
        navigate('UserMessage',{ user: '' })


    };

    security=()=>{

        const { navigate } = this.props.navigation;
        navigate('Security',{ user: '' })


    };


    componentWillMount() {
        axios.get(`/user/getUserInfo`,{},
        )
            .then((response) =>{
                console.log(response);

                if(response.data.code==0){
                    this.setState({
                        userInfo:response.data.data
                    })
                }else{
                    Toast.info(response.data.message,1)
                }

            })
            .catch(function (error) {
                console.log(error);
            })


        axios.get(`/account/getAccount`,{},
        )
            .then((response) =>{
                console.log(response);

                if(response.data.code==0){
                    this.setState({
                        account:response.data.data.balance
                    })
                }

            })
            .catch(function (error) {
                console.log(error);
            })
    }

    changeRole=()=>{
        let data = {
            isApp: 1,
            role: global.roleStr == 1 ? 2 : 1
        }
        axios.get(`/user/changeUserRole`,data,
        )
            .then((response) =>{
                console.log(response);

                if(response.data.code==0){
                    global.roleStr = data.role;
                    console.log('2313123213123123123',data.role);
                    Toast.info(`切换${data.role==1?'买家':'卖家'}成功`)
                    this.props.setRoleStr(data.role);
                    storage.load({ //读取tokenKey
                        key: 'username',
                        autoSync: false
                    }).then(ret => {
                        ret.roleStr = data.role;

                        storage.save({
                            key: 'username',  // 注意:请不要在key中使用_下划线符号!
                            //data是你想要存储在本地的storage变量，这里的data只是一个示例。如果你想存一个叫item的对象，那么可以data: item，这样使用
                            data:ret,
                            // 如果不指定过期时间，则会使用defaultExpires参数
                            // 如果设为null，则永不过期
                            expires: null
                        });
                    }).catch((error) => {
                    });
                }else {
                    Toast.info(response.data.message)
                }

            })
            .catch(function (error) {
                console.log(error);
            })
    }


    render(){
        const {roleStr} = this.props.reduxData;
        return (

            <View style={{height:Dimensions.get("window").height}}>

                <View>

                    <View>
                        <Image source={mineTop} style={{height:120,width:Dimensions.get('window').width,resizeMode:"stretch"}} />
                    </View>


                    <View style={{paddingBottom:5,flexDirection:"row",position:"absolute",zIndex:99,top:30}}>

                        <View style={{marginLeft:10,justifyContent:"center"}}>
                            <View style={{height:70,width:70,borderRadius:35,overflow:"hidden",alignItems:"center"}}>
                                <Image style={{height:70,width:70,}} source={{uri:this.state.userInfo.image}}/>
                            </View>
                        </View>

                        <View style={{flex:2,marginLeft:10,justifyContent:"center"}}>


                            <View  style={{flexDirection:"row",justifyContent:"space-between"}}>
                                <Text style={{marginRight:50}}>{this.state.userInfo.realName}</Text>
                                <TouchableHighlight underlayColor="transparent" onPress={this.changeRole}><Text style={{textDecorationLine:'underline'}}>切换到{roleStr == 1?'卖家':'买家'}</Text></TouchableHighlight>

                            </View>
                            <View style={{marginTop:10}}>
                                <Text style={{}}>{roleStr == 1?'我是买家':'我是卖家'}</Text>
                            </View>
                        </View>

                    </View>
                </View>


                <TouchableHighlight onPress={this.yu_e}>
                    <View style={styles.aa}>
                        <View style={styles.imgView}><Image style={styles.img} source={wallet}/></View>
                        <Text>账户余额</Text>
                        <View  style={{flex:1,justifyContent:'flex-end'}}>
                            {/*<Text style={{textAlign:'right',color:"#ec833a"}}>{this.state.account?this.state.account.toFixed(2):'0.00'}元</Text>*/}
                        </View>

                        <View>
                            <Image style={styles.img2} source={right}/>
                        </View>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={this.message}>
                    <View style={styles.aa}>
                        <View style={styles.imgView}><Image style={styles.img} source={user}/></View>
                        <Text>基本信息</Text>
                        <View  style={{flex:1,justifyContent:'flex-end'}}>
                            {/*<Text style={{textAlign:'right',color:"#ec833a"}}>{this.state.account?this.state.account.toFixed(2):'0.00'}元</Text>*/}
                        </View>

                        <View>
                            <Image style={styles.img2} source={right}/>
                        </View>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={this.security}>
                    <View style={styles.aa}>
                        <View style={styles.imgView}><Image style={styles.img} source={setup}/></View>
                        <Text>安全设置</Text>
                        <View  style={{flex:1,justifyContent:'flex-end'}}>
                            {/*<Text style={{textAlign:'right',color:"#ec833a"}}>{this.state.account?this.state.account.toFixed(2):'0.00'}元</Text>*/}
                        </View>

                        <View>
                            <Image style={styles.img2} source={right}/>
                        </View>
                    </View>
                </TouchableHighlight>

                <View style={{alignItems:"center",marginTop:30}}>
                    <LinearGradient colors={['#f96f59', '#f94939']} style={{width:'80%',borderRadius:5}}>
                        <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                            alignItems:"center"
                        }} onPress={this.logOut }>
                            <Text
                                style={{fontSize:16,textAlign:"center",color:"#fff"}}>
                                退出
                            </Text>
                        </TouchableHighlight>
                    </LinearGradient>
                </View>

            </View>

        )

    }
}

export default connect (
    state => ({reduxData: state.reduxData}),
    dispath => bindActionCreators({setRoleStr},dispath)
)(Mine);


const styles = StyleSheet.create({
    img: {
        height:16,
        width:16,
    },

    img2: {
        height:12,
        width:12
    },

    img3: {
        height:20,
        width:20
    },

    imgView:{
        marginRight:10,

        width:21,
        alignItems:'center'

    },

    aa:{
        borderBottomColor:"#ffdac7",
        borderBottomWidth:1,
        flexDirection:"row",
        backgroundColor:"#fff",
        padding:15,
        // borderRadius:10,
        alignItems:"center"
    }


});
