
import React, { Component } from 'react';
import {
    StyleSheet, Dimensions, Text, View, TouchableHighlight,Image, TextInput,
    ScrollView,NetInfo
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
            userName: '',
            realName: '',
            companyPhone: '',
            smsId: '',
            email: '',
            phone: '',
            codeSMS: '',
            password: '',
            userNameType: false,
            passwordType: false,
            url:"",
            passwordT:true,
            passwordFlag:false,
            registrationId:null,
            hei:0,
            codeData:{},
            code:null,
            CountDown: false,
            CountDownNum: 60,
            role:[
                {
                    value:"我是买家",
                    flag:false
                },
                {
                    value:"我是卖家",
                    flag:false
                },

                {
                    value:"两者都是",
                    flag:false
                },


            ],


            gender:[
                {
                    value:"男",
                    flag:true
                },
                {
                    value:"女",
                    flag:false
                }


            ],

            sex:1,

            roleStr:null
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


    componentWillMount(){

        // 读取
        storage.load({
            key: 'url',
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: false
        }).then(ret => {
            this.setState({
                url:ret.url
            },()=>{
                //这里发送Ajax
                axios.get(`${this.state.url}/user/getImageCode`, {
                })
                    .then( (response)=> {
                        console.log(response,'验证码');
                        if(response.data.code==0){
                            this.setState({
                                codeData:response.data.data
                            })
                        }

                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            })
        }).catch(err => {
            //如果没有找到数据且没有sync方法，
            //或者有其他异常，则在catch中返回
            console.warn(err.message);
            switch (err.name) {
                case 'NotFoundError':
                    break;
                case 'ExpiredError':
                    break;
            }
        });
    }


    //切换验证码
    changeCode = ()=>{
        axios.get(`${this.state.url}/user/getImageCode`, {
        })
            .then( (response)=> {
                console.log(response,'验证码');
                if(response.data.code==0){
                    this.setState({
                        codeData:response.data.data
                    })
                }

            })
            .catch(function (error) {
                console.log(error);
            });
    }




    //账号输入
    handleuserNameChange = (value) => {

        this.setState({
            userName: value,

        });
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

        const {phone,codeSMS, roleStr,userName,realName, password,url ,code,codeData} = this.state;


        const reg = /^[\w_-]{6,16}$/

        if(userName.trim()==''){
            Toast.info('用户名不能为空',1);
            return
        }else if(password.trim()==''){
            Toast.info('密码不能为空',1);
            return
        }else if(!reg.test(password)){
            Toast.info('密码至少为六位，不能包含特殊字符',1);
            return
        }else if(phone.trim()==''){
            Toast.info('手机号不能为空',1);
            return
        }else if(codeSMS.trim()==''){
            Toast.info('手机验证码不能为空',1);
            return
        }else if(realName.trim()==''){
            Toast.info('真实姓名不能为空',1);
            return
        }else if(!roleStr){
            Toast.info('请选择角色',1);
            return
        }else{


            //这里发送Ajax
            axios.post(`${url}/user/register`, {
                phone: phone,
                smsCode: codeSMS,
                smsId: this.state.smsId,
                loginId: this.state.userName,
                password: this.state.password,
                realName: this.state.realName,
                storeLink: this.state.companyPhone,
                sex: this.state.sex,
                role: this.state.roleStr,
                email: this.state.email,
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


    role=(item)=>{

        let {role} = this.state;

        role.map((_item)=>{
            if(_item.value==item.value){
                _item.flag=!item.flag;
            }else {
                _item.flag = false
            }

        })

        this.setState({
            role
        },()=>{
            if(item.flag){
                this.setState({
                    roleStr:item.value=='我是买家'?1:item.value=='我是卖家'?2:3
                })
            }else {
                this.setState({
                    roleStr:null
                })
            }
        })

    }


    gender=(item)=>{

        let {gender} = this.state;

        gender.map((_item)=>{
            if(_item.value==item.value){
                _item.flag=!item.flag;
            }else {
                _item.flag = false
            }

        })

        this.setState({
            gender
        },()=>{
            if(item.flag){
                this.setState({
                    sex:item.value=='男'?1:0
                })
            }else {
                this.setState({
                    sex:null
                })
            }
        })

    }

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


        // if(!code){
        //     Toast.info('图形验证码不能为空',1);
        //     return;
        // }


        if(this.state.CountDown){
            return
        }

        //检测网络是否连接
        NetInfo.isConnected.fetch().done((isConnected) => {
            console.log(isConnected,'isConnected');
        });

        //检测网络连接信息
        NetInfo.getConnectionInfo().done((connectionInfo) => {
            console.log(connectionInfo,'connectionInfo');
            if(connectionInfo.type=='none'){

                Toast.info('暂无网络链接',1)
            }else if(connectionInfo.type=='unknown'){
                Toast.info('联网状态异常',1)
            }
        });

        //监听网络变化事件
        NetInfo.addEventListener('connectionChange', (networkType) => {
            console.log(networkType,'networkType');

            if(networkType=='none'){

                Toast.info('暂无网络链接',1)
            }else if(networkType=='unknown'){
                Toast.info('联网状态异常',1)
            }
        });


        axios.get(`${url}/user/getSMSCode`,

            {
                params:{
                    phone: this.state.phone,
                    imgCode: 'houzi',
                    // imgId: codeData.imgId,

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

                                <View style={{backgroundColor:"#fff",width:"80%",borderRadius:10}}>
                                    <View style={{padding:10,borderRadius:10,}}>
                                        <View style={{marginTop:10}}>


                                            <View style={{flexDirection:"row",flexWrap:"wrap",marginBottom:10,justifyContent:"space-around"}}>

                                                {
                                                    role.map((item,index)=>
                                                        <TouchableHighlight
                                                            onPress={()=>{this.role(item)}} key={index} underlayColor="transparent">
                                                            <View style={{flexDirection:"row",marginRight:5,alignItems:"center"}}>
                                                                <View style={{backgroundColor:item.flag ? "#f94939" :'#fff',marginRight:5,
                                                                    width:20,height:20,borderRadius:10,borderColor:"#c3cbce",borderWidth:1,overflow:"hidden"}} >
                                                                    <Image style={{width:20,height:20}} source={selectIcon}/>
                                                                </View>
                                                                <Text>{item.value}</Text>

                                                            </View>
                                                        </TouchableHighlight>
                                                    )
                                                }



                                            </View>

                                            <View style={{flexDirection:"row",padding:5,borderBottomColor:"#d49a98",borderBottomWidth:2}}>
                                                <View style={{justifyContent:'center',}}><Image source={phoneIcon} style={styles.iconImg}/></View>
                                                <View style={{justifyContent:'center',alignItems:"center",marginLeft:10}}>
                                                    <TextInput

                                                        placeholder="请输入用户名"
                                                        style={{minWidth:300,padding:5}}
                                                        onFocus={this.focus}
                                                        autoCapitalize={'none'}
                                                        underlineColorAndroid="transparent"
                                                        onChangeText={(userName) => this.handleuserNameChange(userName)}
                                                    >
                                                    </TextInput>
                                                </View>

                                            </View>


                                            <View style={{marginTop:10,flexDirection:"row",padding:5,borderBottomColor:"#d49a98",borderBottomWidth:2}}>
                                                <View style={{justifyContent:'center',}}><Image source={lockIcon} style={styles.iconImg}/></View>
                                                <View style={{justifyContent:'center',marginLeft:10,flex:1}}>
                                                    <TextInput
                                                        placeholder="请输入密码"
                                                        style={{minWidth:300,padding:5}}
                                                        secureTextEntry={passwordT?true:false}
                                                        underlineColorAndroid="transparent"
                                                        autoCapitalize={'none'}
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


                                            {/*<View style={{marginTop:10,flexDirection:"row"}}>*/}
                                                {/*<View style={{flex:3,flexDirection:"row",padding:5,borderBottomColor:"#d49a98",borderBottomWidth:2}}>*/}
                                                    {/*<View style={{justifyContent:'center',}}><Image source={yzm} style={styles.iconImg}/></View>*/}
                                                    {/*<View style={{justifyContent:'center',marginLeft:10,flex:1}}>*/}
                                                        {/*<TextInput*/}
                                                            {/*placeholder="请输入验证码"*/}
                                                            {/*style={{minWidth:100,padding:5}}*/}
                                                            {/*underlineColorAndroid="transparent"*/}
                                                            {/*autoCapitalize={'none'}*/}
                                                            {/*onFocus={this.focus}*/}
                                                            {/*onChangeText={(code) => this.setState({code})}*/}
                                                        {/*>*/}
                                                        {/*</TextInput>*/}
                                                    {/*</View>*/}
                                                {/*</View>*/}

                                                {/*<TouchableHighlight style={{justifyContent:'center',flex:2,}} underlayColor="transparent" onPress={this.changeCode}>*/}
                                                    {/*<Image style={{resizeMode:"stretch",width:'100%',height:30}} source={{uri:codeData.image}}/>*/}
                                                {/*</TouchableHighlight>*/}
                                            {/*</View>*/}


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


                                            <View style={{marginTop:10,flexDirection:"row",padding:5,borderBottomColor:"#d49a98",borderBottomWidth:2}}>
                                                <View style={{justifyContent:'center',}}><Image source={realName} style={styles.iconImg}/></View>
                                                <View style={{justifyContent:'center',alignItems:"center",marginLeft:10}}>
                                                    <TextInput
                                                        placeholder="请输入真实姓名"
                                                        style={{minWidth:300,padding:5}}
                                                        onFocus={this.focus}
                                                        underlineColorAndroid="transparent"
                                                        autoCapitalize={'none'}
                                                        onChangeText={(realName) => this.setState({realName})}
                                                    >
                                                    </TextInput>
                                                </View>

                                            </View>

                                            <View style={{marginTop:10,flexDirection:"row",padding:5,borderBottomColor:"#d49a98",borderBottomWidth:2}}>
                                                <View style={{justifyContent:'center',}}><Image source={companyPhone} style={styles.iconImg}/></View>
                                                <View style={{justifyContent:'center',alignItems:"center",marginLeft:10}}>
                                                    <TextInput
                                                        placeholder="请输入店铺链接"
                                                        style={{minWidth:300,padding:5}}
                                                        onFocus={this.focus}

                                                        underlineColorAndroid="transparent"
                                                        onChangeText={(companyPhone) => this.setState({companyPhone})}
                                                    >
                                                    </TextInput>
                                                </View>

                                            </View>

                                            <View style={{marginTop:10,flexDirection:"row",padding:5,borderBottomColor:"#d49a98",borderBottomWidth:2}}>
                                                <View style={{justifyContent:'center',}}><Image source={email} style={styles.iconImg}/></View>
                                                <View style={{justifyContent:'center',alignItems:"center",marginLeft:10}}>
                                                    <TextInput
                                                        placeholder="请输入邮箱地址"
                                                        style={{minWidth:300,padding:5}}
                                                        onFocus={this.focus}
                                                        underlineColorAndroid="transparent"
                                                        onChangeText={(email) => this.setState({email})}
                                                    >
                                                    </TextInput>
                                                </View>

                                            </View>

                                            <View style={{flexDirection:"row",flexWrap:"wrap",marginTop:10,justifyContent:"space-around"}}>

                                                {
                                                    gender.map((item,index)=>
                                                        <TouchableHighlight
                                                            onPress={()=>{this.gender(item)}} key={index} underlayColor="transparent">
                                                            <View style={{flexDirection:"row",marginRight:5,alignItems:"center"}}>
                                                                <View style={{backgroundColor:item.flag ? "#f94939" :'#fff',marginRight:5,
                                                                    width:20,height:20,borderRadius:10,borderColor:"#ccc",borderWidth:1,overflow:"hidden"}} >
                                                                    <Image style={{width:20,height:20}} source={selectIcon}/>
                                                                </View>
                                                                <Text>{item.value}</Text>

                                                            </View>
                                                        </TouchableHighlight>
                                                    )
                                                }



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
                            <Text style={{color:"#fff",fontSize:16,fontWeight:"bold"}}>注册</Text>
                        </TouchableHighlight>
                    </LinearGradient>




                </View>



            </View>

        );
    }
}


const styles = StyleSheet.create(loginCss);