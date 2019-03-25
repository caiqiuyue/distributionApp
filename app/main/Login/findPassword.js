
import React, { Component } from 'react';
import {
    StyleSheet, Dimensions, Text, View, TouchableHighlight,Image, TextInput,
    ScrollView,
} from 'react-native';
import {Toast } from 'antd-mobile';
import axios from 'axios'


import loginCss from './style/loginCss'

import lockIcon from './style/lockIcon.png'
import phoneIcon from './style/phoneIcon.png'
import eye_close from './style/eye_close.png'
import eye_open from './style/eye_open.png'
import companyPhone from './style/companyPhone.png'
import email from './style/email.png'
import yzm from './style/yzm.png'
import realName from './style/realName.png'
import bg from './style/bg.png'
import loginBg from './style/loginBg.png'

import LinearGradient from 'react-native-linear-gradient';

import selectIcon from '../../MyHome/HomePage/style/selectIcon.png'

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            smsId: '',
            phone: '',
            codeSMS: '',
            password: '',
            code:null,
            CountDown: false,
            CountDownNum: 60,
        };
    }


    //密码可见
    changePasswordType=()=>{
        let {passwordFlag} = this.state;
        this.setState({
            passwordFlag:!passwordFlag
        })

        if(!passwordFlag){
            this.setState({
                passwordT:false
            })

        }else {
            this.setState({
                passwordT:true
            })
        }
    };



    focus=()=>{

        this.setState({
            hei:200,
        })


    }


    //密码输入
    handlePasswordChange = (value) => {

        this.setState({
            password: value,

        });
    }

   

    //提交
    handleSubmit = () => {

        const { navigate} = this.props.navigation;

        const {phone,codeSMS, smsId, password,url ,} = this.state;

        let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");


        if(phone.trim()==''){
            Toast.info('手机号不能为空',1);
            return
        }else if(password.trim()==''){
            Toast.info('密码不能为空',1);
            return
        }else if(codeSMS.trim()==''){
            Toast.info('手机验证码不能为空',1);
            return
        }else{


            //这里发送Ajax
            axios.post(`${url}/user/register`, {
                phone: phone,
                smsCode: codeSMS,
                smsId: smsId,
                password: this.state.password,

            })
                .then(function (response) {
                    console.log(response);

                    if(response.data.code!=0){
                        Toast.info(response.data.message, 1);
                    } else {
                        Toast.info('注册成功', 1);
                        navigate('Login',{ user: '' });

                    }

                })
                .catch(function (error) {
                    console.log(error);
                });
        }

    };

     //获取验证码倒计时
    handleCountDown = () => {
        //发送请求，获取验证码
        let {phone,url,codeData,code} = this.state;
        if(phone.trim()==''){
            Toast.info('手机号不能为空',1);
            return;
        }

        if(phone.replace(/\s/g, '').length < 11 && phone.trim()!=''){
            Toast.info('手机号应为11位',1);
            return;
        }


        if(this.state.CountDown){
            return
        }

        axios.get(`${url}/user/getSMSCode`,

            {
                params:{
                    phone: this.state.phone,
                }
            }


        )
            .then( (response)=> {
                if(response.data.code == 0) {
                    //请求发送成功设置定时器
                    this.setState({
                        CountDown: true,
                        smsId:response.data.data.smsId
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
                    Toast.info(response.data.message, 1);
                }

            })
            .catch(function (error) {
                console.log(error);
            });
    };



    render() {
        const {gender,CountDown, CountDownNum,role,codeData,hei,userName, password, userNameType, passwordType ,passwordT,passwordFlag} = this.state;
        return (
            <View style={{height: Dimensions.get('window').height,}}>

                <View style={{}}>
                    <Image
                        source={loginBg}
                        style={{height:(Dimensions.get('window').height)-50,width: Dimensions.get('window').width, resizeMode:"stretch"}}
                        alt=""

                    />
                </View>



                <View style={{alignItems:"center",width:"100%",zIndex:999,position:"absolute",top:10}}>


                    <View  style={{marginTop:10,height:Dimensions.get('window').height-180}}>
                        <ScrollView style={{}}>
                            <View style={{alignItems:"center",paddingBottom:hei}}>
                                <View style={{marginTop:10,flexDirection:"row",padding:5,borderBottomColor:"#d49a98",borderBottomWidth:2}}>
                                    <View style={{justifyContent:'center',}}><Image source={phoneIcon} style={styles.iconImg}/></View>
                                    <View style={{justifyContent:'center',alignItems:"center",marginLeft:10}}>
                                        <TextInput

                                            placeholder="手机号"
                                            style={{minWidth:300,padding:5}}
                                            onFocus={this.focus}
                                            keyboardType='numeric'
                                            underlineColorAndroid="transparent"
                                            onChangeText={(phone) => this.setState({phone})}
                                        >
                                        </TextInput>
                                    </View>

                                </View>

                                <View style={{backgroundColor:"#fff",width:"80%",borderRadius:10}}>
                                    <View style={{padding:10,borderRadius:10,}}>
                                        <View style={{marginTop:10}}>
                                            <View style={{marginTop:10,flexDirection:"row",padding:5,borderBottomColor:"#d49a98",borderBottomWidth:2}}>
                                                <View style={{justifyContent:'center',}}><Image source={lockIcon} style={styles.iconImg}/></View>
                                                <View style={{justifyContent:'center',marginLeft:10,flex:1}}>
                                                    <TextInput
                                                        placeholder="请输入密码"
                                                        style={{minWidth:300,padding:5}}
                                                        secureTextEntry={passwordT?true:false}
                                                        underlineColorAndroid="transparent"
                                                        onFocus={this.focus}
                                                        onChangeText={(passwordType) => this.handlePasswordChange(passwordType)}
                                                    >
                                                    </TextInput>
                                                </View>

                                                <TouchableHighlight underlayColor="transparent" onPress={this.changePasswordType} style={{marginRight:20,justifyContent:"center"}}>
                                                    <View>
                                                        <Image source={passwordFlag ? eye_open : eye_close} style={styles.iconImg}/>
                                                    </View>
                                                </TouchableHighlight>

                                            </View>


                                            <View style={{marginTop:10,flexDirection:"row"}}>
                                                <View style={{flex:1,flexDirection:"row",padding:5,borderBottomColor:"#d49a98",borderBottomWidth:2}}>
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
                                                    <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5}}>
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


                                        </View>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </View>

                    <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,marginTop:20}}>
                        <TouchableHighlight
                            style={{padding:10,alignItems:"center",width:100}}
                            underlayColor="transparent"
                            onPress={this.handleSubmit}
                        >
                            <Text style={{color:"#fff",fontSize:16,fontWeight:"bold"}}>找回密码</Text>
                        </TouchableHighlight>
                    </LinearGradient>




                </View>



            </View>

        );
    }
}


const styles = StyleSheet.create(loginCss);