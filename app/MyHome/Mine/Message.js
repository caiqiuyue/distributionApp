import React, { Component } from 'react'
import {StyleSheet, View, TouchableHighlight, TouchableOpacity, Text, TextInput, Image, Dimensions} from 'react-native'
import { WhiteSpace, WingBlank, Checkbox, DatePicker, List, Icon, Toast, Modal } from 'antd-mobile';
import ImagePicker from 'react-native-image-picker';
import axios from "../../axios";
import moment from "moment";
import LinearGradient from "react-native-linear-gradient";
import s1 from "../../MyHome/HomePage/style/234.png";
import selectIcon from '../../MyHome/HomePage/style/selectIcon.png'
const RoomInfo = props => {
    return (
        <TouchableHighlight style={{}} underlayColor="transparent" onPress={props.onClick}>

            <View style={{backgroundColor:"#fff",flexDirection:"row",width:"100%",borderColor:"#ccc",borderWidth:1,borderRadius:5,overflow:'hidden'}}>
                <View style={{flex:3,padding:8}}><Text style={{color:"grey"}}>{props.extra}</Text></View>
                <View style={{flex:1,padding:8,backgroundColor:'#ccc',alignItems:"center",justifyContent:"center",borderColor:"#ccc",borderWidth:1,}}><Image style={{height:10,width:15}} source={s1}/></View>
            </View>
        </TouchableHighlight>
    )
};
uploadImage = (imgAry) => {

    let file = {}
    let files = []

    if(Array.isArray(imgAry)) {
        for(let i = 0; i < imgAry.length; i ++){
            //截取获取文件名
            let a = imgAry[i].uri;
            let arr = a.split('/');
            // 获取文件名end
            // 判断文件的类型(视频-图片等)end
            file = {uri: imgAry[i], type: imgAry[i].mime, name: arr[arr.length-1]}; //这里的key(uri和type和name)不能改变,
            //这里的files就是后台需要的key

            files.push(file)


        }


    } else {
        //截取获取文件名
        let a = imgAry[i].uri;
        let arr = a.split('/');
        // 获取文件名end
        // 判断文件的类型(视频-图片等)end
        file = {uri: imgAry[i], type: imgAry[i].mime, name: arr[arr.length-1]}; //这里的key(uri和type和name)不能改变,

        files.push(file)
        // console.log('file222', file);

        //这里的files就是后台需要的key
    }


    return files


}

