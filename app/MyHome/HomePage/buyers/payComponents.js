import React from 'react';
import {

    Text,
    TextInput,
    StyleSheet,
    TouchableHighlight,
    View,Dimensions,
    FlatList,Modal,ScrollView,Image,
    Platform

} from 'react-native';

import axios from '../../../axios'
import moment from "moment";
import {Picker,Toast} from "antd-mobile";
import LinearGradient from 'react-native-linear-gradient';

import InputPassword from "./InputPassword";

export default class App extends React.Component {


    constructor(props) {
        super(props);
        this.state = {

            totalMoney:0,
            payDatas:{}


        };


        this.parentId = null
        this.orderIds = null

    }


    componentWillMount() {

        this.setState({
            payDatas:this.props.payDatas
        })

        if(this.props.parentId){
            this.parentId = this.props.parentId
        }else {
            this.orderIds = this.props.orderIds
        }


    }


    topUp = ()=>{
        this.props._setModalVisible(false)
        const { navigate } = this.props.navigation;
        navigate('TopUp',{ user: '' });
    }




    //支付
    onPay = ()=>{

        let {payPassword} = this.state;
        if(!payPassword){
            alert('请输入支付密码');
            return
        }

        if(payPassword && payPassword.length<6){
            alert('请输入6位数支付密码');
            return
        }


        let data = {
            payMoney:this.state.payDatas.payMoney,
            password:payPassword,
            skip_verify:"46396EF464AA44EFB155740B804ADBF2"
        }
        if(this.props.parentId){
            data.parentId=this.parentId
        }else {
            let orderIds = JSON.parse(JSON.stringify(this.orderIds+''))
            data.orderIds=orderIds.split(',')
        }
        console.log(data);


        let url = `/order/${this.props.parentId?'orderPay':'orderBatchPay'}`

        axios.post(`${url}`,data,)
            .then((res) =>{
                console.log(res);
                if(res.data.code==0){
                    this.props._setModalVisible(false)
                    this.props.onRefresh()
                    const { navigate } = this.props.navigation;
                    navigate('GoodSelect',{ user: '' });

                }else {
                    alert(res.data.message)
                }
            })
            .catch(function (error) {
                console.log(error);
            })



    }


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

    onChange=(item)=>{
        this.setState({
            payPassword:item
        })
    }

    render() {



        let {payDatas} = this.state



        return (
            <View style={{padding:10}}>

                <View>
                    <ScrollView style={{maxHeight:Dimensions.get('window').height-200}}>
                        <View style={styles.a}>
                            <Text style={styles.f}>您需支付:</Text>
                            <View style={[styles.b,{flex:3}]}>
                                <Text style={{color:"orange",fontSize:18}}>{payDatas.payMoney}元</Text>
                            </View>
                        </View>

                        <View style={styles.a}>
                            <Text style={styles.f}>账户余额:</Text>
                            <View style={[styles.b,{flex:3,flexDirection:"row"}]}>
                                <Text>{payDatas.balance}元</Text>

                                {
                                    (payDatas.balance<payDatas.payMoney)&&
                                    <TouchableHighlight onPress={this.topUp} underlayColor="transparent" style={[styles.b,]}>
                                        <Text style={{textDecorationLine:"underline"}}>余额不足,去充值？</Text>
                                    </TouchableHighlight>
                                }


                            </View>




                        </View>



                        <View style={{marginTop:10,alignItems:"center",marginBottom:10}}>
                            <Text style={{fontWeight:"bold"}}>请输入支付密码:</Text>

                        </View>

                        <InputPassword
                            maxLength={6}
                            itemStyle={{height:60,width:'16.6%'}}
                            onChange={this.onChange}

                        />


                        <View style={{marginTop:10,alignItems:"center",justifyContent:"center"}}>
                            <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,alignItems:"center",justifyContent:"center",width:100}}>
                                <TouchableHighlight onPress={()=>{this.onPay()}} underlayColor="transparent" style={{padding:10,alignItems:"center",justifyContent:"center",}}>
                                    <Text style={{color:"#fff"}}>确定</Text>
                                </TouchableHighlight>
                            </LinearGradient>
                        </View>

                        <View style={{borderLeftWidth:3,borderLeftColor:'#f96f59',marginTop:10,marginBottom:10}}>
                            <Text style={{fontSize:20,fontWeight:'bold',paddingLeft:10}}>订单详情</Text>
                        </View>
                        {
                            payDatas.orderList.map((item,index)=>

                                <View style={{flexDirection:"row",padding:5,borderBottomWidth:1,borderBottomColor:"#ccc"}} key={index}>
                                    <View style={{flex:2,alignItems:"center",justifyContent:"center"}}>
                                        <Text style={{fontSize:16,fontWeight:"bold"}}>{item.goodsNo}</Text>
                                        <Text style={{marginTop:5,color:"grey"}}>品牌:{item.brandName}</Text>
                                        <Text style={{marginTop:5,color:"grey"}}>渠道:{item.channelName}</Text>
                                    </View>
                                    <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                                        <Text style={{fontSize:16,fontWeight:"bold"}}>*{item.goodsNum}件</Text>
                                    </View>
                                    <View style={{flex:2,alignItems:"center",justifyContent:"center"}}>
                                        <Text>单价:¥{item.goodsPrice}元</Text>
                                        <Text style={{marginTop:5}}>邮费:¥{item.postFee}元</Text>
                                    </View>
                                </View>
                            )
                        }


                    </ScrollView>
                </View>




            </View>
        )
    }
}


const styles = StyleSheet.create({


    qw:{marginRight:10,},
    as:{justifyContent: "center",alignItems:"center",marginRight:20},
    er:{width: "50%",flexDirection:"row",marginTop:10},
    flex2:{flex:2},
    flex3:{flex:3},
    teCor2:{color:"grey"},

    teCor:{minWidth:'100%',padding:10,backgroundColor:"#fff",borderRadius:5,borderColor:"#ccc",borderWidth:1},

    a:{
        flexDirection:"row",alignItems:"center",marginTop:5
    },

    b:{
        marginLeft:10,flex:1,
    },
    f:{
        flex:1,color:"grey"
    },

});


