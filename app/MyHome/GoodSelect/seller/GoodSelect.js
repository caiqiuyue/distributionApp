import React,{Component} from 'react';
import {
    Linking, DeviceEventEmitter, View, Text, Image, TextInput, Modal, Platform, StyleSheet, FlatList, ScrollView,
    TouchableHighlight, Dimensions, Keyboard,Alert
} from 'react-native';

import close from "../../HomePage/style/close.png";
import s1 from "../../HomePage/style/234.png";
import topBg from "../../HomePage/style/topBg.png";

import {Picker,DatePicker,Toast} from 'antd-mobile'
import axios from "../../../axios";
import PayComponents from "../../HomePage/buyers/payComponents";
import moment from "moment";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setHotelNo} from "../../../components/active/reducer";
import LinearGradient from 'react-native-linear-gradient';
const RoomInfo = props => {
    return (
        <TouchableHighlight style={{}} underlayColor="transparent" onPress={props.onClick}>

            <View style={{backgroundColor:"#fff",flexDirection:"row",width:"100%",borderColor:"#ccc",borderWidth:1,borderRadius:15,overflow:'hidden'}}>
                <View style={{flex:3,padding:8}}><Text>{props.extra}</Text></View>
                <View style={{flex:1,padding:8,backgroundColor:'#f96f59',alignItems:"center",justifyContent:"center",borderColor:"#f96f59",borderWidth:1,}}><Image style={{height:10,width:15}} source={s1}/></View>
            </View>
        </TouchableHighlight>
    )
};


