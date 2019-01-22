import React,{Component} from 'react';
import {Alert,View,DeviceEventEmitter, ScrollView,Text, TouchableHighlight, TextInput,Image, Modal, StyleSheet,Platform} from 'react-native';

import Dimensions from "Dimensions";
import axios from "../../../axios";
import add from "../style/add.png";
import {Toast} from 'antd-mobile'

import ImagePicker from "react-native-image-picker";

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

export default class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            imgStr:'12345667',
            imgArr:[],
            file:[],
        }

        this.aa=false;

    }




    //上传图片
    uploadPic = () => {

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

                let {file,imgArr} = this.state

                if(imgArr.length>3){
                    alert('最多可添加三张图片')
                    return
                }

                
                console.log(imgArr);

                let aaa = [
                    {uri:response.uri}
                ]


                console.log(response);

                uploadImage(aaa);

                this.setState({
                    file:[...file,...uploadImage(aaa)],
                    imgArr:[...imgArr,aaa[0]],
                },()=>{
                    this.props.addPic(this.state.file)
                })
            }
        });

    }

    componentWillMount(){

    }



    addPic = ()=>{

        this.uploadPic()

    }
    


    comfirmSelected=(img)=>{
        console.log(img);
        let {imgArr,file} = this.state;

        this.setState({
            imgArr:imgArr.filter(item=>{return item.uri!=img.uri}),
            file:file.filter(item=>{return item.uri.uri!=img.uri})

        },()=>{
            this.props.addPic(this.state.file)
        })


    };

    cancelSelected=()=>{

    };


    deleteImg=(item)=>{

        console.log(item);

        Alert.alert('删除','确认删除吗？',
            [
                {text:"取消", onPress:this.cancelSelected},
                {text:"确认", onPress:()=>this.comfirmSelected(item)}
            ],
            { cancelable: false }
        );

    };






    render(){



        return (



            <View style={{backgroundColor:"#fff"}}>
                <View style={styles.allLine}>
                    <View style={{flex:1,}}><Text >添加图片:</Text></View>
                    <View style={{flex:3,}}>
                        <TouchableHighlight underlayColor={"#fff"} onPress={()=>{this.addPic()} } style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                            <View><Image source={add} style={{width:30,height:30}}/></View>
                        </TouchableHighlight>

                    </View>

                </View>

                {
                    this.state.imgArr.length>0&&
                    <View style={styles.allLine}>
                        <View style={{flex:1,}}><Text >{}</Text></View>
                        <View style={{flex:3,}}>


                            {
                                this.state.imgArr.map((item,index)=>
                                    <TouchableHighlight underlayColor="transparent" key={index} style={{height:210,marginTop:10}} onLongPress={()=>{this.deleteImg(item)}}>
                                        <Image style={{height:200,width:"80%",resizeMode:"stretch"}}
                                               source={{uri:item.uri}}
                                        />
                                    </TouchableHighlight>
                                )
                            }




                        </View>

                    </View>
                }



            </View>

        )

    }
}

const styles = StyleSheet.create({

    allInput:{
        borderWidth:1,borderColor:"#f0f0f0",width:'70%',borderRadius:5
    },

    allLine:{flexDirection:"row",alignItems:"center",justifyContent:"center",marginTop:10},
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,

    },
    innerContainer: {
        borderRadius: 10,
    },
    a:{
        flexDirection:"row",alignItems:"center",marginTop:10
    },

    b:{
        marginLeft:10,flex:1,
    },
    d:{

        flexDirection:"row",
        borderBottomWidth:1,
        borderBottomColor:"#ccc"
    },

    e:{
        backgroundColor:"#fff"
    },
    aaa:{
        paddingTop:10,paddingBottom:10,paddingLeft:3,paddingRight:3,borderRightWidth:1,borderRightColor:"#ccc",
    },
});