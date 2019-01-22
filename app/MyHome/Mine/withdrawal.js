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
import bankCardAttribution from "./bank";


export default class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            data:{},
            amount:null,
            name:null,
            cardType:'',
            bankcardNo:'',
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

    comfirmSelected = ()=>{
        let {amount,name,bankcardNo,cardType} = this.state

        axios.post(`/account/applyWithdraw`,{
                amount,
                accountName:name,
                bankName:cardType,
                banKNo:bankcardNo


            },
        )
            .then((response) =>{
                console.log(response);

                Toast.info(response.data.code==0?'提现成功':response.data.message)

            })
            .catch(function (error) {
                console.log(error);
            })
    }
    cancelSelected = ()=>{}


    submit = ()=>{
        let {amount,name,bankcardNo,cardType,data} = this.state


        if(!name){
            Toast.info('请输入账户名称',1)
            return
        }

        if(!amount){
            Toast.info('请输入提现金额',1)
            return
        }

        if((amount-0)>(data.balance-0)){
            Toast.info('提现金额不能大于账户余额',1)
            return
        }

        if(bankcardNo==''){
            Toast.info('请输入银行卡号',1)
            return
        }

        if(!cardType){
            Toast.info('未匹配到您的银行卡类型,请重新输入',1)
            return
        }




        Alert.alert('确定提现？',`确定提现${amount}元？`,
            [
                {text:"取消", onPress:this.cancelSelected},
                {text:"确认", onPress:this.comfirmSelected}
            ],
            { cancelable: false }
        );

    }




    bankNumRep = (item) => {
        let str = item.replace(/\s/g,'').replace(/(.{4})/g,"$1 ");
        str=str.trim();
        return str
    }


    changeBankCard=(value)=>{
        let num = value.replace(/\s+/g,"");
        bankCardAttribution(num, this.getCardType);

        this.setState({
            bankcardNo: value
        });

    };


    //获取银行卡类型
    getCardType = (value) => {
        if(value.validated) {
            this.setState({
                cardType: value.type
            });
        }else {
            this.setState({
                cardType: ''
            });
        }
    };


    render(){
        let {data} = this.state
        return (



                <View style={{height:Dimensions.get("window").height,backgroundColor:"#fff",padding:30,}}>


                    <View style={[styles.a,{marginTop:0}]}>
                        <Text style={{flex:1}}>余额账户（元）</Text>
                        <View style={[styles.b,{flex:3}]}>
                            <Text style={{fontSize:35,color:"#f1803a",fontWeight:'bold'}}>{data.balance?data.balance.toFixed(2):'0.00'}元</Text>

                        </View>
                    </View>

                    <View style={styles.a}>
                        <Text style={{flex:1}}>账户名称:</Text>
                        <View style={[styles.b,{flex:3}]}>
                            <TextInput
                                placeholder={'请输入账户名称'}
                                // value={this.state.username}
                                style={{minWidth:'100%',padding:10,backgroundColor:"#f0f0f0",borderRadius:5,}}
                                underlineColorAndroid="transparent"
                                onChangeText={(name) => this.setState({name})}
                            >
                            </TextInput>
                        </View>
                    </View>


                    <View style={styles.a}>
                        <Text style={{flex:1}}>提现金额:</Text>
                        <View style={[styles.b,{flex:3}]}>
                            <TextInput
                                placeholder={'请输入提现金额'}
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
                        <Text style={{flex:1}}>银行卡号:</Text>
                        <View style={[styles.b,{flex:3}]}>
                            <TextInput
                                placeholder={'请输入银行卡号'}
                                keyboardType='numeric'
                                // value={this.state.username}
                                style={{minWidth:'100%',padding:10,backgroundColor:"#f0f0f0",borderRadius:5,}}
                                underlineColorAndroid="transparent"
                                value={this.bankNumRep(this.state.bankcardNo)}
                                onChangeText={(bankcardNo) => this.changeBankCard(bankcardNo)}
                            >
                            </TextInput>
                        </View>
                    </View>

                    <View style={styles.a}>
                        <Text style={{flex:1}}>银行名称:</Text>
                        <View style={[styles.b,{flex:3}]}>
                            <TextInput
                                placeholder={'输入银行卡号后，系统自动获取'}
                                value={this.state.cardType}
                                editable={false}
                                style={{minWidth:'100%',padding:10,backgroundColor:"#f0f0f0",borderRadius:5,}}
                                underlineColorAndroid="transparent"
                            >
                            </TextInput>
                        </View>
                    </View>

                    <View style={styles.a}>
                        <Text style={{flex:1}}>提现说明:</Text>
                        <View style={[styles.b,{flex:3}]}>
                            <Text style={{color:"grey"}}>1.提现金额超过1元才能提现。</Text>
                        </View>
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



