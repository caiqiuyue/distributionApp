import React, { Component } from 'react'
import {TouchableHighlight,Image,StyleSheet, View, Text, TextInput} from 'react-native'
import {List, Icon, Toast, Modal, WhiteSpace, Button} from 'antd-mobile';

import right from "./style/right.png";
import wallet from './style/wallet.png'
import lockIcon from '../../main/Login/style/lockIcon.png'
import securityIcon from '../../main/Login/style/securityIcon.png'
import phoneIcon from '../../main/Login/style/phoneIcon.png'
import axios from "../../axios";
import LinearGradient from "react-native-linear-gradient";

export default class Security extends Component {
    static navigationOptions = {
        title: '安全管理',
    };
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            password: null,
            checkPassword: null,
            smsCode: null,
            phone: null,
            key: `${new Date()}-key`,
            CountDown: false,
            CountDownNum: 60,
        };
    }



    handleClick = () => {
        //发送请求，获取验证码
        if(this.state.CountDown){
            return
        }


        axios.get(`/user/getSMSCode`,

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

    handleShowMod = (value) => {
        this.type = value;
        this.setState({
            visible: true,
            key: `${new Date()}-key`
        });
    };

    handleOk = () => {
        console.log(this.type)
        let {smsCode, password, checkPassword, phone} = this.state;
        let data = null;

        if(this.type === 1 || this.type === 2) {
            if(!password) {
                alert('请输入密码')
                return;
            }

            if(password && password.length < 6) {
                alert('密码不得少于六位数')
                return;
            }
            if(!checkPassword || checkPassword !== password) {
                alert('确认密码与输入密码不一致')
                return;
            }
            if(!smsCode || smsCode.length !== 6) {
                alert('请输入正确的验证码')
                return;
            }


            axios.post(this.type === 1?`/user/editPassword`:`/account/setPayPassword`,{
                password,
                smsCode,

            },)
                .then((response) =>{
                    console.log(response);
                    this.handleClose();
                    Toast.info(response.data.code==0?`修改${this.type === 1?'账户密码':'支付密码'}成功`:response.data.message)

                })
                .catch(function (error) {
                    console.log(error);
                })

        } else {
            if(!phone || !(/^1[34578]\d{9}$/.test(phone))) {
                alert('请输入正确的手机号')
                return;
            }
            if(!smsCode || smsCode.length !== 6) {
                alert('请输入正确的验证码')
                return;
            }

            axios.post(`/user/editUserPhone`,{
                phone,
                smsCode,

            },)
                .then((response) =>{
                    console.log(response);
                    this.handleClose();
                    Toast.info(response.data.code==0?'修改手机号成功':response.data.message)

                })
                .catch(function (error) {
                    console.log(error);
                })

        }

        // 发送请求，请求成功后执行下方this.handleClose方法

    };

    handleClose = () => {
        this.setState({
            visible: false,
            password: null,
            checkPassword: null,
            smsCode: null,
            phone: null,
        });
    };

    render() {
        let {CountDown,CountDownNum,key, visible, smsCode, password, checkPassword, phone} = this.state;
        const footerButtons = [
            { text: <Text style={{color:"#f94939"}}>取消</Text>, onPress: this.handleClose },
            { text: <Text style={{color:"#f94939"}}>确认</Text>, onPress: this.handleOk },
        ];
        return (
            <View style={styles.box}>
                <Modal
                    key={key}
                    style={{width: '98%'}}
                    title={this.type == 1 ? '修改账号密码' : this.type == 2 ? '修改支付密码' : '修改密保手机'}
                    transparent
                    maskClosable
                    visible={visible}
                    footer={footerButtons}
                >
                    {
                        this.type == 3 ? (
                            <View>
                                <WhiteSpace size="xs" />
                                <View style={styles.a}>
                                    <Text style={styles.f}>新手机号码</Text>
                                    <View style={[styles.b,{flex:4}]}>
                                        <TextInput
                                            placeholder={'请输入手机号码'}
                                            keyboardType={'numeric'}
                                            autoFocus
                                            style={[styles.teCor, {borderColor: (phone === '' || phone && !(/^1[34578]\d{9}$/.test(phone))) ? '#f00' : '#ccc'}]}
                                            underlineColorAndroid="transparent"
                                            onChangeText={(value) => this.setState({phone: value})}
                                        />
                                    </View>
                                </View>
                                <WhiteSpace size="xs" />
                                <View style={styles.a}>
                                    <Text style={styles.f}>短信验证码</Text>
                                    <View style={[styles.b,{flex:4, flexDirection: 'row'}]}>
                                        <TextInput
                                            placeholder={'请输入验证码'}
                                            keyboardType={'numeric'}
                                            maxLength={6}
                                            style={[styles.code, {borderColor: (smsCode === '' || smsCode && smsCode.length !== 6) ? '#f00' : '#ccc'}]}
                                            underlineColorAndroid="transparent"
                                            onChangeText={(value) => this.setState({smsCode: value})}
                                        />
                                        <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,width:'50%',marginLeft:10,alignItems:"center",justifyContent:"center"}}>
                                            <TouchableHighlight
                                                style={{padding:5,alignItems:"center",justifyContent:"center"}}
                                                underlayColor="transparent"
                                                onPress={this.handleClick}
                                            >
                                                <Text style={{color:'#fff'}}>{CountDown ? `重新获取验证码${CountDownNum}S` : '获取验证码'}</Text>
                                            </TouchableHighlight>
                                        </LinearGradient>
                                    </View>
                                </View>
                            </View>
                        ) : (
                            <View>
                                <WhiteSpace size="xs" />
                                <View style={styles.a}>
                                    <Text style={styles.f}>设置新密码</Text>
                                    <View style={[styles.b,{flex:4}]}>
                                        <TextInput
                                            placeholder={'请输入密码'}
                                            keyboardType={this.type==1?'default':'numeric'}
                                            autoFocus
                                            secureTextEntry={true}
                                            maxLength={this.type==1?16:6}
                                            style={[styles.teCor, {borderColor: password === '' || password && password.length < 6 ? '#f00' : '#ccc'}]}
                                            underlineColorAndroid="transparent"
                                            onChangeText={(value) => this.setState({password: value})}
                                        />
                                    </View>
                                </View>
                                <WhiteSpace size="xs" />
                                <View style={styles.a}>
                                    <Text style={styles.f}>确认新密码</Text>
                                    <View style={[styles.b,{flex:4}]}>
                                        <TextInput
                                            placeholder={'请输入密码'}
                                            keyboardType={this.type==1?'default':'numeric'}
                                            maxLength={this.type==1?16:6}
                                            secureTextEntry={true}
                                            style={[styles.teCor, {borderColor: checkPassword === '' || checkPassword && password !== checkPassword ? '#f00' : '#ccc'}]}
                                            underlineColorAndroid="transparent"
                                            onChangeText={(value) => this.setState({checkPassword: value})}
                                        />
                                    </View>
                                </View>
                                <WhiteSpace size="xs" />
                                <View style={styles.a}>
                                    <Text style={styles.f}>短信验证码</Text>
                                    <View style={[styles.b,{flex:4, flexDirection: 'row'}]}>
                                        <TextInput
                                            placeholder={'请输入验证码'}
                                            keyboardType={'numeric'}
                                            maxLength={6}
                                            style={[styles.code, {borderColor: (smsCode === '' || smsCode && smsCode.length !== 6) ? '#f00' : '#ccc'}]}
                                            underlineColorAndroid="transparent"
                                            onChangeText={(value) => this.setState({smsCode: value})}
                                        />


                                        <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,width:'50%',marginLeft:10,alignItems:"center",justifyContent:"center"}}>
                                            <TouchableHighlight
                                                style={{padding:5,alignItems:"center",justifyContent:"center"}}
                                                underlayColor="transparent"
                                                onPress={this.handleClick}
                                            >
                                                <Text style={{color:'#fff'}}>{CountDown ? `重新获取验证码${CountDownNum}S` : '获取验证码'}</Text>
                                            </TouchableHighlight>
                                        </LinearGradient>


                                    </View>
                                </View>
                            </View>
                        )
                    }
                </Modal>
                <TouchableHighlight onPress={() => this.handleShowMod(1)}>
                    <View style={styles.aa}>
                        <View style={styles.imgView}><Image style={styles.img} source={lockIcon}/></View>
                        <Text>账户密码</Text>
                        <View  style={{flex:1,justifyContent:'flex-end'}}>
                            {/*<Text style={{textAlign:'right',color:"#ec833a"}}>{this.state.account?this.state.account.toFixed(2):'0.00'}元</Text>*/}
                        </View>

                        <View>
                            <Image style={styles.img2} source={right}/>
                        </View>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => this.handleShowMod(2)}>
                    <View style={styles.aa}>
                        <View style={styles.imgView}><Image style={styles.img} source={securityIcon}/></View>
                        <Text>支付密码</Text>
                        <View  style={{flex:1,justifyContent:'flex-end'}}>
                            {/*<Text style={{textAlign:'right',color:"#ec833a"}}>{this.state.account?this.state.account.toFixed(2):'0.00'}元</Text>*/}
                        </View>

                        <View>
                            <Image style={styles.img2} source={right}/>
                        </View>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight onPress={() => this.handleShowMod(3)}>
                    <View style={styles.aa}>
                        <View style={styles.imgView}><Image style={styles.img} source={phoneIcon}/></View>
                        <Text>密保手机</Text>
                        <View  style={{flex:1,justifyContent:'flex-end'}}>
                            {/*<Text style={{textAlign:'right',color:"#ec833a"}}>{this.state.account?this.state.account.toFixed(2):'0.00'}元</Text>*/}
                        </View>

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
  box: {
    backgroundColor:"#f5f6f7",
    paddingTop: 10,
  },
  listItem: {
    paddingTop: 6,
    paddingBottom: 6
  },
  teCor:{
    minWidth:'100%',
    padding:10,
    height: 46,
    borderRadius:5,
    borderColor:"#ccc",
    borderWidth:1
  },
  code:{
    width:'45%',
    padding:10,
    height: 46,
    borderRadius:5,
    borderColor:"#ccc",
    borderWidth:1
  },
  a:{
    flexDirection:"row",
    alignItems:"center",
    backgroundColor:"#fff",
    marginTop: 6
  },
  b:{
    marginLeft:10,
    flex:1,
  },
  f:{
    textAlign: 'right',
    flex:1,
    color:"#333"
  },
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
        borderBottomColor:"#a3b9ce",
        borderBottomWidth:1,
        flexDirection:"row",
        backgroundColor:"#fff",
        padding:15,
        // borderRadius:10,
        alignItems:"center"
    }

});

