import React,{Component} from 'react';
import {
    View, Text, TouchableHighlight, Image, ScrollView, StyleSheet, Platform, Modal, Alert,
    DeviceEventEmitter,TextInput
} from 'react-native';
import Dimensions from 'Dimensions';
import right from './style/right.png'
import topUp from './style/topUp.png'
import close from '../HomePage/style/close.png'
import withdrawal from './style/withdrawal.png'
import axios from "../../axios";
import {Toast} from "antd-mobile";
import moment from "moment/moment";
import LinearGradient from 'react-native-linear-gradient';
import WalletDetail from "./walletDetail";


export default class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            data:{},
            animationType: 'none',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示
            CountDown: false,
            CountDownNum: 60,
            payPassword:null,
            codeSMS:null,
        }

    }



    componentWillMount(){

        axios.get(`/account/getAccount`,{},
        )
            .then((response) =>{
                console.log(response);
                if(response.data.code==0){
                    this.setState({
                        data:response.data.data
                    })
                }

            })
            .catch(function (error) {
                console.log(error);
            })

    }

    _setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    };






    cancelSelected = ()=>{}


    comfirmSelected = ()=>{
        this.setState({
            modalVisible:true
        })
    };

    notInit = (item) => {

        const { navigate } = this.props.navigation;

        if(this.state.data.notInit){
            Alert.alert('您还未设置支付密码','请先设置支付密码',
                [
                    {text:"取消", onPress:this.cancelSelected},
                    {text:"确认", onPress:this.comfirmSelected}
                ],
                { cancelable: false }
            );
        }else{


            switch (item)
            {
                case 'topUp':
                    navigate('TopUp',{ user: '' });
                    break;
                case 'withdrawal':
                    navigate('Withdrawal',{ user: "" });

                    break;

                default:
                    navigate('WalletDetail',{ user: "" });

            }

        }
    }


    //充值
    topUp=()=>{
        this.notInit('topUp')

    };


    //提现
    withdrawal=()=>{

        this.notInit('withdrawal')
    };

    //明细
    detail=()=>{

        this.notInit('detail')

    };


    //获取验证码倒计时
    handleCountDown = () => {
        //发送请求，获取验证码

        if(this.state.CountDown){
            return
        }
        axios.get(`/user/getSMSCode`,{}


        )
            .then( (response)=> {
                console.log(response);
                console.log(response.data.code)
                if(response.data.code == 0) {
                    //请求发送成功设置定时器
                    this.setState({
                        CountDown: true,
                    }, () => {
                        let CountDownTimer =  setInterval(() => {
                            let { CountDownNum } = this.state;
                            let CountDown = true;

                            CountDownNum --;

                            if(CountDownNum === 0) {
                                CountDown = false;
                                CountDownNum = 60;
                                //清楚定时器
                                clearInterval(CountDownTimer);
                            }

                            this.setState({
                                CountDown,
                                CountDownNum
                            });
                        }, 1000)
                    });
                } else {
                    alert(response.data.message);
                }

            })
            .catch(function (error) {
                console.log(error);
            });
    };


    //确定设置支付密码
    setPayPassword=()=>{
        let {payPassword,codeSMS} = this.state;

        if(!payPassword){
            alert('请输入支付密码');
            return
        }

        if(payPassword.replace(/\s/g, '').length < 6 && payPassword.replace(/\s/g, '').length > 1){
            alert('请输入6位数字支付密码');
            return
        }

        if(!codeSMS){
            alert('请输入验证码');
            return
        }


        axios.post(`/account/setPayPassword`,{
            password:payPassword,
            smsCode:codeSMS,
            },
        )
            .then((response) =>{
                console.log(response);
                alert(response.data.code==0?'设置成功':response.data.message)

            })
            .catch(function (error) {
                console.log(error);
            })



    }


    render(){

        let {data,CountDown,CountDownNum} =this.state;

        let modalBackgroundStyle = {
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
        };
        let innerContainerTransparentStyle = this.state.transparent
            ? { backgroundColor: '#fff', padding: 10 ,
                // height:"90%",
                overflow:"hidden"}
            : null;


        return (



                <View style={{height:Dimensions.get("window").height,backgroundColor:"#fff",padding:10,}}>


                    <View>

                        <Modal
                            animationType={this.state.animationType}
                            transparent={this.state.transparent}
                            visible={this.state.modalVisible}

                            onRequestClose={() => { this._setModalVisible(false) } }

                        >
                            <View style={[styles.container,modalBackgroundStyle]}>
                                <View style={[styles.innerContainer,innerContainerTransparentStyle]}>


                                    {
                                        <View>
                                            <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>

                                                <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}>设置支付密码</Text></View>



                                                <TouchableHighlight underlayColor={"#fff"} onPress={this._setModalVisible.bind(this,false) } style={{}}>
                                                    <Image style={{height:30,width:30}} source={close}/>
                                                </TouchableHighlight>

                                            </View>


                                            <ScrollView style={{maxHeight:Dimensions.get('window').height-200}}>

                                                <View style={{marginTop:30,flexDirection:"row",padding:5,borderColor:"#f0f0f0",borderWidth:1,borderRadius:10,backgroundColor:"#f0f0f0"}}>
                                                    <View style={{justifyContent:'center',marginLeft:10,flex:1}}>
                                                        <TextInput
                                                            placeholder="请输入密码"
                                                            style={{minWidth:300,padding:5}}
                                                            secureTextEntry={true}
                                                            keyboardType='numeric'
                                                            maxLength={6}
                                                            underlineColorAndroid="transparent"
                                                            // onFocus={this.focus}
                                                            onChangeText={(payPassword) => this.setState({payPassword})}
                                                        >
                                                        </TextInput>
                                                    </View>

                                                </View>

                                                <View style={{marginTop:10,flexDirection:"row"}}>
                                                    <View style={{flex:1,flexDirection:"row",padding:5,borderColor:"#f0f0f0",borderWidth:1,borderRadius:10,backgroundColor:"#f0f0f0"}}>
                                                        <View style={{justifyContent:'center',marginLeft:15,flex:2}}>
                                                            <TextInput
                                                                placeholder="短信验证码"
                                                                style={{minWidth:80,padding:5}}
                                                                keyboardType='numeric'
                                                                maxLength={6}
                                                                underlineColorAndroid="transparent"
                                                                onChangeText={(codeSMS) => this.setState({codeSMS})}
                                                                onFocus={this.focus}

                                                            >
                                                            </TextInput>
                                                        </View>
                                                    </View>


                                                    <View  style={{justifyContent:'center',flex:1,}}>
                                                        <LinearGradient colors={['#00adfb', '#00618e']} style={{borderRadius:5}}>
                                                            <TouchableHighlight
                                                                style={{padding:5,alignItems:"center"}}
                                                                underlayColor="transparent"
                                                                onPress={this.handleCountDown}
                                                            >
                                                                <Text style={{color:'#fff'}}>{CountDown ? `重新获取验证码${CountDownNum}S` : '获取验证码'}</Text>
                                                            </TouchableHighlight>
                                                        </LinearGradient>
                                                    </View>



                                                </View>

                                                <View style={{alignItems:"center",marginTop:10}}>
                                                    <LinearGradient colors={['#00adfb', '#00618e']} style={{width:100,borderRadius:5}}>
                                                        <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                                            alignItems:"center"
                                                        }} onPress={this.setPayPassword }>
                                                            <Text
                                                                style={{fontSize:16,textAlign:"center",color:"#fff"}}>
                                                                确定
                                                            </Text>
                                                        </TouchableHighlight>
                                                    </LinearGradient>
                                                </View>



                                            </ScrollView>
                                        </View>

                                    }


                                </View>
                            </View>
                        </Modal>



                    </View>

                    <View style={{flexDirection:"row",justifyContent:"space-between",padding:10,backgroundColor:"#f0f0f0"}}>
                        <View>
                            <Text>余额账户（元）</Text>
                            <Text style={{fontSize:35,marginTop:5,color:"#f1803a",fontWeight:'bold'}}>{data.balance?data.balance.toFixed(2):'0.00'}</Text>
                        </View>
                        <TouchableHighlight onPress={this.detail} underlayColor="transparent" style={{marginRight:10}}>
                            <Text>明细</Text>
                        </TouchableHighlight>
                    </View>


                    <TouchableHighlight onPress={this.topUp} underlayColor="#f0f0f0">
                        <View style={styles.aa}>
                            <View style={styles.imgView}><Image style={styles.img} source={topUp}/></View>
                            <Text>充值</Text>
                            <View style={{flex:1}}></View>
                            <View>
                                <Image style={styles.img2} source={right}/>
                            </View>
                        </View>
                    </TouchableHighlight>

                    <TouchableHighlight onPress={this.withdrawal} underlayColor="#f0f0f0">
                        <View style={styles.aa}>
                            <View style={styles.imgView}><Image style={styles.img3} source={withdrawal}/></View>
                            <Text>提现</Text>
                            <View style={{flex:1}}></View>
                            <View>
                                <Image style={styles.img2} source={right}/>
                            </View>
                        </View>
                    </TouchableHighlight>

                </View>



        )

    }
}

const styles = StyleSheet.create({
    img: {
        height:20,
        width:20,
    },

    img2: {
        height:16,
        width:16
    },

    img3: {
        height:22,
        width:22
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,

    },
    innerContainer: {
        borderRadius: 10,
    },

    imgView:{
        marginRight:10,
        width:21,
        alignItems:'center'

    },

    a:{
        flexDirection:"row",alignItems:"center",marginTop:10
    },

    b:{
        marginLeft:10,flex:1,
    },

    aa:{
        borderBottomColor:"#f0f0f0",
        borderBottomWidth:3,
        flexDirection:"row",
        backgroundColor:"#fff",
        padding:10,paddingTop:15,
        paddingBottom:15,
        // borderRadius:10,
        alignItems:"center"
    }


});



