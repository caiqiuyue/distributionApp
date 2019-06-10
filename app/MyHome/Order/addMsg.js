import React,{Component} from 'react';
import {
    Linking, DeviceEventEmitter, View, Text, Image, TextInput, Modal, Platform, StyleSheet, FlatList, ScrollView,
    TouchableHighlight, Dimensions, Keyboard,Alert
} from 'react-native';

import {Picker,DatePicker,Toast} from 'antd-mobile'
import axios from "../../axios";

import moment from "moment";
import LinearGradient from 'react-native-linear-gradient';

export default class GoodSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message:'',
            msgList:[]
        };


    }

     getWorkOrderMsg = ()=>{
         axios.get(`/order/getWorkOrderMsg`,

             {serviceId:this.props.serviceId}
         )
             .then((response) =>{
                 console.log(response);
                 if(response.data.code==0){
                     this.setState({
                         msgList:response.data.data.msgList
                     })
                 }
             })
             .catch( (error)=> {
                 console.log(error);
             })
     }

    componentWillMount(){
        this.getWorkOrderMsg()
    }

     acceptOrder = ()=>{
        if(!this.state.message){
            alert('请填写留言')
            return
        }
         axios.get(`/order/workOrderMsg`,{
             serviceId:this.props.serviceId,
             message:this.state.message

             }
         )
             .then((response) =>{
                 console.log(response);
                 alert(response.data.code==0?'留言成功':response.data.message)
                 this.getWorkOrderMsg()

             })
             .catch( (error)=> {
                 console.log(error);
             })
     }




    render(){

        let {msgList} = this.state

        return (
            <ScrollView style={{maxHeight:Dimensions.get('window').height-200}}>
                <View style={{padding:10}}>

                    <View style={styles.a}>
                        <Text style={styles.f}>留言:</Text>
                        <View style={[styles.b,{flex:3}]}>
                            <TextInput
                                placeholder={'请填写留言'}
                                multiline={true}
                                style={[{borderColor:"#ccc",borderWidth:1,borderRadius:5,padding:5,height:100}]}
                                underlineColorAndroid="transparent"
                                onChangeText={(message) => this.setState({message})}
                            />
                        </View>
                    </View>

                    {
                        msgList&&msgList.map((item,index)=>

                            <View style={{marginTop:5}} key={index}>
                                <Text>{`${item.name}（${item.time}）:`}</Text>
                                <Text style={{marginTop:5,marginLeft:20,color:item.name=='买家'?'blue':'purple'}}>{item.message}</Text>
                            </View>

                        )
                    }


                    <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-around",marginTop:20}}>


                        <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,alignItems:"center",justifyContent:"center",width:100}}>
                            <TouchableHighlight onPress={()=>{this.acceptOrder()}} underlayColor="transparent" style={{padding:10,alignItems:"center",justifyContent:"center",}}>
                                <Text style={{color:"#fff"}}>留言</Text>
                            </TouchableHighlight>
                        </LinearGradient>

                    </View>

                </View>
            </ScrollView>
        )

    }
}



const styles = StyleSheet.create({
    select:{
        // backgroundColor:"#fff",
        height:Dimensions.get("window").height


    },


    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,

    },
    innerContainer: {
        borderRadius: 10,
    },

    a:{
        flexDirection:"row",alignItems:"center",marginTop:5
    },

    b:{
        marginLeft:10,flex:1,
    },
    f:{
        flex:1,color:"grey"
    },

    d:{

        flexDirection:"row",padding:5
    },

    e:{
        backgroundColor:"#fff",marginTop:5,
    },


    aa:{
        paddingLeft:3,paddingRight:3,borderRightWidth:1,borderRightColor:"#ccc"
    },



    c:{
        flex:3
    },


    fontcolor:{
        color:"grey"
    }


});
