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

import moment from "moment";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setHotelNo} from "../../../components/active/reducer";
import LinearGradient from 'react-native-linear-gradient';

import select from '../../select.png'

import AddMsg from '../addMsg'
 class GoodSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            handelMsg:[
                {
                    value:"待处理",
                    flag:true
                },

                {
                    value:"已处理",
                    flag:false
                },
                {
                    value:"已拒绝",
                    flag:false
                },

            ],

            changeMsg:"待处理",
            pages1:1,
            pages2:1,
            pages3:1,
            order1:[],
            order2:[],
            order3:[],
            refreshing:false,
            noData1:false,
            noData2:false,
            noData3:false,
            padd:0,
            aa:false,
            bb:false,
            cc:false,
            details:{},
            animationType: 'none',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示
            orderStatus:[

                {
                    label:"全部",
                    value:''
                },

                {
                    label:"待付款",
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
                    label:"待收货",
                    value:'4'
                },


            ],
            ordStatu:[''],
            postName:'',
            postNo:'',
            reply:'',
            modal:"查看详情"


        };


    }


    //查询工单列表
     getSellerOrderService1 = ()=>{
         axios.post(`/order/getSellerOrderService`,
             {
                 current:1,
                 pageSize:50,
                 type:1
             },

         )
             .then((response) =>{
                 console.log(response);
                 this.setState({
                     aa:true,
                     refreshing:false,

                 },()=>{
                     if(response.data.code==0){

                         this.setState({
                             order1:response.data.data.serverList?response.data.data.serverList:[],
                         })
                     }else{
                         Toast.info(response.data.message,1)
                     }
                 })



             })
             .catch( (error)=> {
                 console.log(error);
                 this.setState({refreshing:false})
             })
     }
     getSellerOrderService2 = ()=>{
         axios.post(`/order/getSellerOrderService`,
             {
                 current:1,
                 pageSize:50,
                 type:2
             },

         )
             .then((response) =>{
                 console.log(response);
                 this.setState({
                     bb:true,
                     refreshing:false,

                 },()=>{
                     if(response.data.code==0){

                         this.setState({
                             order2:response.data.data.serverList?response.data.data.serverList:[],
                         })
                     }else{
                         Toast.info(response.data.message,1)
                     }
                 })



             })
             .catch( (error)=> {
                 console.log(error);
                 this.setState({refreshing:false})
             })
     }
     getSellerOrderService3 = ()=>{
         axios.post(`/order/getSellerOrderService`,
             {
                 current:1,
                 pageSize:50,
                 type:3
             },

         )
             .then((response) =>{
                 console.log(response);
                 this.setState({
                     cc:true,
                     refreshing:false,

                 },()=>{
                     if(response.data.code==0){

                         this.setState({
                             order3:response.data.data.serverList?response.data.data.serverList:[],
                         })
                     }else{
                         Toast.info(response.data.message,1)
                     }
                 })



             })
             .catch( (error)=> {
                 console.log(error);
                 this.setState({refreshing:false})
             })
     }


     getAll = ()=>{
        this.getSellerOrderService1()
        this.getSellerOrderService2()
        this.getSellerOrderService3()
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



     componentWillMount() {
         this.getAll()
     }
     componentWillReceiveProps() {
         this.getAll()
     }


     details=(item)=>{

         console.log(item,'1111111111');
         let aaa =JSON.parse(JSON.stringify(item))

         this.setState({
             details: aaa,
             modalVisible: true,
             modal:"查看详情",

         },()=>{
             let  {details} = this.state
             axios.get(`/order/getOrderDetail`,
                 {
                     orderId:item.orderId,
                 },

             )
                 .then((response) =>{
                     console.log(response);
                     if(response.data.code==0){

                         details.backPostNo = aaa.postNo
                         details.backPostName = aaa.postName
                         this.setState({
                             details:Object.assign(details, response.data.data)
                         })
                     }

                 })
                 .catch(function (error) {
                     console.log(error);
                 })
         })
     }


     //确定接受工单
     acceptOrder = ()=>{
         this.setState({
             modalVisible:false
         },()=>{
             axios.post(`/order/sellerReply`,{
                 serviceId:this.state.details.serviceId,
                 type:1,
                 reply:this.state.reply,
                 postNo:this.state.postNo,
                 postName:this.state.postName,
             },)
                 .then((response) =>{
                     console.log(response);

                     this.onRefresh()

                     Toast.info(response.data.code==0?'接受成功':response.data.message,1)
                 })
                 .catch(function (error) {
                     console.log(error);
                 })
         })

     }


     refuseOrder = ()=>{
         this.setState({
             modalVisible:false
         },()=>{
             axios.post(`/order/sellerReply`,{
                 serviceId:this.state.details.serviceId,
                 type:2,
                 reply:this.state.reply
             },)
                 .then((response) =>{
                     console.log(response);

                     this.onRefresh()

                     Toast.info(response.data.code==0?'拒绝成功':response.data.message,1)
                 })
                 .catch(function (error) {
                     console.log(error);
                 })
         })

     }



     //上啦加载
     onEndReached = ()=>{
         let {pages1,pages2,pages3,order1,order2,order3,noData1,noData2,noData3} = this.state;


         if(!noData1){
             this.setState({
                 pages1:pages1+1
             },()=>{
                 axios.post(`/order/getSellerOrderService`,
                     {
                         current:this.state.pages1,
                         pageSize:50,
                         type:1
                     },

                 )
                     .then((response) =>{
                         console.log(response);
                         this.setState({
                             aa:true,
                             refreshing:false,

                         },()=>{
                             if(response.data.code==0){

                                 if(response.data.data.serverList.length==0){
                                     this.setState({
                                         noData1:true
                                     })
                                 }else{
                                     this.setState({
                                         order1:[...order1,...(response.data.data.serverList?response.data.data.serverList:[])],
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
         if(!noData2){
             this.setState({
                 pages2:pages2+1
             },()=>{
                 axios.post(`/order/getSellerOrderService`,
                     {
                         current:this.state.pages2,
                         pageSize:50,
                         type:2
                     },

                 )
                     .then((response) =>{
                         console.log(response);
                         this.setState({
                             bb:true,
                             refreshing:false,

                         },()=>{
                             if(response.data.code==0){

                                 if(response.data.data.serverList.length==0){
                                     this.setState({
                                         noData1:true
                                     })
                                 }else{
                                     this.setState({
                                         order2:[...order2,...(response.data.data.serverList?response.data.data.serverList:[])],
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
         if(!noData3){
             this.setState({
                 pages3:pages3+1
             },()=>{
                 axios.post(`/order/getSellerOrderService`,
                     {
                         current:this.state.pages3,
                         pageSize:50,
                         type:3
                     },

                 )
                     .then((response) =>{
                         console.log(response);
                         this.setState({
                             cc:true,
                             refreshing:false,

                         },()=>{
                             if(response.data.code==0){

                                 if(response.data.data.serverList.length==0){
                                     this.setState({
                                         noData3:true
                                     })
                                 }else{
                                     this.setState({
                                         order3:[...order3,...(response.data.data.serverList?response.data.data.serverList:[])],
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


     //下拉刷新
     onRefresh = ()=>{

         this.setState({
             refreshing:true,noData1:false,noData2:false,noData3:false,pages1:1,pages2:1,pages3:1,
         },()=>{
             this.getAll()
         })
     }

     comfirmSelected = ()=>{
         this.setState({
             modalVisible:false
         },()=>{
             axios.get(`/order/finishOrderServer`,{
                 serviceId:this.state.details.serviceId,
             },)
                 .then((response) =>{
                     console.log(response);

                     this.onRefresh()

                     Toast.info(response.data.code==0?'操作成功':response.data.message,1)
                 })
                 .catch(function (error) {
                     console.log(error);
                 })
         })
     }
     cancelSelected = ()=>{

     }

     finishOrder=(item)=>{

         Alert.alert(`${item?"退款":"退货退款"}`,`确定${item?"退款":"退货退款"}吗？`,
             [
                 {text:"取消", onPress:this.cancelSelected},
                 {text:"确认", onPress:this.comfirmSelected}
             ],
             { cancelable: false }
         );

     }

     focus=()=>{

         this.setState({
             padd:300,
         })
     }

    render(){

        let {order3,details,refreshing,order1,order2,handelMsg,changeMsg} = this.state

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

                            <LinearGradient key={index} colors={[item.flag?'#f96f59':"#fff", item.flag?'#f94939':"#fff"]} style={{width:"33.33%",}}>
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


                                {
                                    <View>
                                        <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>

                                            <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}>{this.state.modal=='查看详情'?'查看详情':this.state.modal=='取消订单'?'取消订单':this.state.modal=='配货'?'配货':"处理"}</Text></View>



                                            <TouchableHighlight underlayColor={"#fff"} onPress={this._setModalVisible.bind(this,false) } style={{}}>
                                                <Image style={{height:30,width:30}} source={close}/>
                                            </TouchableHighlight>

                                        </View>



                                        {
                                            this.state.modal=='查看详情'?

                                                <View style={{padding:10}}>
                                                    <View>
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
                                                                    <Text style={{flex:1}}>{moment(details.createTime).format('YYYY-MM-DD HH:mm:ss')}</Text>
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
                                                                <Text style={styles.f}>商品尺码:</Text>
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
                                                                <Text style={styles.f}>商品系列:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.series}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>商品季节:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.season=='spring'?'春季':details.season=='summer'?'夏季':details.season=='winter'?'冬季':'秋季'}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>商品颜色:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.color}</Text>
                                                                </View>
                                                            </View>

                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>鉴定费:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.authenticateFee}元</Text>
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
                                                                <Text style={styles.f}>退货电话:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.sellerTel}</Text>
                                                                </View>
                                                            </View>

                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>退货地址:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.sellerAddress}</Text>
                                                                </View>
                                                            </View>

                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>退货快递单号:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.backPostNo}</Text>
                                                                </View>
                                                            </View>


                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>退货快递名称:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.backPostName}</Text>
                                                                </View>
                                                            </View>



                                                            <View style={{borderLeftWidth:3,borderLeftColor:'#f96f59',marginTop:15}}>
                                                                <Text style={{fontSize:20,fontWeight:'bold',paddingLeft:10}}>状态信息</Text>
                                                            </View>

                                                            <View style={{width:"100%",height:1,backgroundColor:"#ffdac7",marginTop:10}}></View>



                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>服务状态:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.serviceStatus==0?"未受理": details.serviceStatus==1?"受理中":details.serviceStatus==2?"已受理":details.serviceStatus==4?"工单关闭":"平台接管"}</Text>
                                                                </View>
                                                            </View>

                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>配货状态:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.goodsState==0?"待配货": details.goodsState==1?"部分配货" :details.goodsState==2?"完全配货":"无货"}</Text>
                                                                </View>
                                                            </View>

                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>货运状态:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.postState==0?"待发货": details.postState==1?"发货中" :details.postState==2?"确认收货":details.postState==3?"退货中":details.postState==-3?"审核失败":details.postState==-2?"待审核":details.postState==-1?"待上传留底":"确认退货"}</Text>
                                                                </View>
                                                            </View>

                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>订单状态:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.orderState==-1?'删除':details.orderState==1?'买家新建':details.orderState==2?'卖家反馈中':details.orderState==3?'买家撤销':details.orderState==4?'卖家接受':details.orderState==5?'卖家拒绝':details.orderState==6?'订单异议':details.orderState==7?'订单完成':'订单关闭'}</Text>
                                                                </View>
                                                            </View>

                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>资金状态:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.capitalState==0?'待支付':details.capitalState==1?'买家已付款':details.capitalState==2?'平台托管':details.capitalState==3?'平台解付中':details.capitalState==4?'卖家已收款':details.capitalState==5?'卖家已退款':details.capitalState==6?'平台托管':details.capitalState==7?'平台解付':'买家已退款'}</Text>
                                                                </View>
                                                            </View>

                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>处理方式:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.processType==1?"退货退款": details.processType==2?"仅退款":"补发货"}</Text>
                                                                </View>
                                                            </View>

                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>问题类型:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text  style={{flex:1}}>{details.problemType==1?'无理由退货':details.problemType==2?'实物不符':details.problemType==3?'货物破损':details.problemType==4?'拒收快递':details.problemType==5?'未按时发货':details.problemType==6?'未收到货':details.problemType==7?'少件漏件':'邮费异差'}</Text>
                                                                </View>
                                                            </View>

                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>买家问题描述:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.buyerProblem}</Text>
                                                                </View>
                                                            </View>


                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>卖家回复:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.sellerReply}</Text>
                                                                </View>
                                                            </View>
                                                        </ScrollView>
                                                    </View>



                                                    {details.processResult==0&&
                                                    <View style={{alignItems:"center",justifyContent:"center",marginTop:20,flexDirection:"row"}}>

                                                        <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,alignItems:"center",justifyContent:"center",width:100}}>
                                                            <TouchableHighlight onPress={()=>{this.setState({modal:'处理'})}} underlayColor="transparent" style={{padding:10,alignItems:"center",justifyContent:"center",}}>
                                                                <Text style={{color:"#fff"}}>处理</Text>
                                                            </TouchableHighlight>
                                                        </LinearGradient>


                                                    </View>}

                                                    {
                                                        (details.processResult==1&&details.serviceStatus!=2&&details.serviceStatus!=4&&details.processType==1)&&
                                                    <View style={{alignItems:"center",justifyContent:"center",marginTop:20,flexDirection:"row"}}>

                                                        <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,alignItems:"center",justifyContent:"center",width:100}}>
                                                            <TouchableHighlight onPress={()=>{this.finishOrder()}} underlayColor="transparent" style={{padding:10,alignItems:"center",justifyContent:"center",}}>
                                                                <Text style={{color:"#fff"}}>退货退款</Text>
                                                            </TouchableHighlight>
                                                        </LinearGradient>


                                                    </View>}

                                                    {
                                                        (details.processResult==1&&details.processType==2&&details.serviceStatus!=2&&details.serviceStatus!=4)&&
                                                    <View style={{alignItems:"center",justifyContent:"center",marginTop:20,flexDirection:"row"}}>

                                                        <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,alignItems:"center",justifyContent:"center",width:100}}>
                                                            <TouchableHighlight onPress={()=>{this.finishOrder(true)}} underlayColor="transparent" style={{padding:10,alignItems:"center",justifyContent:"center",}}>
                                                                <Text style={{color:"#fff"}}>仅退款</Text>
                                                            </TouchableHighlight>
                                                        </LinearGradient>


                                                    </View>}

                                                    <View style={{alignItems:"center",justifyContent:"center",marginTop:20,flexDirection:"row"}}>

                                                        <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,alignItems:"center",justifyContent:"center",width:100}}>
                                                            <TouchableHighlight onPress={()=>{this.setState({modal:'留言'})}} underlayColor="transparent" style={{padding:10,alignItems:"center",justifyContent:"center",}}>
                                                                <Text style={{color:"#fff"}}>留言</Text>
                                                            </TouchableHighlight>
                                                        </LinearGradient>
                                                    </View>


                                                </View>:

                                                this.state.modal=='处理'?

                                                    <View style={{padding:10}}>
                                                        <View>
                                                            <ScrollView style={{maxHeight:Dimensions.get('window').height-200}}>
                                                                <View style={{paddingBottom:this.state.padd}}>
                                                                    <View style={styles.a}>
                                                                        <Text style={styles.f}>问题类型:</Text>
                                                                        <View style={[styles.b,{flex:3}]}>
                                                                            <Text  style={{flex:1}}>{details.problemType==1?'无理由退货':details.problemType==2?'实物不符':details.problemType==3?'货物破损':details.problemType==4?'拒收快递':details.problemType==5?'未按时发货':details.problemType==6?'未收到货':details.problemType==7?'少件漏件':'邮费异差'}</Text>
                                                                        </View>
                                                                    </View>

                                                                    <View style={styles.a}>
                                                                        <Text style={styles.f}>处理方式:</Text>
                                                                        <View style={[styles.b,{flex:3}]}>
                                                                            <Text style={{flex:1}}>{details.processType==1?"退货退款": details.processType==2?"仅退款":"补发货"}</Text>
                                                                        </View>
                                                                    </View>


                                                                    <View style={styles.a}>
                                                                        <Text style={styles.f}>买家问题描述:</Text>
                                                                        <View style={[styles.b,{flex:3}]}>
                                                                            <Text style={{flex:1}}>{details.buyerProblem}</Text>
                                                                        </View>
                                                                    </View>
                                                                    {
                                                                        details.processType==3?
                                                                            <View>
                                                                                <View style={styles.a}>
                                                                                    <Text style={styles.f}>快递名称:</Text>
                                                                                    <View style={[styles.b,{flex:3}]}>
                                                                                        <TextInput
                                                                                            placeholder={'请填写快递名称'}
                                                                                            onFocus={this.focus}
                                                                                            style={styles.teCor}
                                                                                            autoCapitalize={'none'}
                                                                                            underlineColorAndroid="transparent"
                                                                                            onChangeText={(postName) => this.setState({postName})}
                                                                                        />
                                                                                    </View>
                                                                                </View>

                                                                                <View style={styles.a}>
                                                                                    <Text style={styles.f}>快递单号:</Text>
                                                                                    <View style={[styles.b,{flex:3}]}>
                                                                                        <TextInput
                                                                                            placeholder={'请填写单号'}
                                                                                            onFocus={this.focus}
                                                                                            style={styles.teCor}
                                                                                            autoCapitalize={'none'}
                                                                                            underlineColorAndroid="transparent"
                                                                                            onChangeText={(postNo) => this.setState({postNo})}
                                                                                        />
                                                                                    </View>
                                                                                </View>
                                                                            </View>:null
                                                                    }


                                                                    <View style={styles.a}>
                                                                        <Text style={styles.f}>回复:</Text>
                                                                        <View style={[styles.b,{flex:3}]}>
                                                                            <TextInput
                                                                                placeholder={'请填写回复'}
                                                                                multiline={true}
                                                                                onFocus={this.focus}
                                                                                style={[styles.teCor,{height:100,}]}
                                                                                underlineColorAndroid="transparent"
                                                                                onChangeText={(reply) => this.setState({reply})}
                                                                            />
                                                                        </View>
                                                                    </View>



                                                                    {details.images&&
                                                                    <View style={styles.a}>
                                                                        <Text style={styles.f}>问题图片:</Text>
                                                                        <View style={[styles.b,{flex:3}]}>
                                                                            {
                                                                                details.images.map((item,index)=>
                                                                                    <View key={index} style={{height:210,marginTop:10}} >
                                                                                        <Image style={{height:200,width:"80%",resizeMode:"stretch"}}
                                                                                               source={{uri:item}}
                                                                                        />
                                                                                    </View>
                                                                                )
                                                                            }
                                                                        </View>
                                                                    </View>

                                                                    }

                                                                    <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-around",marginTop:20}}>


                                                                        <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,alignItems:"center",justifyContent:"center",width:100}}>
                                                                            <TouchableHighlight onPress={()=>{this.acceptOrder()}} underlayColor="transparent" style={{padding:10,alignItems:"center",justifyContent:"center",}}>
                                                                                <Text style={{color:"#fff"}}>接受</Text>
                                                                            </TouchableHighlight>
                                                                        </LinearGradient>

                                                                        <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,alignItems:"center",justifyContent:"center",width:100}}>
                                                                            <TouchableHighlight onPress={()=>{this.refuseOrder()}} underlayColor="transparent" style={{padding:10,alignItems:"center",justifyContent:"center",}}>
                                                                                <Text style={{color:"#fff"}}>拒绝</Text>
                                                                            </TouchableHighlight>
                                                                        </LinearGradient>

                                                                    </View>
                                                                </View>

                                                            </ScrollView>


                                                        </View>
                                                    </View>



                                                    :this.state.modal=='留言'?
                                                    <AddMsg serviceId={details.serviceId}/>
                                                    :
                                                    <View/>
                                        }

                                    </View>

                                }


                            </View>
                        </View>
                    </Modal>



                </View>



                    {
                        changeMsg=='待处理'?
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
                                        data={order1}  //列表的渲染数据源
                                        ListEmptyComponent={()=><View style={{marginTop:30,alignItems:"center"}}><Text>{this.state.aa?'暂无处理中工单':'获取处理中工单数据中'}</Text></View>} //列表没有数据时展示，箭头函数中可以写一个react组件
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



                                                    {/*<View style={[{flex:2,alignItems:"center",justifyContent:"center"}]}>*/}
                                                        {/*<Text>{item.modelName}</Text>*/}
                                                        {/*<Text  style={{marginTop:5,}}>{item.brandName}</Text>*/}
                                                        {/*<Text  style={{marginTop:5,}}>{item.goodsNum}件</Text>*/}
                                                    {/*</View>*/}

                                                    <View style={[{flex:2,alignItems:"center",justifyContent:"center"}]}>
                                                        <Text>问题描述:<Text style={{color:"red"}}>{item.buyerProblem}</Text></Text>
                                                        <Text>卖家回复:<Text style={{color:"blue"}}>{item.sellerReply}</Text></Text>
                                                    </View>


                                                    <View style={[{flex:2,alignItems:"center",justifyContent:"center"}]}>
                                                        <Text>{item.problemType==1?'无理由退货':item.problemType==2?'实物不符':item.problemType==3?'货物破损':item.problemType==4?'拒收快递':item.problemType==5?'未按时发货':item.problemType==6?'未收到货':item.problemType==7?'少件漏件':'邮费异差'}</Text>

                                                        <Text style={{marginTop:5,color:"red"}}>{item.serviceStatus==0?"未受理": item.serviceStatus==1?"受理中":item.serviceStatus==2?"已受理":item.serviceStatus==4?"工单关闭":"平台接管"}></Text>

                                                    </View>


                                                </View>

                                            </TouchableHighlight>


                                        )}
                                    />
                                </View>
                            </View>
                            :changeMsg=='已处理'?
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
                                        data={order2}  //列表的渲染数据源
                                        ListEmptyComponent={()=><View style={{marginTop:30,alignItems:"center"}}><Text>{this.state.bb?'暂无已处理工单':'获取已处理工单数据中'}</Text></View>} //列表没有数据时展示，箭头函数中可以写一个react组件
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



                                                    {/*<View style={[{flex:2,alignItems:"center",justifyContent:"center"}]}>*/}
                                                        {/*<Text>{item.modelName}</Text>*/}
                                                        {/*<Text  style={{marginTop:5,}}>{item.brandName}</Text>*/}
                                                        {/*<Text  style={{marginTop:5,}}>{item.goodsNum}件</Text>*/}
                                                    {/*</View>*/}

                                                    <View style={[{flex:2,alignItems:"center",justifyContent:"center"}]}>
                                                        <Text>问题描述:<Text style={{color:"red"}}>{item.buyerProblem}</Text></Text>
                                                        <Text>卖家回复:<Text style={{color:"blue"}}>{item.sellerReply}</Text></Text>
                                                    </View>


                                                    <View style={[{flex:2,alignItems:"center",justifyContent:"center"}]}>
                                                        <Text>{item.problemType==1?'无理由退货':item.problemType==2?'实物不符':item.problemType==3?'货物破损':item.problemType==4?'拒收快递':item.problemType==5?'未按时发货':item.problemType==6?'未收到货':item.problemType==7?'少件漏件':'邮费异差'}</Text>

                                                        <Text style={{marginTop:5,color:"red"}}>{item.serviceStatus==0?"未受理": item.serviceStatus==1?"受理中":item.serviceStatus==2?"已受理":item.serviceStatus==4?"工单关闭":"平台接管"}></Text>

                                                    </View>


                                                </View>

                                            </TouchableHighlight>


                                        )}
                                    />
                                </View>
                            </View>:
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
                                        data={order3}  //列表的渲染数据源
                                        ListEmptyComponent={()=><View style={{marginTop:30,alignItems:"center"}}><Text>{this.state.cc?'暂无已拒绝工单':'获取已拒绝工单数据中'}</Text></View>} //列表没有数据时展示，箭头函数中可以写一个react组件
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



                                                    {/*<View style={[{flex:2,alignItems:"center",justifyContent:"center"}]}>*/}
                                                        {/*<Text>{item.modelName}</Text>*/}
                                                        {/*<Text  style={{marginTop:5,}}>{item.brandName}</Text>*/}
                                                        {/*<Text  style={{marginTop:5,}}>{item.goodsNum}件</Text>*/}
                                                    {/*</View>*/}

                                                    <View style={[{flex:2,alignItems:"center",justifyContent:"center"}]}>
                                                        <Text>问题描述:<Text style={{color:"red"}}>{item.buyerProblem}</Text></Text>
                                                        <Text>卖家回复:<Text style={{color:"blue"}}>{item.sellerReply}</Text></Text>
                                                    </View>


                                                    <View style={[{flex:2,alignItems:"center",justifyContent:"center"}]}>
                                                        <Text>{item.problemType==1?'无理由退货':item.problemType==2?'实物不符':item.problemType==3?'货物破损':item.problemType==4?'拒收快递':item.problemType==5?'未按时发货':item.problemType==6?'未收到货':item.problemType==7?'少件漏件':'邮费异差'}</Text>

                                                        <Text style={{marginTop:5,color:"red"}}>{item.serviceStatus==0?"未受理": item.serviceStatus==1?"受理中":item.serviceStatus==2?"已受理":item.serviceStatus==4?"工单关闭":"平台接管"}></Text>

                                                    </View>


                                                </View>

                                            </TouchableHighlight>


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
    },
    teCor:{minWidth:'100%',padding:10,backgroundColor:"#fff",borderRadius:5,borderColor:"#ccc",borderWidth:1},


});

export default connect (
    state => ({reduxData: state.reduxData}),
    dispath => bindActionCreators({setHotelNo},dispath)
)(GoodSelect);