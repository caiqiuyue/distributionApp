
import React, { Component } from 'react';
import {
    NetInfo, StyleSheet, Dimensions, Text, View, TouchableHighlight, AsyncStorage, Image, TextInput,
    Platform, Keyboard,ScrollView,
} from 'react-native';
import { Icon, InputItem,  WingBlank, Toast,Button } from 'antd-mobile';
import axios from 'axios'

import JPushModule from 'jpush-react-native'

import loginCss from './style/loginCss'

import lockIcon from './style/lockIcon.png'
import phoneIcon from './style/phoneIcon.png'
import eye_close from './style/eye_close.png'
import eye_open from './style/eye_open.png'
import bg from './style/bg.png'
import loginBg from './style/loginBg.png'
import LinearGradient from 'react-native-linear-gradient';
import selectIcon from '../../MyHome/HomePage/style/selectIcon.png'
import FindPassword from "./findPassword";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setRoleStr} from '../../components/active/reducer';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            password: '',
            phoneType: false,
            passwordType: false,
            url:"",
            passwordT:true,
            passwordFlag:false,
            registrationId:null,
            hei:0,
            codeData:{},
            code:null,
            role:[
                {
                    value:"我是买家",
                    flag:true
                },
                {
                    value:"我是卖家",
                    flag:false
                },


            ],

            roleStr:1
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
            hei:100,
        })


    }


    componentWillMount(){
        
        JPushModule.getRegistrationID(id =>{
            let registrationId = id;
            // alert(registrationId)
            this.setState({
                registrationId
            })
        });


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
    handlePhoneChange = (value) => {

        this.setState({
            phone: value,

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
                // Toast.info('联网状态异常',1)
            }
        });

        //监听网络变化事件
        NetInfo.addEventListener('connectionChange', (networkType) => {
            console.log(networkType,'networkType');

            if(networkType=='none'){

                Toast.info('暂无网络链接',1)
            }else if(networkType=='unknown'){
                // Toast.info('联网状态异常',1)
            }
        });

        const { roleStr,phone, password,url ,code,codeData} = this.state;
        // alert(this.state.registrationId)

        if(phone.trim()==''){
            Toast.info('账号不能为空',1);
            return
        }else if(password.trim()==''){
            Toast.info('密码不能为空',1);
            return
        }else if(!roleStr){
            Toast.info('请选择角色',1);
            return
        }else{
            const { navigate, Reset } = this.props.navigation;


            //这里发送Ajax
            axios.post(`${url}/user/login`, {
                loginId: this.state.phone,
                password: this.state.password,
                imgCode: 'houzi',
                // imgId: codeData.imgId,
                role: roleStr,
                registrationId:this.state.registrationId
            })
                .then((response)=> {
                    console.log(response);

                    if(response.data.code!=0){
                        Toast.info(response.data.message, 1);
                        this.setState({
                            code:null
                        })
                        this.changeCode()

                    } else {

                        this.props.setRoleStr(roleStr);

                        if(global.realname!=phone){
                            storage.remove({
                                key: 'goodsDatas'
                            });
                        }

                        let data = response.data.data;

                        let TOKEN = {
                            TOKEN:response.data.data.TOKEN
                        };



                        let username = data;
                        username.paySmsCodeFlag = false;
                        username.roleStr = roleStr;
                        // username.realname = phone;
                        // username.password = password;
                        global.roleStr = roleStr;
                        // global.realname = phone;
                        // global.password = password;



                        //设置storage
                        storage.save({
                            key: 'TOKEN',  // 注意:请不要在key中使用_下划线符号!
                            //data是你想要存储在本地的storage变量，这里的data只是一个示例。如果你想存一个叫item的对象，那么可以data: item，这样使用
                            data:TOKEN,
                            // 如果不指定过期时间，则会使用defaultExpires参数
                            // 如果设为null，则永不过期
                            expires: null
                        });

                        //设置storage
                        storage.save({
                            key: 'username',  // 注意:请不要在key中使用_下划线符号!
                            //data是你想要存储在本地的storage变量，这里的data只是一个示例。如果你想存一个叫item的对象，那么可以data: item，这样使用
                            data:username,
                            // 如果不指定过期时间，则会使用defaultExpires参数
                            // 如果设为null，则永不过期
                            expires: null
                        });



                        //跳转页面
                        navigate('Home',{ user: "" });

                        Reset();


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
                    roleStr:item.value=='我是买家'?1:2
                })
            }else {
                this.setState({
                    roleStr:null
                })
            }
        })

    }


    registered = ()=>{
        const { navigate } = this.props.navigation;
        navigate('Registered',{ user: "" });
    }
    forgetPassword = ()=>{
        const { navigate } = this.props.navigation;
        navigate('FindPassword',{ user: "" });
    }



    render() {
        const {role,codeData,hei,phone, password, phoneType, passwordType ,passwordT,passwordFlag} = this.state;
        return (


            <View style={{height: Dimensions.get('window').height,}}>

                <View style={{}}>
                    <Image
                        source={loginBg}
                        style={{height:(Dimensions.get('window').height),width: Dimensions.get('window').width, resizeMode:"stretch"}}
                        alt=""

                    />
                </View>



                <View  style={{width:"100%",zIndex:999,position:"absolute",top:50}}>

                    <View style={{flexDirection:"row",flexWrap:"wrap",marginLeft:30}}>

                        {
                            role.map((item,index)=>
                                <TouchableHighlight
                                    style={{borderColor:"#c3cbce",borderWidth:1,marginRight:15,padding:5,backgroundColor:item.flag ? "#f94939" :'#8b8a8a',}}
                                    onPress={()=>{this.role(item)}} key={index} underlayColor="transparent">
                                    <View style={{alignItems:"center"}}>
                                        <Text style={{color:"#fff"}}>{item.value}</Text>
                                    </View>
                                </TouchableHighlight>
                            )
                        }



                    </View>

                    <View  style={{marginTop:100,height:Dimensions.get('window').height/3-30}}>
                        <ScrollView style={{}}>
                            <View style={{alignItems:"center",paddingBottom:hei}}>

                                <View style={{width:"70%"}}>

                                    <View style={{backgroundColor:"#fff",padding:10,borderRadius:10,}}>

                                        {/*<Icon name="left" />*/}
                                        <View style={{flexDirection:"row",padding:5,borderBottomColor:"#d49a98",borderBottomWidth:2}}>
                                            <View style={{justifyContent:'center',}}><Image source={phoneIcon} style={styles.iconImg}/></View>
                                            <View style={{justifyContent:'center',alignItems:"center",marginLeft:3}}>
                                                <TextInput

                                                    placeholder="账号"
                                                    style={{minWidth:300,padding:5}}
                                                    onFocus={this.focus}
                                                    // value={phone}
                                                    autoCapitalize={'none'}
                                                    underlineColorAndroid="transparent"
                                                    onChangeText={(phone) => this.handlePhoneChange(phone)}
                                                >
                                                </TextInput>
                                            </View>

                                        </View>


                                        <View style={{marginTop:10,flexDirection:"row",padding:5,borderBottomColor:"#d49a98",borderBottomWidth:2}}>
                                            <View style={{justifyContent:'center',}}><Image source={lockIcon} style={styles.iconImg}/></View>
                                            <View style={{justifyContent:'center',marginLeft:3,flex:1}}>
                                                <TextInput
                                                    placeholder="请输入密码"
                                                    style={{minWidth:300,padding:5}}
                                                    secureTextEntry={passwordT?true:false}
                                                    underlineColorAndroid="transparent"
                                                    onFocus={this.focus}
                                                    autoCapitalize={'none'}
                                                    // value={password}
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
                                                {/*<View style={{justifyContent:'center',}}><Image source={lockIcon} style={styles.iconImg}/></View>*/}
                                                {/*<View style={{justifyContent:'center',marginLeft:3,flex:1}}>*/}
                                                    {/*<TextInput*/}
                                                        {/*placeholder="验证码"*/}
                                                        {/*style={{minWidth:100,padding:5}}*/}
                                                        {/*underlineColorAndroid="transparent"*/}
                                                        {/*onFocus={this.focus}*/}
                                                        {/*autoCapitalize={'none'}*/}
                                                        {/*onChangeText={(code) => this.setState({code})}*/}
                                                    {/*>*/}
                                                    {/*</TextInput>*/}
                                                {/*</View>*/}
                                            {/*</View>*/}

                                            {/*<TouchableHighlight style={{justifyContent:'center',flex:2,}} underlayColor="transparent" onPress={this.changeCode}>*/}
                                                {/*<Image style={{resizeMode:"stretch",width:'100%',height:40}} source={{uri:codeData.image}}/>*/}
                                            {/*</TouchableHighlight>*/}
                                        {/*</View>*/}

                                    </View>





                                </View>




                            </View>
                        </ScrollView>
                    </View>



                    <View style={{alignItems:"center",}}>

                        <View style={{width:"80%"}}>
                            <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,marginTop:20}}>
                                <TouchableHighlight
                                    style={{padding:10,alignItems:"center"}}
                                    underlayColor="transparent"
                                    onPress={this.handleSubmit}
                                >
                                    <Text style={{color:"#fff",fontSize:16,fontWeight:"bold"}}>登陆</Text>
                                </TouchableHighlight>
                            </LinearGradient>


                            <View  style={{marginTop:20,flexDirection:"row",justifyContent:"space-between"}}>
                                <TouchableHighlight
                                    style={{alignItems:"center"}}
                                    underlayColor="transparent"
                                    onPress={this.forgetPassword}
                                >
                                    <Text style={{color:"#f94939",fontSize:16,fontWeight:"bold"}}>忘记密码?</Text>
                                </TouchableHighlight>

                                <TouchableHighlight
                                    style={{alignItems:"center"}}
                                    underlayColor="transparent"
                                    onPress={()=>{this.registered()}}
                                >
                                    <Text style={{color:"#f94939",fontSize:16,fontWeight:"bold"}}>快速注册>></Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>


                </View>








            </View>


        );
    }
}

export default connect (
    state => ({reduxData: state.reduxData}),
    dispath => bindActionCreators({setRoleStr},dispath)
)(Login);
const styles = StyleSheet.create(loginCss);


