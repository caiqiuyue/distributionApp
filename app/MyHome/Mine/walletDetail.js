import React,{Component} from 'react';
import {
    Linking, DeviceEventEmitter, View, Text, Image, TextInput, Modal, Platform, StyleSheet, FlatList, ScrollView,
    TouchableHighlight, Dimensions, Keyboard,Alert
} from 'react-native';


import {Picker,DatePicker,Toast} from 'antd-mobile'
import axios from "../../axios";
import moment from "moment";
import LinearGradient from 'react-native-linear-gradient';
import select from '../select.png'
import close from "../HomePage/style/close.png";

export default class GoodSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            handelMsg:[
                {
                    value:"充值记录",
                    flag:true
                },

                {
                    value:"提现记录",
                    flag:false
                },

            ],

            changeMsg:"充值记录",
            pages1:1,
            pages2:1,
            aa:false,
            bb:false,
            detail:{},
            refreshing:false,
            noData1:false,
            noData2:false,
            animationType: 'none',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示
            message1:"暂无充值记录",
            message2:"暂无提现记录",
        };


    }

    _setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    };

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
         })

     }


     //充值记录
     searchRechargeBill=()=>{
         axios.post(`/account/searchRechargeBill`,
             {
                 current:1,
                 pageSize:50,

             },

         )
             .then((response) =>{
                 console.log(response);
                 this.setState({
                     aa:true,
                     bb:true,
                     refreshing:false,

                 },()=>{
                     if(response.data.code==0){

                         if(response.data.data.rechargeList.length==0){
                             this.setState({
                                 noData:true
                             })
                         }else{
                             this.setState({
                                 topUpDetail:response.data.data.rechargeList,
                             })
                         }

                     }else{

                         this.setState({
                             message1:response.data.message
                         })

                     }
                 })



             })
             .catch(function (error) {
                 console.log(error);
             })
     }

     //提现记录
     searchWithdrawBill=()=>{
         axios.post(`/account/searchWithdrawBill`,
             {
                 current:1,
                 pageSize:50,

             },

         )
             .then((response) =>{
                 console.log(response);
                 this.setState({
                     aa:true,
                     bb:true,
                     refreshing:false,

                 },()=>{
                     if(response.data.code==0){

                         if(response.data.data.withdrawList.length==0){
                             this.setState({
                                 noData:true
                             })
                         }else{
                             this.setState({
                                 withdrawalDetail:response.data.data.withdrawList,
                             })
                         }

                     }else{
                         this.setState({
                             message2:response.data.message
                         })
                     }
                 })



             })
             .catch(function (error) {
                 console.log(error);
             })
     }


     componentWillMount() {

        this.searchRechargeBill()
        this.searchWithdrawBill()
     }


     

     onEndReached = (item)=>{
         let {pages1,pages2,topUpDetail,withdrawalDetail,noData1,noData2} = this.state;


         if(item){

             if(!noData1){
                 this.setState({
                     pages1:pages1+1
                 },()=>{
                     axios.post(`/account/searchRechargeBill`,
                         {
                             current:this.state.pages1,
                             pageSize:50,
                         },

                     )
                         .then((response) =>{
                             console.log(response);
                             this.setState({
                                 aa:true,
                                 bb:true,
                                 refreshing:false,

                             },()=>{
                                 if(response.data.code==0){

                                     if(response.data.data.rechargeList.length==0){
                                         this.setState({
                                             noData1:true
                                         })
                                     }else{
                                         this.setState({
                                             topUpDetail:[...topUpDetail,...(response.data.data.rechargeList?response.data.data.rechargeList:[])],
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

         }else{
             if(!noData2){
                 this.setState({
                     pages2:pages2+1
                 },()=>{
                     axios.post(`/account/searchWithdrawBill`,
                         {
                             current:this.state.pages2,
                             pageSize:50,
                         },

                     )
                         .then((response) =>{
                             console.log(response);
                             this.setState({
                                 aa:true,
                                 bb:true,
                                 refreshing:false,

                             },()=>{
                                 if(response.data.code==0){

                                     if(response.data.data.withdrawList.length==0){
                                         this.setState({
                                             noData2:true
                                         })
                                     }else{
                                         this.setState({
                                             withdrawalDetail:[...withdrawalDetail,...(response.data.data.withdrawList?response.data.data.withdrawList:[])],
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




     }


     onRefresh = ()=>{

         this.setState({
             refreshing:true,noData:false,noData2:false,pages1:1,pages2:1,
         },()=>{
             this.searchRechargeBill()
             this.searchWithdrawBill()
         })
     }


     setDetail=(item)=>{
         this.setState({detail:item,modalVisible:true})
     }

    render(){

        let {refreshing,withdrawalDetail,topUpDetail,handelMsg,changeMsg,detail} = this.state

        let modalBackgroundStyle = {
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
        };
        let innerContainerTransparentStyle = this.state.transparent
            ? { backgroundColor: '#fff', padding: 10 ,
                // height:"90%",
                overflow:"hidden"}
            : null;


        return (
            <View style={styles.select}>

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

                <View>

                    <Modal
                        animationType={this.state.animationType}
                        transparent={this.state.transparent}
                        visible={this.state.modalVisible}

                        onRequestClose={() => { this._setModalVisible(false) } }

                    >
                        <View style={[styles.container,modalBackgroundStyle]}>
                            <View style={[styles.innerContainer,innerContainerTransparentStyle]}>


                                <View>
                                    <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>

                                        <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}>查看详情</Text></View>



                                        <TouchableHighlight underlayColor={"#fff"} onPress={this._setModalVisible.bind(this,false) } style={{}}>
                                            <Image style={{height:30,width:30}} source={close}/>
                                        </TouchableHighlight>

                                    </View>

                                    <View>
                                        <ScrollView style={{maxHeight:Dimensions.get('window').height-200}}>
                                            <View style={{padding:10}}>
                                                <View style={{flexDirection:"row",marginTop:10,alignItems:"center"}}>
                                                    <Text style={{marginRight:10,color:"grey"}}>充值交易号:</Text>
                                                    <Text>{detail.withdrawNo}</Text>
                                                </View>
                                                <View style={{flexDirection:"row",marginTop:10,alignItems:"center"}}>
                                                    <Text style={{marginRight:10,color:"grey"}}>申请提现时间:</Text>
                                                    <Text>{detail.applyTime}</Text>
                                                </View>
                                                <View style={{flexDirection:"row",marginTop:10,alignItems:"center"}}>
                                                    <Text style={{marginRight:10,color:"grey"}}>实际到账时间:</Text>
                                                    <Text>{detail.confirmTime}</Text>
                                                </View>
                                                <View style={{flexDirection:"row",marginTop:10,alignItems:"center"}}>
                                                    <Text style={{marginRight:10,color:"grey"}}>提现金额:</Text>
                                                    <Text style={{fontSize:18,color:"orange",fontWeight:"bold"}}>{detail.amount}元</Text>
                                                </View>
                                                <View style={{flexDirection:"row",marginTop:10,alignItems:"center"}}>
                                                    <Text style={{marginRight:10,color:"grey"}}>到账金额:</Text>
                                                    <Text>{detail.realAmount}元</Text>
                                                </View>
                                                <View style={{flexDirection:"row",marginTop:10,alignItems:"center"}}>
                                                    <Text style={{marginRight:10,color:"grey"}}>银行名称:</Text>
                                                    <Text>{detail.bankName}</Text>
                                                </View>
                                                <View style={{flexDirection:"row",marginTop:10,alignItems:"center"}}>
                                                    <Text style={{marginRight:10,color:"grey"}}>银行卡号:</Text>
                                                    <Text>{detail.bankNo}</Text>
                                                </View>
                                                <View style={{flexDirection:"row",marginTop:10,alignItems:"center"}}>
                                                    <Text style={{marginRight:10,color:"grey"}}>账户名称:</Text>
                                                    <Text>{detail.accountName}</Text>
                                                </View>
                                                <View style={{flexDirection:"row",marginTop:10,alignItems:"center"}}>
                                                    <Text style={{marginRight:10,color:"grey"}}>提现标志:</Text>
                                                    <Text style={{fontSize:18,color:"red",fontWeight:"bold"}}>{detail.flag==1?"申请提现":"确认到账"}</Text>
                                                </View>
                                                {detail.image&&
                                                <View style={{flexDirection:"row",marginTop:10,alignItems:"center"}}>
                                                    <Text style={{marginRight:10,color:"grey",width:80}}>提现二维码图片:</Text>
                                                    <View><Image source={{uri:detail.image}} style={{width:200,height:250,resizeMode:'contain'}}/></View>
                                                </View>}
                                            </View>
                                        </ScrollView>
                                    </View>


                                </View>


                            </View>
                        </View>
                    </Modal>



                </View>



                    {
                        changeMsg=='充值记录'?
                            <View style={{
                                ...Platform.select({
                                    android:{
                                        paddingBottom:260,
                                    },
                                    ios:{
                                        // paddingBottom:270,
                                        paddingBottom:230,
                                    }
                                }),}}>
                                
                                <View>
                                    <FlatList
                                        data={topUpDetail}  //列表的渲染数据源
                                        ListEmptyComponent={()=><View style={{marginTop:30,alignItems:"center"}}><Text>{this.state.aa?this.state.message1:'获取充值记录中'}</Text></View>} //列表没有数据时展示，箭头函数中可以写一个react组件
                                        getItemLayout={(data, index) => ( {length: 80, offset: 80 * index, index} )}
                                        initialNumToRender={10}  //首次渲染的条数
                                        onEndReached={()=>{this.onEndReached(1)}} //列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
                                        onEndReachedThreshold={0.1} //定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                                        onRefresh={this.onRefresh} //下拉刷新
                                        refreshing={refreshing} //下拉刷新时候的正在加载的符号，设置为true显示，false隐藏。加载完成，需要设置为false
                                        keyExtractor={(item,index)=>`${index}`}
                                        renderItem={({item}) => (  //渲染列表的方式

                                            <View style={[styles.d,styles.e,]}>

                                                <View style={[{flex:3,alignItems:"center",justifyContent:"center"}]}>
                                                    <Text>{item.rechargeNo}</Text>
                                                    <Text style={{marginTop:5,color:"grey"}}>{item.createTime}</Text>
                                                </View>


                                                <View style={[{flex:2,alignItems:"center",justifyContent:"center"}]}>
                                                    <Text style={{color:"grey"}}>{item.payType}</Text>
                                                    <Text  style={{marginTop:5,fontSize:18,color:"orange"}}>{item.amount}元</Text>
                                                </View>

                                                <View style={[{flex:3,alignItems:"center",justifyContent:"center"}]}>
                                                    <Text>{item.alipayNo}</Text>
                                                    <Text style={{marginTop:5,color:"grey"}}>{item.tradeNo}</Text>
                                                </View>

                                            </View>


                                        )}
                                    />
                                </View>
                            </View>
                            :
                            <View style={{
                                ...Platform.select({
                                    android:{
                                        paddingBottom:185,
                                    },
                                    ios:{
                                        // paddingBottom:230,
                                        paddingBottom:155,
                                    }
                                }),}}>
                                <View>
                                    <FlatList
                                        data={withdrawalDetail}  //列表的渲染数据源
                                        ListEmptyComponent={()=><View style={{marginTop:30,alignItems:"center"}}><Text>{this.state.aa?this.state.message2:'获取提现记录中'}</Text></View>} //列表没有数据时展示，箭头函数中可以写一个react组件
                                        getItemLayout={(data, index) => ( {length: 80, offset: 80 * index, index} )}
                                        initialNumToRender={10}  //首次渲染的条数
                                        onEndReached={()=>{this.onEndReached()}}  //列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
                                        onEndReachedThreshold={0.1} //定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                                        onRefresh={this.onRefresh} //下拉刷新
                                        refreshing={refreshing} //下拉刷新时候的正在加载的符号，设置为true显示，false隐藏。加载完成，需要设置为false
                                        keyExtractor={(item,index)=>`${index}`}
                                        renderItem={({item}) => (  //渲染列表的方式

                                            <View style={[styles.d,styles.e,]}>

                                                <View style={[{flex:1,alignItems:"center",justifyContent:"center"}]}>
                                                    <View  style={[{alignItems:"center",justifyContent:"center"}]}>
                                                        <Text  style={{marginTop:5,}}>{moment(item.applyTime).format('YYYY-MM-DD')}</Text>
                                                    </View>

                                                </View>


                                                <View style={[{flex:1,alignItems:"center",justifyContent:"center"}]}>
                                                    <Text  style={{fontSize:18,color:"orange"}}>提现{item.amount}元</Text>
                                                    {item.realAmount&&<Text  style={{fontSize:18,color:"orange",marginTop:2}}>到账{item.realAmount}元</Text>}
                                                    {item.confirmTime&&<Text  style={{color:"grey",marginTop:2}}>到账时间{item.confirmTime}</Text>}
                                                </View>


                                                <View style={[{flex:1,alignItems:"center",justifyContent:"center"}]}>
                                                    <Text>{item.bankName}</Text>
                                                    <Text style={{marginTop:5,color:"grey"}}>{item.bankNo}</Text>
                                                </View>


                                                <TouchableHighlight underlayColor="transparent" style={[{flex:1}]} onPress={()=>{this.setDetail(item)}}>
                                                    <View style={[{alignItems:"center",justifyContent:"center"}]}>
                                                        <Text>{item.flag==1?'申请提现':'确认到账'}</Text>
                                                        <Text style={{marginTop:5,color:"red"}}>查看详情>></Text>
                                                    </View>
                                                </TouchableHighlight>





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
    f:{
        flex:1,color:"grey"
    },

    fontcolor:{
        color:"grey"
    }


});