const RoomInfo2 = props => {
    return (
        <TouchableHighlight style={{}} underlayColor="transparent" onPress={props.onClick}>

            <View style={{backgroundColor:"#fff",flexDirection:"row",width:"100%",borderColor:"#ccc",borderWidth:1,borderRadius:5,overflow:'hidden'}}>
                <View style={{flex:3,padding:8}}><Text style={{color:"grey"}}>{props.extra}</Text></View>
                <View style={{flex:1,padding:8,backgroundColor:'#ccc',alignItems:"center",justifyContent:"center",borderColor:"#ccc",borderWidth:1,}}><Image style={{height:10,width:15}} source={s1}/></View>
            </View>
        </TouchableHighlight>
    )
};




 class GoodSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            handelMsg:[
                {
                    value:"未完成订单",
                    flag:true
                },

                {
                    value:"已完成订单",
                    flag:false
                },

            ],

            changeMsg:"未完成订单",
            pages:1,
            orderState:1,
            unfinished:[],
            finished:[],
            refreshing:false,
            noData:false,
            details:{},
            modal:"",
            templateListValue:[],
            templateList:[],
            animationType: 'none',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示
            reason:null,
            matchNum:null,
            postNo:null,
            orderStatus:[

                {
                    label:"全部",
                    value:''
                },

                {
                    label:"待接单",
                    value:'1'
                },

                {
                    label:"待配货",
                    value:'2'
                },
                {
                    label:"待发货",
                    value:'3'
                },
                {
                    label:"待回款",
                    value:'4'
                },


            ],
            ordStatu:['']


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




     //获取未完成
     getBuyerOrder = ()=>{

         this.setState({
             refreshing:false,
         })


         axios.post(`/order/getSellerOrder`,
             {
                 current:1,
                 pageSize:10,
                 status:this.state.ordStatu[0]-0
             },

         )
             .then((response) =>{
                 console.log(response);
                 this.setState({
                     aa:true,
                     bb:true,

                 },()=>{
                     if(response.data.code==0){

                         this.setState({
                             unfinished:response.data.data.orderList?response.data.data.orderList.filter(item=> {return item.orderState!=7}):[],
                             // finished:response.data.data.orderList?response.data.data.orderList.filter(item=> {return item.orderState==7}):[],
                         })
                     }else{
                         Toast.info(response.data.message,1)
                     }
                 })



             })
             .catch(function (error) {
                 console.log(error);
             })
     }

     //已完成
     getSellerOrder = ()=>{


         this.setState({
             refreshing:false,
         })
         axios.post(`/order/getSellerOrder`,
             {
                 current:1,
                 pageSize:10,
                 status:5
             },

         )
             .then((response) =>{
                 console.log(response);
                 this.setState({
                     aa:true,
                     bb:true,

                 },()=>{
                     if(response.data.code==0){

                         this.setState({
                             // unfinished:response.data.data.orderList?response.data.data.orderList.filter(item=> {return item.orderState!=7}):[],
                             finished:response.data.data.orderList?response.data.data.orderList:[],
                         })
                     }else{
                         Toast.info(response.data.message,1)
                     }
                 })



             })
             .catch(function (error) {
                 console.log(error);
             })
     }

     componentWillMount() {
         this.getBuyerOrder()
         this.getSellerOrder()

     }


     details=(item)=>{
         this.setState({
             details: item,
             modalVisible: true,
             modal:"查看详情"

         },()=>{
             let  {details} = this.state
             axios.get(`/order/orderPayView`,
                 {
                     parentId:item.parentId,
                 },

             )
                 .then((response) =>{
                     console.log(response);
                     if(response.data.code==0){
                         details.addressItem = response.data.data.address
                         this.setState({
                             details
                         })
                     }

                 })
                 .catch(function (error) {
                     console.log(error);
                 })
         })
     }


     setOrdStatu=(ordStatu)=>{
         this.setState({
             ordStatu
         },()=>{
             this.getBuyerOrder()
         })

    }

     onEndReached = ()=>{
         let {pages,unfinished,finished,noData} = this.state;


         if(!noData){
             this.setState({
                 pages:pages+1
             },()=>{
                 axios.post(`/order/getSellerOrder`,
                     {
                         current:this.state.pages,
                         pageSize:10,
                         status:this.state.ordStatu[0]-0
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

                                 if(response.data.data.orderList.length==0){
                                     this.setState({
                                         noData:true
                                     })
                                 }else{
                                     this.setState({
                                         unfinished:[...unfinished,...(response.data.data.orderList?response.data.data.orderList.filter(item=> {return item.orderState!=7}):[])],
                                         // finished:[...finished,...(response.data.data.orderList?response.data.data.orderList.filter(item=> {return item.orderState==7}):[])],
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


                 axios.post(`/order/getSellerOrder`,
                     {
                         current:this.state.pages,
                         pageSize:10,
                         status:5
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

                                 if(response.data.data.orderList.length==0){
                                     this.setState({
                                         noData:true
                                     })
                                 }else{
                                     this.setState({
                                         // unfinished:[...unfinished,...(response.data.data.orderList?response.data.data.orderList.filter(item=> {return item.orderState!=7}):[])],
                                         finished:[...finished,...(response.data.data.orderList?response.data.data.orderList:[])],
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


     onRefresh = ()=>{

         this.setState({
             refreshing:true,
         },()=>{
             this.getBuyerOrder()
             this.getSellerOrder()

         })
     }


     //接单
     submitPay = ()=>{
         Alert.alert('接单','确定接单吗',
             [
                 {text:"取消", onPress:this.cancelSelected},
                 {text:"确认", onPress:this.acceptOrder}
             ],
             { cancelable: false }
         );
     }



     //配货
     matchOrSendGoods1 = ()=>{
         if(!this.state.matchNum){
             alert('请输入配货数量')
             return
         }


         if(this.state.matchNum>this.state.details.goodsNum){
             alert('配货数量不能大于商品购买数量')
             return
         }

         this.setState({
             modalVisible:false
         },()=>{
             axios.post(`/order/matchOrSendGoods`,{
                 orderId:this.state.details.orderId,
                 type:1,
                 matchNum:this.state.matchNum
             },)
                 .then((response) =>{
                     console.log(response);

                     this.onRefresh()

                     Toast.info(response.data.code==0?'配货成功':response.data.message,1)
                 })
                 .catch(function (error) {
                     console.log(error);
                 })
         })
     }


     matchOrSendGoods2 = ()=>{
         if(!this.state.postNo){
             alert('请输入快递单号')
             return
         }



         this.setState({
             modalVisible:false
         },()=>{
             axios.post(`/order/matchOrSendGoods`,{
                 orderId:this.state.details.orderId,
                 type:2,
                 postNo:this.state.postNo,
                 postId:this.state.templateListValue[0]-0,
                 postName:this.state.templateList(_item=>_item.value==this.state.templateListValue[0])[0].label,
             },)
                 .then((response) =>{
                     console.log(response);

                     this.onRefresh()

                     Toast.info(response.data.code==0?'成功':response.data.message,1)
                 })
                 .catch(function (error) {
                     console.log(error);
                 })
         })
     }



     //发货弹框
     getPostageTemplate = ()=>{

         this.setState({
             modal:'发货'
         },()=>{
             axios.get(`/goods/getPostageTemplate`,{
                 isEnable:1
             })
                 .then((response) =>{
                     console.log(response,'查询快递模版');

                     if(response.data.code==0){

                         let templateList = []
                         let templateListValue = []

                         let data = response.data.data.templateList

                         data && data.map(item=>{
                             let a = {
                                     value:item.postId+'',
                                     label:item.postName,
                             }

                             templateList.push(a)

                             if(this.state.details.postName==item.postName){

                                 templateListValue[0] = item.postId+''
                             }

                         })


                         this.setState({
                             templateList,templateListValue
                         })

                     }

                 })
                 .catch((error)=> {
                     console.log(error);

                 })
         })


     }


     cancelSelected = ()=>{}


     //确定接单
     acceptOrder = ()=>{
         this.setState({
             modalVisible:false
         },()=>{
             axios.get(`/order/updateOrderState`,{
                 orderId:this.state.details.orderId,
                 status:4,
                 reason:this.state.reason
             },)
                 .then((response) =>{
                     console.log(response);

                     this.onRefresh()

                     Toast.info(response.data.code==0?'接单成功':response.data.message,1)
                 })
                 .catch(function (error) {
                     console.log(error);
                 })
         })

     }


     //取消订单
     cancelOrder = (item) => {


         this.setState({
             modalVisible:false
         },()=>{
             axios.get(`/order/updateOrderState`,{
                 orderId:this.state.details.orderId,
                 status:this.state.orderState,
                 reason:this.state.reason
             },)
                 .then((response) =>{
                     console.log(response);

                     this.onRefresh()

                     Toast.info(response.data.code==0?'取消成功':response.data.message,1)
                 })
                 .catch(function (error) {
                     console.log(error);
                 })
         })


     }

    render(){

        let {ordStatu,details,refreshing,finished,unfinished,handelMsg,changeMsg} = this.state

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
                <View>
                    <Image source={topBg} style={{height:70,width:Dimensions.get('window').width,resizeMode:"stretch"}} />
                </View>

                <View style={{borderTopColor:"#f96f59",borderTopWidth:1,flexDirection:"row",justifyContent:"space-around"}}>
                    {
                        handelMsg.map((item,index)=>

                            <LinearGradient key={index} colors={[!item.flag?'#f96f59':"#fff", !item.flag?'#f94939':"#fff"]} style={{width:"50%",}}>
                                <TouchableHighlight   onPress={()=>this.handelMsg(item)} style={{padding:10,alignItems:"center",
                                    // backgroundColor:!item.flag?"#f6f8fa":"#fff",
                                    borderBottomWidth:1,
                                    borderBottomColor:"#f96f59",
                                }} underlayColor="transparent" >

                                    <Text style={{color:!item.flag?"#fff":"#f94939",fontWeight:"bold"}}>{item.value}</Text>
                                </TouchableHighlight>
                            </LinearGradient>
                        )
                    }
                </View>



                    {
                        changeMsg=='未完成订单'?
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


                                <View style={{width:"50%",marginTop:5}}>
                                    <Picker
                                        data={this.state.orderStatus}
                                        cols={1}
                                        value={ordStatu}
                                        // extra='请选择上户人'
                                        // onChange={(data) => {this.setCity(data)}}
                                        onChange={ordStatu => {this.setOrdStatu(ordStatu)}}
                                        // onOk={data => {this.setState({sale:data})}}
                                        className="forss">
                                        <RoomInfo></RoomInfo>
                                    </Picker>
                                </View>



                                <View>
                                    <FlatList
                                        data={unfinished}  //列表的渲染数据源
                                        ListEmptyComponent={()=><View style={{marginTop:30,alignItems:"center"}}><Text>{this.state.aa?'暂无未完成订单':'获取未完成订单数据中'}</Text></View>} //列表没有数据时展示，箭头函数中可以写一个react组件
                                        getItemLayout={(data, index) => ( {length: 80, offset: 80 * index, index} )}
                                        initialNumToRender={10}  //首次渲染的条数
                                        onEndReached={()=>{this.onEndReached()}} //列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
                                        onEndReachedThreshold={0.1} //定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                                        onRefresh={this.onRefresh} //下拉刷新
                                        refreshing={refreshing} //下拉刷新时候的正在加载的符号，设置为true显示，false隐藏。加载完成，需要设置为false
                                        keyExtractor={(item,index)=>`${index}`}
                                        renderItem={({item}) => (  //渲染列表的方式

                                            <TouchableHighlight underlayColor="transparent" onPress={()=>{this.details(item)}}>
                                                <View style={[styles.d,styles.e,]}>

                                                    <View  style={[{flex:3,alignItems:"center",justifyContent:"center"}]}>
                                                        <Text style={{fontSize:18,fontWeight:"bold"}}>{item.goodsNo}</Text>
                                                        <Text  style={{marginTop:5,}}>{moment(item.createTime).format('YYYY-MM-DD')}</Text>

                                                    </View>



                                                    <View style={[{flex:1,alignItems:"center",justifyContent:"center"}]}>
                                                        <Text>{item.modelName}</Text>
                                                        <Text  style={{marginTop:5,}}>{item.goodsNum}件</Text>
                                                    </View>


                                                    <View style={[{flex:2,alignItems:"center",justifyContent:"center"}]}>
                                                        <Text style={{color:"grey"}}>总价</Text>
                                                        <Text  style={{marginTop:5,fontSize:18,color:"orange"}}>{item.goodsAmount}元</Text>
                                                    </View>

                                                    <View style={[{flex:2,alignItems:"center",justifyContent:"center"}]}>
                                                        <Text>{item.consignee}</Text>
                                                    </View>

                                                    <View style={[{flex:2,alignItems:"center",justifyContent:"center"}]}>
                                                        <Text>{item.orderState==-1?'删除':item.orderState==1?'买家新建':item.orderState==2?'卖家反馈中':item.orderState==3?'买家撤销':item.orderState==4?'卖家接受':item.orderState==5?'卖家拒绝':item.orderState==6?'订单异议':'订单关闭'}</Text>
                                                        <Text style={{marginTop:5,color:"red"}}>{item.capitalState==0?'待支付':item.capitalState==1?'买家已付款':item.capitalState==2?'平台托管':item.capitalState==3?'平台解付中':item.capitalState==4?'卖家已收款':item.capitalState==5?'卖家已退款':item.capitalState==6?'平台托管':item.capitalState==7?'平台解付':'买家已退款'}

                                                            <Text>></Text>

                                                        </Text>
                                                    </View>




                                                </View>
                                            </TouchableHighlight>


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
                                        data={finished}  //列表的渲染数据源
                                        ListEmptyComponent={()=><View style={{marginTop:30,alignItems:"center"}}><Text>{this.state.aa?'暂无已完成订单':'获取已完成订单数据中'}</Text></View>} //列表没有数据时展示，箭头函数中可以写一个react组件
                                        getItemLayout={(data, index) => ( {length: 80, offset: 80 * index, index} )}
                                        initialNumToRender={10}  //首次渲染的条数
                                        onEndReached={()=>{this.onEndReached()}}  //列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
                                        onEndReachedThreshold={0.1} //定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                                        onRefresh={this.onRefresh} //下拉刷新
                                        refreshing={refreshing} //下拉刷新时候的正在加载的符号，设置为true显示，false隐藏。加载完成，需要设置为false
                                        keyExtractor={(item,index)=>`${index}`}
                                        renderItem={({item}) => (  //渲染列表的方式

                                            <TouchableHighlight underlayColor="transparent" onPress={()=>{this.details(item)}}>


                                                <View style={[styles.d,styles.e,]}>

                                                    <View  style={[{flex:3,alignItems:"center",justifyContent:"center"}]}>
                                                        <Text style={{fontSize:18,fontWeight:"bold"}}>{item.goodsNo}</Text>
                                                        <Text  style={{marginTop:5,}}>{moment(item.createTime).format('YYYY-MM-DD')}</Text>

                                                    </View>



                                                    <View style={[{flex:1,alignItems:"center",justifyContent:"center"}]}>
                                                        <Text>{item.modelName}</Text>
                                                        <Text  style={{marginTop:5,}}>{item.goodsNum}件</Text>
                                                    </View>


                                                    <View style={[{flex:2,alignItems:"center",justifyContent:"center"}]}>
                                                        <Text style={{color:"grey"}}>总价</Text>
                                                        <Text  style={{marginTop:5,fontSize:18,color:"orange"}}>{item.goodsAmount}元</Text>
                                                    </View>

                                                    <View style={[{flex:2,alignItems:"center",justifyContent:"center"}]}>
                                                        <Text>{item.consignee}</Text>
                                                    </View>


                                                    <View style={[{flex:2,alignItems:"center",justifyContent:"center"}]}>
                                                        <Text style={{color:"red"}}>已完成></Text>
                                                    </View>




                                                </View>

                                            </TouchableHighlight>
                                        )}
                                    />
                                </View>
                            </View>
                    }







                <View>

                    <Modal
                        animationType={this.state.animationType}
                        transparent={this.state.transparent}
                        visible={this.state.modalVisible}

                        onRequestClose={() => { this._setModalVisible(false) } }

                    >
                        <View style={[styles.container,modalBackgroundStyle]}>
                            <View style={[styles.innerContainer,innerContainerTransparentStyle]}>


                                {
                                    <View>
                                        <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>

                                            <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}>{this.state.modal=='查看详情'?'查看详情':this.state.modal=='取消订单'?'取消订单':this.state.modal=='配货'?'配货':"发货"}</Text></View>



                                            <TouchableHighlight underlayColor={"#fff"} onPress={this._setModalVisible.bind(this,false) } style={{}}>
                                                <Image style={{height:30,width:30}} source={close}/>
                                            </TouchableHighlight>

                                        </View>



                                            {
                                                this.state.modal=='查看详情'?

                                                    <View style={{padding:10}}>

                                                        <ScrollView style={{maxHeight:Dimensions.get('window').height-200}}>

                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>订单号:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.orderNo}</Text>
                                                                </View>
                                                            </View>

                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>订单时间:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{moment(details.createTime).format('YYYY-MM-DD hh:mm:ss')}</Text>
                                                                </View>
                                                            </View>



                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>仓库:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.channelName}</Text>
                                                                </View>
                                                            </View>

                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>订单总金额:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1,color:"orange",fontSize:18,fontWeight:"bold"}}>{details.goodsAmount}元</Text>
                                                                </View>
                                                            </View>


                                                            <View style={{borderLeftWidth:3,borderLeftColor:'#f96f59',marginTop:15}}>
                                                                <Text style={{fontSize:20,fontWeight:'bold',paddingLeft:10}}>商品信息</Text>
                                                            </View>

                                                            <View style={{width:"100%",height:1,backgroundColor:"#ffdac7",marginTop:10}}></View>


                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>货号:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.goodsNo}</Text>
                                                                </View>
                                                            </View>

                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>商品型号:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.modelName}</Text>
                                                                </View>
                                                            </View>

                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>商品数量:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.goodsNum}</Text>
                                                                </View>
                                                            </View>


                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>商品单价:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.goodsPrice}元</Text>
                                                                </View>
                                                            </View>


                                                            <View style={{borderLeftWidth:3,borderLeftColor:'#f96f59',marginTop:15}}>
                                                                <Text style={{fontSize:20,fontWeight:'bold',paddingLeft:10}}>快递信息</Text>
                                                            </View>

                                                            <View style={{width:"100%",height:1,backgroundColor:"#ffdac7",marginTop:10}}></View>



                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>收货人:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.consignee}</Text>
                                                                </View>
                                                            </View>

                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>地址:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.addressItem&&details.addressItem.address}</Text>
                                                                </View>
                                                            </View>

                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>手机号:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.addressItem&&details.addressItem.phone}</Text>
                                                                </View>
                                                            </View>


                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>邮费:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.postFee}元</Text>
                                                                </View>
                                                            </View>



                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>快递名称:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.postName}</Text>
                                                                </View>
                                                            </View>

                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>快递编号:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.postNo}</Text>
                                                                </View>
                                                            </View>

                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>快递策略:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.postFlag==1?'默认快递':'最低价格'}</Text>
                                                                </View>
                                                            </View>


                                                            <View style={{borderLeftWidth:3,borderLeftColor:'#f96f59',marginTop:15}}>
                                                                <Text style={{fontSize:20,fontWeight:'bold',paddingLeft:10}}>状态信息</Text>
                                                            </View>

                                                            <View style={{width:"100%",height:1,backgroundColor:"#ffdac7",marginTop:10}}></View>



                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>配货状态:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.goodsState==0?"待配货": details.goodsState==1?"部分配货" :details.goodsState==2?"完全配货":"无货"}</Text>
                                                                </View>
                                                            </View>

                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>货运状态:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.postState==0?"待发货": details.postState==1?"发货中" :details.postState==2?"确认收货":details.postState==3?"退货中":"确认退货"}</Text>
                                                                </View>
                                                            </View>

                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>订单状态:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.orderState==-1?'删除':details.orderState==1?'买家新建':details.orderState==2?'卖家反馈中':details.orderState==3?'买家撤销':details.orderState==4?'卖家接受':details.orderState==5?'卖家拒绝':details.details==6?'订单异议':details.details==7?'订单完成':'订单关闭'}</Text>
                                                                </View>
                                                            </View>

                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>资金状态:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.capitalState==0?'待支付':details.capitalState==1?'买家已付款':details.capitalState==2?'平台托管':details.capitalState==3?'平台解付中':details.capitalState==4?'卖家已收款':details.capitalState==5?'卖家已退款':details.capitalState==6?'平台托管':details.capitalState==7?'平台解付':'买家已退款'}</Text>
                                                                </View>
                                                            </View>
                                                        </ScrollView>

                                                        {details.capitalState==1&&
                                                        <View style={{alignItems:"center",justifyContent:"space-around",marginTop:20,flexDirection:"row"}}>
                                                            <TouchableHighlight onPress={this.submitPay} underlayColor="#f96f59" style={{width:100,padding:10,backgroundColor:"orange",borderRadius:5,alignItems:"center",justifyContent:"center",}}>
                                                                <Text style={{color:"#fff"}}>接单</Text>
                                                            </TouchableHighlight>

                                                            <TouchableHighlight onPress={()=>{this.setState({modal:'取消订单',orderState:5})}} underlayColor="#f96f59" style={{width:100,padding:10,backgroundColor:"orange",borderRadius:5,alignItems:"center",justifyContent:"center",}}>
                                                                <Text style={{color:"#fff"}}>拒单</Text>
                                                            </TouchableHighlight>

                                                        </View>}


                                                        {details.goodsState==0&&details.capitalState==2&&
                                                        <View style={{alignItems:"center",justifyContent:"space-around",marginTop:20,flexDirection:"row"}}>
                                                            <TouchableHighlight onPress={()=>{this.setState({modal:'配货'})}} underlayColor="#f96f59" style={{width:100,padding:10,backgroundColor:"orange",borderRadius:5,alignItems:"center",justifyContent:"center",}}>
                                                                <Text style={{color:"#fff"}}>配货</Text>
                                                            </TouchableHighlight>


                                                        </View>}

                                                        {((details.goodsState==1 ||details.goodsState==2) && details.capitalState==2 && details.postState==0)&&
                                                        <View style={{alignItems:"center",justifyContent:"space-around",marginTop:20,flexDirection:"row"}}>
                                                            <TouchableHighlight onPress={this.getPostageTemplate} underlayColor="#f96f59" style={{width:100,padding:10,backgroundColor:"orange",borderRadius:5,alignItems:"center",justifyContent:"center",}}>
                                                                <Text style={{color:"#fff"}}>发货</Text>
                                                            </TouchableHighlight>


                                                        </View>}

                                                    </View>:

                                                    this.state.modal=='取消订单'?
                                                        <ScrollView style={{maxHeight:Dimensions.get('window').height-200}}>
                                                            <View style={{padding:10}}>

                                                                <Text style={{marginTop:10}}>确定要拒绝吗？</Text>



                                                                <View style={styles.a}>
                                                                    <Text style={styles.f}>原因:</Text>
                                                                    <View style={[styles.b,{flex:3}]}>
                                                                        <TextInput
                                                                            placeholder={'请填写拒绝原因'}
                                                                            multiline={true}
                                                                            style={[styles.teCor,{height:100,}]}
                                                                            underlineColorAndroid="transparent"
                                                                            onChangeText={(reason) => this.setState({reason})}
                                                                        />
                                                                    </View>
                                                                </View>


                                                                <View style={{alignItems:"center",justifyContent:"center",marginTop:20}}>
                                                                    <TouchableHighlight onPress={()=>{this.cancelOrder()}} underlayColor="#f96f59" style={{width:100,padding:10,backgroundColor:"orange",borderRadius:5,alignItems:"center",justifyContent:"center",}}>
                                                                        <Text style={{color:"#fff"}}>确定</Text>
                                                                    </TouchableHighlight>
                                                                </View>

                                                            </View>
                                                        </ScrollView>

                                                    :this.state.modal=='配货'?

                                                        <View style={{padding:10}}>

                                                            <ScrollView style={{maxHeight:Dimensions.get('window').height-200}}>


                                                                <View style={{borderLeftWidth:3,borderLeftColor:'#f96f59',marginTop:15}}>
                                                                    <Text style={{fontSize:20,fontWeight:'bold',paddingLeft:10}}>商品信息</Text>
                                                                </View>

                                                                <View style={{width:"100%",height:1,backgroundColor:"#ffdac7",marginTop:10}}></View>


                                                                <View style={styles.a}>
                                                                    <Text style={styles.f}>货号:</Text>
                                                                    <View style={[styles.b,{flex:3}]}>
                                                                        <Text style={{flex:1}}>{details.goodsNo}</Text>
                                                                    </View>
                                                                </View>

                                                                <View style={styles.a}>
                                                                    <Text style={styles.f}>商品型号:</Text>
                                                                    <View style={[styles.b,{flex:3}]}>
                                                                        <Text style={{flex:1}}>{details.modelName}</Text>
                                                                    </View>
                                                                </View>

                                                                <View style={styles.a}>
                                                                    <Text style={styles.f}>商品数量:</Text>
                                                                    <View style={[styles.b,{flex:3}]}>
                                                                        <Text style={{flex:1}}>{details.goodsNum}</Text>
                                                                    </View>
                                                                </View>


                                                                <View style={styles.a}>
                                                                    <Text style={styles.f}>商品单价:</Text>
                                                                    <View style={[styles.b,{flex:3}]}>
                                                                        <Text style={{flex:1}}>{details.goodsPrice}元</Text>
                                                                    </View>
                                                                </View>

                                                                <View style={styles.a}>
                                                                    <Text style={styles.f}>配货:</Text>
                                                                    <View style={[styles.b,{flex:3}]}>
                                                                        <TextInput
                                                                            placeholder={'请填写配货数量'}
                                                                            style={[styles.teCor,]}
                                                                            underlineColorAndroid="transparent"
                                                                            onChangeText={(matchNum) => this.setState({matchNum})}
                                                                        />
                                                                    </View>
                                                                </View>

                                                            </ScrollView>



                                                            <View style={{alignItems:"center",justifyContent:"space-around",marginTop:20,flexDirection:"row"}}>
                                                                <TouchableHighlight onPress={this.matchOrSendGoods1} underlayColor="#f96f59" style={{width:100,padding:10,backgroundColor:"orange",borderRadius:5,alignItems:"center",justifyContent:"center",}}>
                                                                    <Text style={{color:"#fff"}}>配货</Text>
                                                                </TouchableHighlight>

                                                            </View>


                                                        </View>:

                                                        <View style={{padding:10}}>

                                                            <ScrollView style={{maxHeight:Dimensions.get('window').height-200}}>


                                                                <View style={{borderLeftWidth:3,borderLeftColor:'#f96f59',marginTop:15}}>
                                                                    <Text style={{fontSize:20,fontWeight:'bold',paddingLeft:10}}>商品信息</Text>
                                                                </View>

                                                                <View style={{width:"100%",height:1,backgroundColor:"#ffdac7",marginTop:10}}></View>


                                                                <View style={styles.a}>
                                                                    <Text style={styles.f}>货号:</Text>
                                                                    <View style={[styles.b,{flex:3}]}>
                                                                        <Text style={{flex:1}}>{details.goodsNo}</Text>
                                                                    </View>
                                                                </View>

                                                                <View style={styles.a}>
                                                                    <Text style={styles.f}>商品型号:</Text>
                                                                    <View style={[styles.b,{flex:3}]}>
                                                                        <Text style={{flex:1}}>{details.modelName}</Text>
                                                                    </View>
                                                                </View>

                                                                <View style={styles.a}>
                                                                    <Text style={styles.f}>商品数量:</Text>
                                                                    <View style={[styles.b,{flex:3}]}>
                                                                        <Text style={{flex:1}}>{details.goodsNum}</Text>
                                                                    </View>
                                                                </View>


                                                                <View style={styles.a}>
                                                                    <Text style={styles.f}>商品单价:</Text>
                                                                    <View style={[styles.b,{flex:3}]}>
                                                                        <Text style={{flex:1}}>{details.goodsPrice}元</Text>
                                                                    </View>
                                                                </View>



                                                                <View style={styles.a}>
                                                                    <Text style={styles.f}>快递:</Text>

                                                                    <View style={[styles.b,{flex:3}]}>
                                                                        <Picker
                                                                            data={this.state.templateList}
                                                                            cols={1}
                                                                            extra={'请选择快递'}
                                                                            value={this.state.templateListValue}
                                                                            onChange={value => {this.setState({templateListValue:value})}}
                                                                            className="forss">
                                                                            <RoomInfo2></RoomInfo2>
                                                                        </Picker>
                                                                    </View>

                                                                </View>

                                                                <View style={styles.a}>
                                                                    <Text style={styles.f}>快递单号:</Text>
                                                                    <View style={[styles.b,{flex:3}]}>
                                                                        <TextInput
                                                                            placeholder={'请填写快递单号'}
                                                                            style={[styles.teCor,]}
                                                                            underlineColorAndroid="transparent"
                                                                            onChangeText={(postNo) => this.setState({postNo})}
                                                                        />
                                                                    </View>
                                                                </View>

                                                            </ScrollView>



                                                            <View style={{alignItems:"center",justifyContent:"space-around",marginTop:20,flexDirection:"row"}}>
                                                                <TouchableHighlight onPress={this.matchOrSendGoods2} underlayColor="#f96f59" style={{width:100,padding:10,backgroundColor:"orange",borderRadius:5,alignItems:"center",justifyContent:"center",}}>
                                                                    <Text style={{color:"#fff"}}>发货</Text>
                                                                </TouchableHighlight>

                                                            </View>


                                                        </View>
                                            }

                                    </View>

                                }


                            </View>
                        </View>
                    </Modal>



                </View>



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

    teCor:{minWidth:'100%',padding:10,backgroundColor:"#fff",borderRadius:5,borderColor:"#ccc",borderWidth:1},



    fontcolor:{
        color:"grey"
    }


});

export default connect (
    state => ({reduxData: state.reduxData}),
    dispath => bindActionCreators({setHotelNo},dispath)
)(GoodSelect);