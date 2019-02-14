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
            pages:1,
            order1:[],
            order2:[],
            order3:[],
            refreshing:false,
            noData1:false,
            noData2:false,
            noData3:false,
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
            modal:"查看详情"


        };


    }


    //查询工单列表
     getBuyerOrderService1 = ()=>{
         axios.post(`/order/getBuyerOrderService`,
             {
                 current:1,
                 pageSize:10,
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
     getBuyerOrderService2 = ()=>{
         axios.post(`/order/getBuyerOrderService`,
             {
                 current:1,
                 pageSize:10,
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
     getBuyerOrderService3 = ()=>{
         axios.post(`/order/getBuyerOrderService`,
             {
                 current:1,
                 pageSize:10,
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
        this.getBuyerOrderService1()
        this.getBuyerOrderService2()
        this.getBuyerOrderService3()
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


     details=(item)=>{
         
         console.log(item,'1111111111');
         
         this.setState({
             details: item,
             modalVisible: true,
             modal:"查看详情"

         })
     }


     //填写退货快递单号
     acceptOrder = ()=>{
         this.setState({
             modalVisible:false
         },()=>{
             axios.post(`/order/buyerReturnGoods`,{
                 serviceId:this.state.details.serviceId,
                 postNo:this.state.postNo,
                 postName:''
             },)
                 .then((response) =>{
                     console.log(response);

                     this.onRefresh()

                     Toast.info(response.data.code==0?'填写成功':response.data.message,1)
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
         let {pages,order1,order2,order3,noData1,noData2,noData3} = this.state;


         if(!noData1){
             this.setState({
                 pages:pages+1
             },()=>{
                 axios.post(`/order/getBuyerOrderService`,
                     {
                         current:this.state.pages,
                         pageSize:10,
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
                 pages:pages+1
             },()=>{
                 axios.post(`/order/getBuyerOrderService`,
                     {
                         current:this.state.pages,
                         pageSize:10,
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
                 pages:pages+1
             },()=>{
                 axios.post(`/order/getBuyerOrderService`,
                     {
                         current:this.state.pages,
                         pageSize:10,
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
             refreshing:true,
         },()=>{
             this.getAll()
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

                            <LinearGradient key={index} colors={[!item.flag?'#f96f59':"#fff", !item.flag?'#f94939':"#fff"]} style={{width:"33.33%",}}>
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

                                        <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}>{this.state.modal=='查看详情'?'查看详情':this.state.modal=='处理'?'快递单号':"发货"}</Text></View>



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
                                                        <Text style={styles.f}>退款金额:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1,color:"orange",fontSize:18,fontWeight:"bold"}}>{details.backMoney}元</Text>
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
                                                            <Text style={{flex:1}}>{details.postNo}</Text>
                                                        </View>
                                                    </View>



                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>快递名称:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1}}>{details.postName}</Text>
                                                        </View>
                                                    </View>





                                                    <View style={{borderLeftWidth:3,borderLeftColor:'#f96f59',marginTop:15}}>
                                                        <Text style={{fontSize:20,fontWeight:'bold',paddingLeft:10}}>状态信息</Text>
                                                    </View>

                                                    <View style={{width:"100%",height:1,backgroundColor:"#ffdac7",marginTop:10}}></View>



                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>服务状态:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1}}>{details.serviceStatus==0?"未受理": details.serviceStatus==1?"受理中":"已受理"}</Text>
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

                                                {(details.serviceStatus!=0&&!details.postNo)&&
                                                <View style={{alignItems:"center",justifyContent:"center",marginTop:20,flexDirection:"row"}}>

                                                    <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,alignItems:"center",justifyContent:"center",width:100}}>
                                                        <TouchableHighlight onPress={()=>{this.setState({modal:'处理'})}} underlayColor="transparent" style={{padding:10,alignItems:"center",justifyContent:"center",}}>
                                                            <Text style={{color:"#fff"}}>快递单号</Text>
                                                        </TouchableHighlight>
                                                    </LinearGradient>

                                                </View>}



                                            </View>:

                                            this.state.modal=='处理'?
                                                <ScrollView style={{maxHeight:Dimensions.get('window').height-200}}>
                                                    <View style={{padding:10}}>


                                                        <View style={styles.a}>
                                                            <Text style={styles.f}>快递单号:</Text>
                                                            <View style={[styles.b,{flex:3}]}>
                                                                <TextInput
                                                                    placeholder={'请填写快递单号'}
                                                                    style={[{borderColor:"#ccc",borderWidth:1,borderRadius:5,padding:5}]}
                                                                    underlineColorAndroid="transparent"
                                                                    onChangeText={(postNo) => this.setState({postNo})}
                                                                />
                                                            </View>
                                                        </View>


                                                        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-around",marginTop:20}}>


                                                            <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,alignItems:"center",justifyContent:"center",width:100}}>
                                                                <TouchableHighlight onPress={()=>{this.acceptOrder()}} underlayColor="transparent" style={{padding:10,alignItems:"center",justifyContent:"center",}}>
                                                                    <Text style={{color:"#fff"}}>快递单号</Text>
                                                                </TouchableHighlight>
                                                            </LinearGradient>

                                                        </View>

                                                    </View>
                                                </ScrollView>

                                                :<View/>
                                    }

                                </View>




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



                                                    <View style={[{flex:1,alignItems:"center",justifyContent:"center"}]}>
                                                        <Text>{item.modelName}</Text>
                                                        <Text  style={{marginTop:5,}}>{item.goodsNum}件</Text>
                                                    </View>


                                                    <View style={[{flex:2,alignItems:"center",justifyContent:"center"}]}>
                                                        <Text style={{color:"grey"}}>退款金额</Text>
                                                        <Text  style={{marginTop:5,fontSize:18,color:"orange"}}>{item.backMoney}元</Text>
                                                    </View>

                                                    <View style={[{flex:2,alignItems:"center",justifyContent:"center"}]}>
                                                        <Text>问题描述:<Text style={{color:"red"}}>{item.buyerProblem}</Text></Text>
                                                        <Text>卖家回复:<Text style={{color:"blue"}}>{item.sellerReply}</Text></Text>
                                                    </View>


                                                    <View style={[{flex:2,alignItems:"center",justifyContent:"center"}]}>
                                                        <Text>{item.problemType==1?'无理由退货':item.problemType==2?'实物不符':item.problemType==3?'货物破损':item.problemType==4?'拒收快递':item.problemType==5?'未按时发货':item.problemType==6?'未收到货':item.problemType==7?'少件漏件':'邮费异差'}</Text>

                                                        <Text style={{marginTop:5,color:"red"}}>{item.serviceStatus==0?"未受理": item.serviceStatus==1?"受理中":"已受理"}

                                                            <Text>></Text>


                                                        </Text>


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



                                                    <View style={[{flex:1,alignItems:"center",justifyContent:"center"}]}>
                                                        <Text>{item.modelName}</Text>
                                                        <Text  style={{marginTop:5,}}>{item.goodsNum}件</Text>
                                                    </View>


                                                    <View style={[{flex:2,alignItems:"center",justifyContent:"center"}]}>
                                                        <Text style={{color:"grey"}}>退款金额</Text>
                                                        <Text  style={{marginTop:5,fontSize:18,color:"orange"}}>{item.backMoney}元</Text>
                                                    </View>

                                                    <View style={[{flex:2,alignItems:"center",justifyContent:"center"}]}>
                                                        <Text>问题描述:<Text style={{color:"red"}}>{item.buyerProblem}</Text></Text>
                                                        <Text>卖家回复:<Text style={{color:"blue"}}>{item.sellerReply}</Text></Text>
                                                    </View>


                                                    <View style={[{flex:2,alignItems:"center",justifyContent:"center"}]}>
                                                        <Text>{item.problemType==1?'无理由退货':item.problemType==2?'实物不符':item.problemType==3?'货物破损':item.problemType==4?'拒收快递':item.problemType==5?'未按时发货':item.problemType==6?'未收到货':item.problemType==7?'少件漏件':'邮费异差'}</Text>

                                                        <Text style={{marginTop:5,color:"red"}}>{item.serviceStatus==0?"未受理": item.serviceStatus==1?"受理中":"已受理"}
                                                            <Text>></Text>
                                                        </Text>
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



                                                    <View style={[{flex:1,alignItems:"center",justifyContent:"center"}]}>
                                                        <Text>{item.modelName}</Text>
                                                        <Text  style={{marginTop:5,}}>{item.goodsNum}件</Text>
                                                    </View>


                                                    <View style={[{flex:2,alignItems:"center",justifyContent:"center"}]}>
                                                        <Text style={{color:"grey"}}>退款金额</Text>
                                                        <Text  style={{marginTop:5,fontSize:18,color:"orange"}}>{item.backMoney}元</Text>
                                                    </View>

                                                    <View style={[{flex:2,alignItems:"center",justifyContent:"center"}]}>
                                                        <Text>问题描述:<Text style={{color:"red"}}>{item.buyerProblem}</Text></Text>
                                                        <Text>卖家回复:<Text style={{color:"blue"}}>{item.sellerReply}</Text></Text>
                                                    </View>


                                                    <View style={[{flex:2,alignItems:"center",justifyContent:"center"}]}>
                                                        <Text>{item.problemType==1?'无理由退货':item.problemType==2?'实物不符':item.problemType==3?'货物破损':item.problemType==4?'拒收快递':item.problemType==5?'未按时发货':item.problemType==6?'未收到货':item.problemType==7?'少件漏件':'邮费异差'}</Text>

                                                        <Text style={{marginTop:5,color:"red"}}>{item.serviceStatus==0?"未受理": item.serviceStatus==1?"受理中":"已受理"}

                                                            <Text>></Text>


                                                        </Text>


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
    }


});

export default connect (
    state => ({reduxData: state.reduxData}),
    dispath => bindActionCreators({setHotelNo},dispath)
)(GoodSelect);