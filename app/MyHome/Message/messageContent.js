import React,{Component} from 'react';
import {
    View, Text, TouchableHighlight, Image, StyleSheet, Platform, FlatList, Dimensions,
    DeviceEventEmitter
} from 'react-native';

import axios from "../../axios";
import moment from "moment/moment";
import JPushModule from 'jpush-react-native'
import {Toast} from 'antd-mobile'
import topBg from "../HomePage/style/topBg.png";

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getData} from "../../components/active/reducer";

import read from './style/read.png'
import unread from './style/unread.png'
import select from '../select.png'
import LinearGradient from 'react-native-linear-gradient';
import {ifIphoneX} from "react-native-iphone-x-helper";
const setDate = (date) => {

    let a = 1000*60;//分钟
    let b = 1000*60*60;//小时

    let newDate = new Date();
    let num = moment(newDate).valueOf() - moment(date).valueOf();

    if(num / a < 60){

        return(`${Math.round(num/a)}分钟前`)

    }else if(num / b < 24){

        return(`${Math.round(num/b)}小时前`)

    }else if(moment(num).dayOfYear() < 10){

        return(`${moment(num).dayOfYear()}天前`)

    }else {

        return moment(date).format('YYYY-MM-DD');
    }


};
const getText = (value) => {
    const texts = {
        '-1': '提现到账',
        '-2': '退款到账',
        '-3': '收款到账',
        '-8': '买家申请发票',
        '-9': '卖家开票',
        '1': '订单支付',
        '2': '卖家接单',
        '3': '卖家拒绝',
        '4': '卖家配货',
        '5': '卖家无货',
        '6': '卖家发货',
        '7': '买家收货',
        '8': '买家发起工单',
        '9': '卖家回复工单',
        '15': '到货通知'
    }
    return texts[value];
};

class ReadMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            refreshing: false,
            handelMsg:[
                {
                    value:"未读消息",
                    flag:true
                },

                {
                    value:"已读消息",
                    flag:false
                },

            ],
            changeMsg:"未读消息",
            unreadData:[],
            readData:[],
            aa:false,
            pages:1,
            noData:false,
        };

        this.type = 1

    }

    componentWillMount(){
        
        


        if(Platform.OS === 'ios'){
            JPushModule.setBadge(0, (badgeNumber) => {
                console.log(badgeNumber)
            });
        }

        axios.post(`/notice/getMessageList`, {
            current:1,
            pageSize:50
        })
            .then( (response)=> {
                console.log(response,'componentWillMount获取消息');

                this.setState({
                    aa:true
                },()=>{
                    if(response.data.code==0){
                        this.setState({
                            unreadData:response.data.data.messageList&&response.data.data.messageList.filter(item=>{return item.status==0}),
                            readData:response.data.data.messageList&&response.data.data.messageList.filter(item=>{return item.status==1})
                        })
                    }
                })



            })
            .catch(function (error) {
                console.log(error);
            });
    }




    //选择状态
    handelMsg=(item)=>{

        let {handelMsg} = this.state;

        handelMsg.map((_item)=>{
            if(_item.value==item.value){
                _item.flag=true;
            }else {
                _item.flag = false
            }

        })

        this.setState({
            handelMsg,
            changeMsg:item.value
        },()=>{
            if(item.value=='未读消息'){


                // this.getOrderList()

            }


            if(item.value=='已读消息'){
                // if(!this.state.yudingState){
                //
                // }

                // this.getCheckinList();

            }
        })

    }

    //点击标为已读
    messageBtn = (item)=>{

        axios.get(`/notice/updateMessage`, {
            id:item.id,
            status:1,
        })
            .then( (response)=> {
                console.log(response);
                this.getMyMsg()
            })
            .catch(function (error) {
                console.log(error);
            });
    };


    onEndReached = ()=>{
        let {pages,noData,unreadData,readData} = this.state;


        if(!noData){
            this.setState({
                pages:pages+1
            },()=>{
                axios.post(`/notice/getMessageList`, {
                    current:this.state.pages,
                    pageSize:50
                })
                    .then((response) =>{
                        console.log(response);
                        this.setState({
                            aa:true,
                            bb:true,
                            refreshing:false,

                        },()=>{
                            if(response.data.code==0){

                                if(response.data.data.messageList.length==0){
                                    this.setState({
                                        noData:true
                                    })
                                }else{
                                    this.setState({
                                        unreadData:[...unreadData,...(response.data.data.messageList?response.data.data.messageList.filter(item=> {return item.status==0}):[])],
                                        readData:[...readData,...(response.data.data.messageList?response.data.data.messageList.filter(item=> {return item.status==1}):[])],
                                    })
                                }



                            }else{
                                Toast.info(response.data.message,1)
                            }
                        })



                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            })
        }


    }

    getMyMsg=()=>{


        this.setState({
            refreshing:false
        })


        axios.post(`/notice/getMessageList`, {
            current:1,
            pageSize:50
        })
            .then( (response)=> {
                console.log(response,'componentWillMount获取消息');

                if(response.data.code==0){

                    let unread = response.data.data.messageList.filter(item=>{return item.status==1});

                    this.props.getData(unread);
                    this.setState({
                        unreadData:response.data.data.messageList&&response.data.data.messageList.filter(item=>{return item.status==0}),
                        readData:response.data.data.messageList&&response.data.data.messageList.filter(item=>{return item.status==1})
                    })
                }else {
                    Toast.info(response.data.message,1)
                }



            })
            .catch(function (error) {
                console.log(error);
            });


    }

    //下拉刷新
    onRefresh = () => {

        this.setState({
            refreshing: true,noData:false,pages:1,
        },()=>{
           this.getMyMsg()
        });


        

    };



    jumptoBtn = (item) => {
        console.log(item,'publishpublishpublishpublishpublishpublish');
        const { navigate } = this.props.navigation;


        let data = {};
        data.publishId = item.tradeNo;

        navigate((item.tradeType==-1||item.tradeType==-2||item.tradeType==-3)?'WalletDetail':(item.tradeType==1||item.tradeType==2||item.tradeType==3||item.tradeType==4||item.tradeType==5||item.tradeType==6||item.tradeType==7)?'GoodSelect':(item.tradeType==8||item.tradeType==9)?'Order':'Publish',{ messageJump: data });

    };




    render(){

        let {handelMsg,changeMsg,unreadData,readData,refreshing,} = this.state;
        // 交易类型 -1提现到账 -2退款到账 -3收款到账 -8买家申请发票 -9卖家开票
        // 1订单支付 2卖家接单 3卖家拒绝 4卖家配货 5卖家无货 6卖家发货 7买家收货 8买家发起工单 9卖家回复工单
        // 15到货通知
        let  aaa= []


        return (

            <View style={{height: Dimensions.get("window").height,backgroundColor:"#fff"}}>

                <View>
                    <Image source={topBg} style={{height:70,width:Dimensions.get('window').width,resizeMode:"stretch"}} />
                </View>

                <View style={{borderTopColor:"#f96f59",borderTopWidth:1,flexDirection:"row",justifyContent:"space-around"}}>
                    {
                        handelMsg.map((item,index)=>

                            <LinearGradient key={index} colors={[item.flag?'#f96f59':"#fff", item.flag?'#f94939':"#fff"]} style={{width:"50%",}}>
                                <TouchableHighlight   onPress={()=>this.handelMsg(item)} style={{padding:10,alignItems:"center",
                                    // backgroundColor:!item.flag?"#f6f8fa":"#fff",
                                    borderBottomWidth:1,
                                    borderBottomColor:"#f96f59",
                                }} underlayColor="transparent" >

                                    <View style={{alignItems:"center",flexDirection:"row"}}>
                                        {
                                            item.flag&&<Image source={select} style={{width:14,height:14,marginRight:5}}/>
                                        }
                                        <Text style={{color:item.flag?"#fff":"#f94939",fontWeight:"bold"}}>{item.value}</Text>
                                    </View>
                                </TouchableHighlight>
                            </LinearGradient>
                        )
                    }
                </View>


                {
                    changeMsg=='未读消息'?
                        <View>
                            <View style={{padding:10,
                                ...ifIphoneX({
                                    height: Dimensions.get("window").height-180
                                }),
                                ...Platform.select({
                                    android:{
                                        height: Dimensions.get("window").height-180,
                                    },
                                    ios:{
                                        height: Dimensions.get("window").height-140,
                                    },

                                }),


                            }}>
                                <FlatList
                                    data={unreadData}  //列表的渲染数据源
                                    ListEmptyComponent={()=><View style={{marginTop:30,alignItems:"center"}}><Text>{this.state.aa?'暂无未读消息':'获取消息数据中'}</Text></View>} //列表没有数据时展示，箭头函数中可以写一个react组件
                                    getItemLayout={(data, index) => ( {length: 80, offset: 80 * index, index} )}
                                    initialNumToRender={10}  //首次渲染的条数
                                    onEndReached={this.onEndReached}  //列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
                                    onEndReachedThreshold={0.3} //定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                                    onRefresh={this.onRefresh} //下拉刷新
                                    refreshing={refreshing} //下拉刷新时候的正在加载的符号，设置为true显示，false隐藏。加载完成，需要设置为false
                                    keyExtractor={(item,index)=>`${index}`}
                                    renderItem={({item}) => (  //渲染列表的方式

                                        <View>
                                            <View style={{flexDirection:"row",backgroundColor:"#f6f8fa",marginBottom:5}}>

                                                <View style={{flex:1,alignItems:"center",justifyContent:"center",paddingLeft:10,paddingRight:10,marginTop:10,marginBottom:10,borderRightColor:"#e7e9ea",borderRightWidth:1}}>
                                                    <View  style={{alignItems:"center",flexDirection:"row",marginLeft:0}}>
                                                        <Image style={{height:20,width:20,marginRight:5}}
                                                               source={unread}/>
                                                        <Text style={{fontSize:14}}>{getText(item.tradeType)}</Text>
                                                    </View>

                                                    <Text style={{marginTop:5,color:"grey"}}>{setDate(item.createTime)}</Text>

                                                </View>



                                                <View style={{flex:2,marginLeft:15,justifyContent:"center",padding:10}}>

                                                    <TouchableHighlight
                                                        underlayColor="#f0f0f0" onPress={()=>this.jumptoBtn(item)}
                                                    >
                                                        <Text style={{color:"grey"}}>{item.content}
                                                        <Text style={{textDecorationLine:'underline',color:"#f17e3a"}}>点击查看详情</Text>
                                                        </Text>
                                                    </TouchableHighlight>

                                                    <TouchableHighlight  underlayColor={item.sendStatus==1 ? "#f0f0f0":'#fff'} onPress={()=>this.messageBtn(item)}><Text  style={{color:"blue",textAlign:"right"}}>标为已读</Text></TouchableHighlight>

                                                </View>
                                            </View>
                                        </View>


                                    )}
                                />
                            </View>
                        </View>
                        :
                        <View>
                            <View style={{height: Dimensions.get("window").height-130,padding:10}}>
                                <FlatList
                                    data={readData}  //列表的渲染数据源
                                    ListEmptyComponent={()=><View style={{marginTop:30,alignItems:"center"}}><Text>{this.state.aa?'暂无已读消息':'获取消息数据中'}</Text></View>} //列表没有数据时展示，箭头函数中可以写一个react组件
                                    getItemLayout={(data, index) => ( {length: 80, offset: 80 * index, index} )}
                                    initialNumToRender={10}  //首次渲染的条数
                                    // onEndReached={this.onEndReached}  //列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
                                    onEndReachedThreshold={0.3} //定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                                    onRefresh={this.onRefresh} //下拉刷新
                                    refreshing={refreshing} //下拉刷新时候的正在加载的符号，设置为true显示，false隐藏。加载完成，需要设置为false
                                    keyExtractor={(item,index)=>`${index}`}
                                    renderItem={({item}) => (  //渲染列表的方式

                                        <View>
                                            <View style={{flexDirection:"row",backgroundColor:"#f6f8fa",marginBottom:5}}>

                                                <View style={{flex:1,alignItems:"center",justifyContent:"center",paddingLeft:10,paddingRight:10,marginTop:10,marginBottom:10,borderRightColor:"#e7e9ea",borderRightWidth:1}}>
                                                    <View  style={{alignItems:"center",flexDirection:"row",marginLeft:0}}>
                                                        <Image style={{height:20,width:20,marginRight:5}}
                                                               source={read}/>
                                                        <Text style={{fontSize:14}}>{getText(item.tradeType)}</Text>
                                                    </View>

                                                    <Text style={{marginTop:5,color:"grey"}}>{setDate(item.createTime)}</Text>

                                                </View>



                                                <View style={{flex:2,marginLeft:15,justifyContent:"center",padding:10}}>

                                                    <TouchableHighlight
                                                        underlayColor="#f0f0f0" onPress={()=>this.jumptoBtn(item)}
                                                    >
                                                        <Text style={{color:"grey"}}>{item.content}
                                                        <Text style={{textDecorationLine:'underline',color:"#f17e3a"}}>点击查看详情</Text>
                                                        </Text>
                                                    </TouchableHighlight>

                                                </View>
                                            </View>
                                        </View>


                                    )}
                                />
                            </View>
                        </View>
                }


            </View>


        )

    }
}


const styles = StyleSheet.create({
    message:{
        flexDirection:"row",
    }
});

export default connect (
    state => ({reduxData: state.reduxData}),
    dispath => bindActionCreators({getData},dispath)
)(ReadMessage)

