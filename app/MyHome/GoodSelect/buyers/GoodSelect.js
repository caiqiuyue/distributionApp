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
import AddPic from "./addPic";
import PayComponents from "../../HomePage/buyers/payComponents";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setHotelNo} from "../../../components/active/reducer";
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from "react-native-image-picker";

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
            file:[],
            refreshing:false,
            noData:false,
            details:{},
            modal:"",
            animationType: 'none',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示
            reasonReturnGoods:null,
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
            problemTypeList:[

                {
                    label:"无理由退货",
                    value:'1'
                },

                {
                    label:"实物不符",
                    value:'2'
                },

                {
                    label:"货物破损",
                    value:'3'
                },
                {
                    label:"拒收快递",
                    value:'4'
                },
                {
                    label:"未按时发货",
                    value:'5'
                },
                {
                    label:"未收到货",
                    value:'6'
                },
                {
                    label:"少件漏件",
                    value:'7'
                },
                {
                    label:"邮费异差",
                    value:'8'
                },


            ],
            processTypeList:[

                {
                    label:"退货退款",
                    value:'1'
                },

                {
                    label:"仅退款",
                    value:'2'
                },

                {
                    label:"补发货",
                    value:'3'
                },
            ],
            ordStatu:[''],
            problemType:[''],
            processType:[''],


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
         axios.post(`/order/getBuyerOrder`,
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
                     refreshing:false,

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



     addPic = (item)=>{
         console.log(item,'addPicaddPicaddPicaddPic');
         this.setState({
             file:item
         })
     }

     //获取已完成
     getBuyerOrder5 = ()=>{
         axios.post(`/order/getBuyerOrder`,
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
                     refreshing:false,

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
         this.getBuyerOrder5()
         // this.uploadPic()


     }


     details=(item)=>{
         this.setState({
             details: item,
             modalVisible: true,
             modal:"查看详情"

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
                 axios.post(`/order/getBuyerOrder`,
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


                 axios.post(`/order/getBuyerOrder`,
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
             this.getBuyerOrder5()
         })
     }


     //支付
     submitPay = ()=>{
         axios.get(`/order/orderPayView`,{
             parentId:this.state.details.parentId
         },)
             .then((response) =>{
                 console.log(response);
                 if(response.data.code==0){

                     this.setState({
                         payDatas:response.data.data,
                         modal:"11"
                     })

                 }else {
                     alert(response.data.message)
                 }
             })
             .catch(function (error) {
                 console.log(error);
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


     cancelSelected=()=>{

     }

     //提交退货
     submitReturnGoods=()=>{


         if(!this.state.problemType[0]){
             alert('请选择处理方式')
             return
         }

         if(!this.state.processType[0]){
             alert('请选择问题类型')
             return
         }


         this.setState({
             modalVisible:false
         },()=>{

             let data=new FormData();
             data.append('problemType',this.state.problemType[0]-0)
             data.append('processType',this.state.processType[0]-0)
             data.append('problemDesc',this.state.reasonReturnGoods)
             data.append('orderId',this.state.details.orderId,)


             this.state.file && this.state.file.map(item=>{
                 data.append('file',item)
             })


             axios.post(`/order/orderObjection`,data,)
                 .then((response) =>{
                     console.log(response);
                     Toast.info(response.data.code==0?'提交成功':response.data.message)

                 })
                 .catch(function (error) {
                     console.log(error);
                 })



         })



     }

     //确认收货
     comfirmSelected=()=>{
         this.setState({
             modalVisible:false
         },()=>{
             axios.get(`/order/updateOrderState`,{
                 orderId:this.state.details.orderId,
                 status:3,
             },)
                 .then((response) =>{
                     console.log(response);

                     this.onRefresh()

                     Toast.info(response.data.code==0?'确认收货成功':response.data.message,1)
                 })
                 .catch(function (error) {
                     console.log(error);
                 })
         })
     }

     Confirm = () => {


         Alert.alert('确定收货？',`确定收货吗？`,
             [
                 {text:"取消", onPress:this.cancelSelected},
                 {text:"确认", onPress:this.comfirmSelected}
             ],
             { cancelable: false }
         );




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

                                            <TouchableHighlight  underlayColor="transparent" onPress={()=>{this.details(item)}}>

                                                <View style={[styles.d,styles.e,]}>

                                                    <View  style={[{alignItems:"center",justifyContent:"center",flex:3}]}>
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

                                <View>
                                    <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>

                                        <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}>{this.state.modal=='查看详情'?'查看详情':this.state.modal=='取消订单'?"取消订单":this.state.modal=='退货'?'退货':'支付'}</Text></View>



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

                                                            <View style={{width:"100%",height:1,backgroundColor:"#ccc",marginTop:10}}></View>


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

                                                            <View style={{width:"100%",height:1,backgroundColor:"#ccc",marginTop:10}}></View>



                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>收货人:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <Text style={{flex:1}}>{details.consignee}</Text>
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

                                                            <View style={{width:"100%",height:1,backgroundColor:"#ccc",marginTop:10}}></View>



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

                                                        {details.capitalState==0&&
                                                        <View style={{alignItems:"center",justifyContent:"space-around",marginTop:20,flexDirection:"row"}}>


                                                            <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,alignItems:"center",justifyContent:"center",width:100}}>
                                                                <TouchableHighlight onPress={this.submitPay} underlayColor="transparent" style={{padding:10,alignItems:"center",justifyContent:"center",}}>
                                                                    <Text style={{color:"#fff"}}>确认支付</Text>
                                                                </TouchableHighlight>
                                                            </LinearGradient>


                                                            <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,alignItems:"center",justifyContent:"center",width:100}}>
                                                                <TouchableHighlight onPress={()=>{this.setState({modal:'取消订单',orderState:1,reason:null})}} underlayColor="transparent" style={{padding:10,alignItems:"center",justifyContent:"center",}}>
                                                                    <Text style={{color:"#fff"}}>删除订单</Text>
                                                                </TouchableHighlight>
                                                            </LinearGradient>



                                                        </View>}


                                                        {details.orderState==2&&
                                                        <View style={{alignItems:"center",justifyContent:"center",marginTop:20}}>

                                                            <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,alignItems:"center",justifyContent:"center",width:100}}>
                                                                <TouchableHighlight onPress={()=>{this.setState({modal:'取消订单',orderState:2,reason:null})}} underlayColor="transparent" style={{padding:10,alignItems:"center",justifyContent:"center",}}>
                                                                    <Text style={{color:"#fff"}}>撤销订单</Text>
                                                                </TouchableHighlight>
                                                            </LinearGradient>



                                                        </View>}

                                                        {details.postState==1&&
                                                        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-around",marginTop:20}}>

                                                            <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,alignItems:"center",justifyContent:"center",width:100}}>
                                                                <TouchableHighlight onPress={()=>{this.Confirm()}} underlayColor="transparent" style={{padding:10,alignItems:"center",justifyContent:"center",}}>
                                                                    <Text style={{color:"#fff"}}>确认收货</Text>
                                                                </TouchableHighlight>
                                                            </LinearGradient>

                                                            <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,alignItems:"center",justifyContent:"center",width:100}}>
                                                                <TouchableHighlight onPress={()=>{this.setState({modal:'退货',orderState:3,processType:[],problemType:[],reasonReturnGoods:null})}} underlayColor="transparent" style={{padding:10,alignItems:"center",justifyContent:"center",}}>
                                                                    <Text style={{color:"#fff"}}>退货</Text>
                                                                </TouchableHighlight>
                                                            </LinearGradient>





                                                        </View>}


                                                    </View>



                                                </View>:

                                                this.state.modal=='取消订单'?
                                                    <View style={{padding:10}}>


                                                        <View>
                                                            <ScrollView style={{maxHeight:Dimensions.get('window').height-200}}>
                                                                <Text style={{marginTop:10}}>{this.state.orderState==1?"确定要删除吗？":'确定要撤销吗？'}</Text>



                                                                <View style={styles.a}>
                                                                    <Text style={styles.f}>原因:</Text>
                                                                    <View style={[styles.b,{flex:3}]}>
                                                                        <TextInput
                                                                            placeholder={this.state.orderState==1?"请填写删除原因":'请填写撤销原因？'}
                                                                            multiline={true}
                                                                            style={[styles.teCor,{height:100,}]}
                                                                            underlineColorAndroid="transparent"
                                                                            onChangeText={(reason) => this.setState({reason})}
                                                                        />
                                                                    </View>
                                                                </View>


                                                                <View style={{alignItems:"center",justifyContent:"center",marginTop:20}}>


                                                                    <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,alignItems:"center",justifyContent:"center",width:100}}>
                                                                        <TouchableHighlight onPress={()=>{this.cancelOrder()}} underlayColor="transparent" style={{padding:10,alignItems:"center",justifyContent:"center",}}>
                                                                            <Text style={{color:"#fff"}}>确定</Text>
                                                                        </TouchableHighlight>
                                                                    </LinearGradient>


                                                                </View>
                                                            </ScrollView>
                                                        </View>



                                                    </View>

                                                :
                                                    this.state.modal=='退货'?
                                                        <View style={{padding:10}}>

                                                            <View>
                                                                <ScrollView style={{maxHeight:Dimensions.get('window').height-200}}>
                                                                    <View style={styles.a}>
                                                                        <Text style={styles.f}>处理方式:</Text>
                                                                        <View style={[styles.b,{flex:3}]}>
                                                                            <Picker
                                                                                data={this.state.processTypeList}
                                                                                cols={1}
                                                                                extra={'请选择处理方式'}
                                                                                value={this.state.processType}
                                                                                onChange={value => {this.setState({processType:value})}}
                                                                                className="forss">
                                                                                <RoomInfo2></RoomInfo2>
                                                                            </Picker>
                                                                        </View>
                                                                    </View>

                                                                    <View style={styles.a}>
                                                                        <Text style={styles.f}>问题类型:</Text>
                                                                        <View style={[styles.b,{flex:3}]}>
                                                                            <Picker
                                                                                data={this.state.problemTypeList}
                                                                                cols={1}
                                                                                extra={'请选择问题类型'}
                                                                                value={this.state.problemType}
                                                                                onChange={value => {this.setState({problemType:value})}}
                                                                                className="forss">
                                                                                <RoomInfo2></RoomInfo2>
                                                                            </Picker>
                                                                        </View>

                                                                    </View>

                                                                    <View style={styles.a}>
                                                                        <Text style={styles.f}>退货原因:</Text>
                                                                        <View style={[styles.b,{flex:3}]}>
                                                                            <TextInput
                                                                                placeholder={'请填写退货原因'}
                                                                                multiline={true}
                                                                                style={[styles.teCor,{height:100,}]}
                                                                                underlineColorAndroid="transparent"
                                                                                onChangeText={(reasonReturnGoods) => this.setState({reasonReturnGoods})}
                                                                            />
                                                                        </View>
                                                                    </View>


                                                                    <AddPic  addPic={this.addPic}/>

                                                                </ScrollView>



                                                                <View style={{alignItems:"center",justifyContent:"center",marginTop:20}}>
                                                                    <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,alignItems:"center",justifyContent:"center",width:100}}>
                                                                        <TouchableHighlight onPress={()=>{this.submitReturnGoods()}} underlayColor="transparent" style={{padding:10,alignItems:"center",justifyContent:"center",}}>
                                                                            <Text style={{color:"#fff"}}>确定</Text>
                                                                        </TouchableHighlight>
                                                                    </LinearGradient>
                                                                </View>
                                                            </View>




                                                        </View>

                                                        :<PayComponents payDatas={this.state.payDatas} parentId={this.state.details.parentId}/>
                                        }

                                </View>

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