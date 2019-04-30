import React,{Component} from 'react';
import {
    View, Text, TouchableHighlight, Image, ScrollView,CameraRoll, StyleSheet, Platform, Modal, Alert,
    DeviceEventEmitter,TextInput
} from 'react-native';
import Dimensions from 'Dimensions';
import axios from "../../axios";
import {Picker,Toast} from "antd-mobile";
import LinearGradient from 'react-native-linear-gradient';
import RNFS from 'react-native-fs';
import s1 from "../HomePage/style/234.png";
import bankCardAttribution from "./bank";
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

export default class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            data:{},
            amount:null,
            name:null,
            cardType:'',
            bankcardNo:'',
            wayList:[
                {label:'微信',value:'1'},
                {label:'支付宝',value:'2'},
                {label:'银行卡',value:'3'},
            ],
            way:[],
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


        axios.get(`/account/getWithdrawTypeAndCard`,{},
        )
            .then((response) =>{
                console.log(response,'查询最后一次提现方式和卡号');
                if(response.data.code==0&&response.data.data){
                    let way = [];
                    response.data.data.bankName.indexOf('微信')!==-1?way[0]='1':response.data.data.bankName.indexOf('支付宝')!==-1?way[0]='2':way[0]='3'
                    this.setState({
                        way,
                        cardType:response.data.data.bankName,
                        name:response.data.data.accountName,
                        bankcardNo:response.data.data.bankNo,
                    },()=>{
                        console.log(this.state.bankName,'bankName');
                        console.log(this.state.accountName,'accountName');
                        console.log(this.state.way,'way');
                    })
                }

            })
            .catch(function (error) {
                console.log(error);
            })

    }

    comfirmSelected = ()=>{
        let {amount,name,bankcardNo,cardType,way} = this.state


        axios.post(`/account/applyWithdraw`,{
                amount,
                accountName:name,
                bankName:cardType,
                bankNo:way[0]==3?bankcardNo:bankcardNo.replace(/\s+/g,"")


            },
        )
            .then((response) =>{
                console.log(response);

                Toast.info(response.data.code==0?'提现成功':response.data.message)
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

            })
            .catch(function (error) {
                console.log(error);
            })
    }
    cancelSelected = ()=>{}


    setWay = (way)=>{
        this.setState({
            way,
            cardType:way==1?'微信':way==2?'支付宝':'',
            name:null,
            bankcardNo:'',

        })

    }
    submit = ()=>{
        let {way,amount,name,bankcardNo,cardType,data} = this.state
        
        console.log(bankcardNo,'bankcardNo');


        if(!way[0]){
            Toast.info('请选择提现方式',1)
            return
        }
        if(!name){
            Toast.info(way[0]==3?'请输入账户名称':'请输入真实姓名',1)
            return
        }

        if(!amount){
            Toast.info('请输入提现金额',1)
            return
        }

        // if((amount-0)>(data.balance-0)){
        //     Toast.info('提现金额不能大于账户余额',1)
        //     return
        // }

        if(bankcardNo==''){
            Toast.info(`${way[0]==1?'微信':way[0]==2?'支付宝':'银行卡'}号不能为空`,1)
            return
        }

        if(!cardType && way[0]==3){
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
                        <Text style={{flex:1}}>提现方式:</Text>
                        <View style={[styles.b,{flex:3}]}>
                            <Picker
                                data={this.state.wayList}
                                cols={1}
                                extra={'请选择提现方式'}
                                value={this.state.way}
                                // onOk={channelId => {this.setState({channelId});}}
                                onChange={way => {this.setWay(way);}}
                                className="forss">
                                <RoomInfo></RoomInfo>
                            </Picker>
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


                    {
                        this.state.way[0]!=3?
                            <View>
                                <View style={styles.a}>
                                    <Text style={{flex:1}}>{this.state.way[0]==1?'微信':this.state.way[0]==2?'支付宝':''}号:</Text>
                                    <View style={[styles.b,{flex:3}]}>
                                        <TextInput
                                            placeholder={this.state.way[0]==1?'请输入微信号':this.state.way[0]==2?'请输入支付宝号':''}
                                            // value={this.state.username}
                                            style={{minWidth:'100%',padding:10,backgroundColor:"#f0f0f0",borderRadius:5,}}
                                            underlineColorAndroid="transparent"
                                            value={this.state.bankcardNo}
                                            onChangeText={(bankcardNo) => this.setState({bankcardNo})}
                                        >
                                        </TextInput>
                                    </View>
                                </View>
                                <View style={styles.a}>
                                    <Text style={{flex:1}}>真实姓名:</Text>
                                    <View style={[styles.b,{flex:3}]}>
                                        <TextInput
                                            placeholder={this.state.name?this.state.name:'转账验证需用'}
                                            placeholderTextColor={this.state.name?"#000":'#ccc'}
                                            // value={this.state.username}
                                            style={{minWidth:'100%',padding:10,backgroundColor:"#f0f0f0",borderRadius:5,}}
                                            underlineColorAndroid="transparent"
                                            onChangeText={(name) => this.setState({name})}
                                        >
                                        </TextInput>
                                    </View>
                                </View>
                            </View>:
                            <View>
                                <View style={styles.a}>
                                    <Text style={{flex:1}}>账户名称:</Text>
                                    <View style={[styles.b,{flex:3}]}>
                                        <TextInput
                                            // value={this.state.username}
                                            placeholder={this.state.name?this.state.name:'请输入账户名称'}
                                            placeholderTextColor={this.state.name?"#000":'#ccc'}
                                            style={{minWidth:'100%',padding:10,backgroundColor:"#f0f0f0",borderRadius:5,}}
                                            underlineColorAndroid="transparent"
                                            onChangeText={(name) => this.setState({name})}
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
                            </View>
                    }


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



