import React,{Component} from 'react';
import {
    View, Text, TouchableHighlight, Image, ScrollView,CameraRoll, StyleSheet, Platform, Modal, Alert,
    DeviceEventEmitter,TextInput
} from 'react-native';
import Dimensions from 'Dimensions';
import axios from "../../axios";
import {Toast} from "antd-mobile";
import LinearGradient from 'react-native-linear-gradient';
import RNFS from 'react-native-fs';


export default class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            data:{},
            amount:null,
            zfb:null,
        }

    }



    componentWillMount(){

    }

    comfirmSelected = ()=>{
        let {amount,zfb} = this.state;

        axios.post(`/account/confirmRecharge`,{
                tradeNo:zfb,
                amount:amount

            },
        )
            .then((response) =>{
                console.log(response);

                Toast.info(response.data.code==0?'充值成功':response.data.message)

            })
            .catch(function (error) {
                console.log(error);
            })
    }
    cancelSelected = ()=>{}


    submit = ()=>{
        let {amount,zfb} = this.state

        if(!amount){
            Toast.info('请输入充值金额',1)
            return
        }

        if(!zfb){
            Toast.info('请输入支付宝交易号',1)
            return
        }


        Alert.alert('确定充值？',`确定充值${amount}元？`,
            [
                {text:"取消", onPress:this.cancelSelected},
                {text:"确认", onPress:this.comfirmSelected}
            ],
            { cancelable: false }
        );

    }

    comfirmSaveImg = (item)=>{
        this.download(item)
    }

    download=(uri)=> {
        if (!uri) return null;
        return new Promise((resolve, reject) => {
            let dirs = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath : RNFS.ExternalDirectoryPath; //外部文件，共享目录的绝对路径（仅限android）
            const downloadDest = `${dirs}/${((Math.random() * 10000000) | 0)}.jpg`;
            const url = uri;
            const options = {
                fromUrl: url,
                toFile: downloadDest,
                background: true,
                begin: (res) => {
                    console.log('begin', res);
                    console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
                },
            };
            try {
                const ret = RNFS.downloadFile(options);
                ret.promise.then(res => {
                    console.log('success', res);
                    console.log('file://' + downloadDest);
                    let promise = CameraRoll.saveToCameraRoll(downloadDest);
                    promise.then(function(result) {
                        //alert('保存成功');
                        Toast.info('保存成功',1)

                    }).catch(function(error) {
                        Toast.info('保存失败',1)
                    });
                    resolve(res);
                }).catch(err => {
                    reject(new Error(err))
                });
            } catch (e) {
                reject(new Error(e))
            }

        })

    }


    saveImg=(item)=>{

        console.log(item);

        Alert.alert('保存','确认保存吗？',
            [
                {text:"取消", onPress:this.cancelSelected},
                {text:"确认", onPress:()=>this.comfirmSaveImg(item)}
            ],
            { cancelable: false }
        );

    };


    render(){


        return (



                <View style={{height:Dimensions.get("window").height,backgroundColor:"#fff",padding:30,}}>


                    <View style={styles.a}>
                        <Text style={{flex:1}}>支付宝订单号:</Text>
                        <View style={[styles.b,{flex:3}]}>
                            <TextInput
                                placeholder={'请输入支付宝交易订单号'}
                                // value={this.state.username}
                                style={{minWidth:'100%',padding:10,backgroundColor:"#f0f0f0",borderRadius:5,}}
                                underlineColorAndroid="transparent"
                                onChangeText={(zfb) => this.setState({zfb})}
                            >
                            </TextInput>
                        </View>
                    </View>


                    <View style={styles.a}>
                        <Text style={{flex:1}}>充值金额:</Text>
                        <View style={[styles.b,{flex:3}]}>
                            <TextInput
                                placeholder={'请输入充值金额'}
                                keyboardType='numeric'
                                // value={this.state.username}
                                style={{minWidth:'100%',padding:10,backgroundColor:"#f0f0f0",borderRadius:5,}}
                                underlineColorAndroid="transparent"
                                onChangeText={(amount) => this.setState({amount})}
                            >
                            </TextInput>
                        </View>
                    </View>

                    <View style={styles.a}>
                        <Text style={{flex:1}}>充值说明:</Text>
                        <View style={[styles.b,{flex:3}]}>
                            <Text style={{color:"grey"}}>1.请扫描下方二维码进行转账。</Text>
                            <Text style={{color:"grey"}}>2.转账成功后，将支付宝交易号复制到输入框。</Text>
                            <Text style={{color:"grey"}}>3.填写转账金额并确认。</Text>
                        </View>
                    </View>

                    <View style={styles.a}>
                        <Text style={{flex:1}}>充值二维码:</Text>

                        <TouchableHighlight onLongPress={()=>this.saveImg('http://39.105.201.251/static/img/alipay.c3ed1e6.png')} style={[styles.b,{flex:3}]}>
                            <Image source={{uri:'http://39.105.201.251/static/img/alipay.c3ed1e6.png'}}
                                   style={{width:"100%",height:230,resizeMode:"stretch"}}/>
                        </TouchableHighlight>


                    </View>


                    <View style={{alignItems:"center",marginTop:10}}>
                        <LinearGradient colors={['#f96f59', '#f94939']} style={{width:100,borderRadius:5}}>
                            <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                alignItems:"center"
                            }} onPress={this.submit }>
                                <Text
                                    style={{fontSize:16,textAlign:"center",color:"#fff"}}>
                                    确定
                                </Text>
                            </TouchableHighlight>
                        </LinearGradient>
                    </View>

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