export default class Message extends Component {
    static navigationOptions = {
        title: '基本信息',
    };
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            birthday: new Date(),
            email: "",
            loginId: "",
            storeLink: "",
            phone: "",
            realName: "",
            registrationId: null,
            resume: "",
            role: 1,
            sex: 1,
            image: '',
            roleData:[
                {
                    value:"我是买家",
                    flag:false,
                    role:1,
                    disable: false
                },
                {
                    value:"我是卖家",
                    flag:false,
                    role:2,
                    disable: false
                },


            ],
        };
    }

    componentWillMount() {

        let {roleData} = this.state;


        axios.get(`/user/getUserInfo`,

        )
            .then((res) =>{
                console.log(res);
                if(res.data.code==0){
                    let data = res.data.data

                    roleData.map(item=>{
                        if(data.role==item.role){
                            item.flag=true;
                            item.disable = true;
                        }else if(data.role==3){
                            item.flag=true;
                            item.disable = true;
                        }
                    })

                    this.setState({
                        birthday: data.birthday?new Date(moment(data.birthday)):null,
                        email: data.email,
                        loginId: data.email,
                        storeLink: data.storeLink,
                        phone: data.phone,
                        realName: data.realName,
                        resume: data.resume,
                        role: data.role,
                        sex: data.sex,
                        image: data.image,roleData

                    })

                }else {
                    Toast.info(res.data.message,1)
                }

            })
            .catch(function (error) {
                console.log(error);
            })

    }

    handleChangeEmail = (value, type) => {
        if(!type) {
            this.setState({email: value})
        } else {
            let {email} = this.state;
            console.log(email)
        }
    };

    handleChangeName = (value, type) => {
        if(!type) {
            this.setState({realName: value});
        } else {
            let {realName} = this.state;
            console.log(realName)
        }
    };

    handleChangeRole = (value) => {
        this.role = value;
        this.setState({visible: true});
    };

    handleDateChange = value => {
        this.setState({birthday: value});
    };

    handleChangeAllText = (value, type) => {
        if(!type) {
            this.setState({resume: value});
        } else {
            let {resume} = this.state;
            console.log(resume)
        }
    };

    setRole = () => {
        let {role} = this.state;
        this.setState({role: (role == 1 || role == 2) ? 3 : this.role, visible: false});
    };

    handleClose = () => {
        this.setState({visible: false});
    };

    //选择图片
    selectPhotoTapped = () => {
        const options = {
            title: '选择图片',
            cancelButtonTitle: '取消',
            takePhotoButtonTitle: '拍照',
            chooseFromLibraryButtonTitle: '选择照片',
            cameraType: 'back',
            mediaType: 'photo',
            videoQuality: 'high',
            durationLimit: 10,
            maxWidth: 600,
            maxHeight: 400,
            multiple:true,
            quality: 1,
            angle: 0,
            allowsEditing: false,
            noData: false,
            storageOptions: {
                skipBackup: true
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);


            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {

                let aaa = [
                    {uri:response.uri}
                ]


                console.log(uploadImage(aaa),'uploadImage(aaa)uploadImage(aaa)');

                let data = new FormData();
                data.append('file',uploadImage(aaa)[0])

                console.log(data);



                this.uploadHeadIcon(data)





            }
        });
    };

    //上传头像
    uploadHeadIcon=(data)=>{
        axios.post(`/user/uploadHeadIcon`,data,

        )
            .then((res) =>{
                console.log(res);
                if(res.data.code==0){
                    this.setState({
                        image:res.data.data.newImage
                    })

                    Toast.info('上传头像成功',1)
                }else {
                    Toast.info(res.data.message,1)
                }

            })
            .catch(function (error) {
                console.log(error);
            })
    }


    //角色选择
    role=(item)=>{

        let {roleData} = this.state;

        roleData.map((_item)=>{
            if(_item.value==item.value){
                _item.flag=!item.flag;
            }
        })

        this.setState({
            roleData
        },()=>{
            if(item.flag){
                this.setState({
                    role:3
                })
            }else {
                this.setState({
                    role:item.value=='我是买家'?2:1
                })
            }
        })

    }


    submit=()=>{
        axios.post(`/user/editUserInfo`,
            {email:this.state.email,
                birthday:this.state.birthday?moment(this.state.birthday).format('YYYY-MM-DD'):this.state.birthday,
                realName:this.state.realName,
                resume:this.state.resume,
                role:this.state.role
            }
        )
            .then((res) =>{
                console.log(res);
                Toast.info(res.data.code==0?'修改成功':res.data.message)

            })
            .catch(function (error) {
                console.log(error);
            })
    }


    render() {
        let {image, birthday, email, realName, resume, role, visible} = this.state;

        return (
            <View style={styles.box}>

                <View style={[styles.a,{height:50}]}>
                    <Text style={styles.f}>头像:</Text>
                    <View style={[styles.b,{flex:4}]}>
                        <TouchableOpacity onPress={this.selectPhotoTapped}>
                            <View>
                                { !this.state.image ? (
                                    <View style={{flexDirection: 'row'}}>
                                        <Text>{' '}</Text>
                                        <Text style={{position: 'absolute', fontSize: 16, right: 40}}>上传头像</Text>
                                    </View>
                                ) : (
                                    <View style={{flexDirection: 'row'}}>
                                        <Text>{' '}</Text>
                                        <Image
                                            style={styles.icon}
                                            source={{uri: image}}
                                        />
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.a}>
                    <Text style={styles.f}>邮箱:</Text>
                    <View style={[styles.b,{flex:4}]}>
                        <TextInput
                            placeholder={'请输入邮箱'}
                            value={email || email}
                            style={styles.teCor}
                            underlineColorAndroid="transparent"
                            onChangeText={this.handleChangeEmail}
                            // onBlur={(value) => this.handleChangeEmail(value, true)}
                        />
                    </View>
                </View>

                <View style={styles.a}>
                    <Text style={styles.f}>昵称:</Text>
                    <View style={[styles.b,{flex:4}]}>
                        <TextInput
                            placeholder={realName?realName:'请输入昵称'}
                            placeholderTextColor={realName?"#000":'#ccc'}
                            style={styles.teCor}
                            underlineColorAndroid="transparent"
                            onChangeText={this.handleChangeName}
                            // onBlur={(value) => this.handleChangeName(value, true)}
                        />
                    </View>
                </View>

                <View style={styles.a}>
                    <Text style={styles.f}>当前角色:</Text>
                    <View style={[styles.b,{flex:4, flexDirection: 'row',justifyContent:"space-around"}]}>
                        {
                            this.state.roleData.map((item,index)=> item.disable ? (
                                    <View key={index} style={{flexDirection:"row",marginRight:15,alignItems:"center"}}>
                                        <View style={{backgroundColor: "#ccc",marginRight:5,
                                            width:20,height:20,borderRadius:10,borderColor:"#ccc",borderWidth:1,overflow:"hidden"}} >
                                            <Image style={{width:20,height:20}} source={selectIcon}/>
                                        </View>
                                        <Text>{item.value}</Text>
                                    </View>
                                ) : (
                                    <TouchableHighlight
                                        onPress={()=>{this.role(item)}} key={index} underlayColor="transparent">
                                        <View style={{flexDirection:"row",marginRight:15,alignItems:"center"}}>
                                            <View style={{backgroundColor:item.flag ? "#0074c3" :'#fff',marginRight:5,
                                                width:20,height:20,borderRadius:10,borderColor:"#ccc",borderWidth:1,overflow:"hidden"}} >
                                                <Image style={{width:20,height:20}} source={selectIcon}/>
                                            </View>
                                            <Text>{item.value}</Text>
                                        </View>
                                    </TouchableHighlight>
                                )
                            )
                        }
                    </View>
                </View>

                <View style={styles.a}>
                    <Text style={styles.f}>生日:</Text>
                    <View style={[styles.b,{flex:4}]}>
                        <List>
                            <DatePicker
                                value={birthday}
                                mode="date"
                                minDate={new Date(1950, 1, 1)}
                                maxDate={new Date()}
                                onChange={this.handleDateChange}
                                format="YYYY-MM-DD"
                            >
                                <RoomInfo />
                            </DatePicker>
                        </List>
                    </View>
                </View>

                <View style={styles.a}>
                    <Text style={styles.f}>个人简介:</Text>
                    <View style={[styles.b,{flex:4}]}>
                        <TextInput
                            multiline={true}
                            numberOfLines={2}
                            placeholder={resume?resume:'请输入个人简介'}
                            placeholderTextColor={resume?"#000":'#ccc'}
                            style={[styles.teCor, {width: 100}]}
                            underlineColorAndroid="transparent"
                            onChangeText={this.handleChangeAllText}
                            // onBlur={(value) => this.handleChangeAllText(value, true)}
                        />
                    </View>
                </View>

                <View style={{alignItems:"center",marginTop:30}}>
                    <LinearGradient colors={['#f96f59', '#f94939']} style={{width:100,borderRadius:5}}>
                        <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                            alignItems:"center"
                        }} onPress={this.submit }>
                            <Text
                                style={{fontSize:16,textAlign:"center",color:"#fff"}}>
                                修改
                            </Text>
                        </TouchableHighlight>
                    </LinearGradient>
                </View>


            </View>
        )
    }
}
const styles = StyleSheet.create({
    box: {
        backgroundColor:"#fff",
        height:Dimensions.get('window').height

    },
    teCor:{
        minWidth:'100%',
        padding:8,
        borderRadius:5,
        borderColor:"#ccc",
        borderWidth:1},
    Text: {
        color: '#333',
        fontSize: 30
    },
    icon: {
        width: 40,
        height: 40,
        position: 'absolute',
        right: 10,
        top: -10,
        borderRadius: 20
    },
    a:{
        flexDirection:"row",
        alignItems:"center",
        marginTop:5,
        padding:10,
        backgroundColor:"#fff",
        borderBottomWidth:1,borderBottomColor:"#ffdac7"
    },
    b:{
        marginLeft:10,
        flex:1,
    },
    f:{
        textAlign: 'center',   flex:1,
        color:"#333"
    },
});
