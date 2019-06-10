import React,{Component} from 'react';
import {
    View, Text, TouchableHighlight, Image, StyleSheet, Platform, FlatList, Dimensions,
    TextInput, Modal, ScrollView, Alert
} from 'react-native';

import axios from "../../axios";
import moment from "moment/moment";
import {Toast,Picker,Carousel} from 'antd-mobile'
import topBg from "../HomePage/style/topBg.png";
import s1 from "../HomePage/style/234.png";
import close from "../HomePage/style/close.png";
import LinearGradient from 'react-native-linear-gradient';
import TabHome from "../HomePage/homepageBox";
import add from "../GoodSelect/style/add.png";
import AddPic from "../GoodSelect/addPic";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { setRoleStr} from '../../components/active/reducer';
import select from '../select.png';
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
import selectIcon from '../../MyHome/HomePage/style/selectIcon.png'


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


class ReadMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            refreshing: false,
            handelMsg:[
                {
                    value:"交易大厅",
                    flag:true
                },
                {
                    value:"批量发布",
                    flag:false
                },

                {
                    value:"精确发布",
                    flag:false
                },

            ],
            messType:[
                {
                    value:1,
                    flag:false
                },
                {
                    value:2,
                    flag:false
                },

            ],
            type:[],
            seachGoodsNo:'',
            image:'',
            marketId:'',
            pubIndex:null,
            changeMsg:"交易大厅",
            unreadData:[],
            readData:[],
            clueList:[],
            aa:false,
            priceFlag:false,

            padd:10,
            pages:1,
            role:this.props.reduxData.roleStr,
            noData:false,
            isMe:0,
            orderStatus:[

                {
                    label:"全部",
                    value:''
                },

                {
                    label:"只看求货",
                    value:'1'
                },

                {
                    label:"只看出货",
                    value:'2'
                },



            ],
            ordStatu:[''],
            animationType: 'none',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示
            pics:[],
            picsIndex:null,
            goodsNo:null,
            model:null,
            content:null,
            id:null,
            file:[],
            price:'',
            saleNum:'',
            publishImg:[],

        };

        this.type = 1;
        this.publish = false;

    }

    _setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    };

    seePrice=(goodsNo,i)=> {
        let {unreadData} = this.state
        let data = {
            goodsNo: goodsNo.goodsNo,
            model: goodsNo.model.indexOf(' ') == -1 ? goodsNo.model : ''
        }

        axios.get(`/goods/getGoodsQuotation`, data)
            .then( (response)=> {
                console.log(response,'获取报价列表');
                if (response.data.code==0) {
                    unreadData.map(item => {
                        if(item.goodsNo == goodsNo.goodsNo){
                            item.priceList = response.data.priceList
                            this.setState({
                                pubIndex:response.data.priceList.length == 0?i:null,
                            })
                        }

                    })

                    this.setState({
                        unreadData
                    })

                }else {
                    Toast.info(response.data.message)
                }
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    //我发布的
    isMeList=()=>{
        let data = {
            current:1,
            pageSize:50,
            isMe:1

        }

        this.setState({
            isMe:1,
            pages:1
        })

        axios.post(`/notice/getTradeMarketList`, data)
            .then( (response)=> {
                console.log(response,'获取交易大厅信息列表');

                this.setState({
                    aa:true,
                    refreshing:false
                },()=>{
                    if(response.data.code==0){
                        this.setState({
                            unreadData:response.data.data.marketList,
                        })
                    }else {
                        Toast.info(response.data.message)
                    }
                })



            })
            .catch(function (error) {
                console.log(error);
            });


    }

    getTradeMarketList = (item) =>{

        let data = {
            current:1,
            pageSize:50,
            goodsNo:this.state.seachGoodsNo,

        }

        if(item){
            data.type = item
        }

        let messageJump = this.props.navigation.state.params;
        console.log(messageJump,'111111');
        if(messageJump){
            this.props.navigation.state.params.messageJump = null

        }
        console.log(messageJump,'222222');

        axios.post(`/notice/getTradeMarketList`, data)
            .then( (response)=> {
                console.log(response,'获取交易大厅信息列表');

                this.setState({
                    aa:true,
                    refreshing:false,
                    isMe:0,
                },()=>{
                    if(response.data.code==0){
                        this.setState({
                            unreadData:response.data.data.marketList,
                            })
                    }else {
                        Toast.info(response.data.message)
                    }
                })



            })
            .catch(function (error) {
                console.log(error);
            });
    }


    getPublishList = () =>{
        axios.get(`/notice/getPublishList`, {})
            .then( (response)=> {
                console.log(response,'获取交易大厅信息列表');

                this.setState({
                    bb:true,
                    refreshing:false
                },()=>{
                    if(response.data.code==0){
                        let marketList =  response.data.data.marketList
                        this.setState({
                            readData:marketList,
                            })
                    }else {
                        Toast.info(response.data.message)
                    }
                })



            })
            .catch(function (error) {
                console.log(error);
            });
    }
    geClueList = () =>{
        axios.get(`/notice/geClueList`, {})
            .then( (response)=> {
                console.log(response,'获取线索信息列表');

                this.setState({
                    bb:true,
                    refreshing:false
                },()=>{
                    if(response.data.code==0){
                        let marketList =  response.data.data.clueList
                        this.setState({
                            clueList:marketList,
                            })
                    }else {
                        Toast.info(response.data.message)
                    }
                })



            })
            .catch(function (error) {
                console.log(error);
            });
    }

    componentWillMount(){
        this.getPublishList();
        this.geClueList();

        console.log(this.props.navigation.state.params,'publish');
        let messageJump = this.props.navigation.state.params;
        if(messageJump && messageJump.messageJump && messageJump.messageJump.publishId){

            this.setState({
                marketId:messageJump.messageJump.publishId
            })

            axios.post(`/notice/getTradeMarketList`, {
                current:1,
                pageSize:50,
                marketId:messageJump.messageJump.publishId
            })
                .then( (response)=> {
                    console.log(response,'获取交易大厅信息列表');

                    this.setState({
                        aa:true,
                        refreshing:false
                    },()=>{
                        if(response.data.code==0){
                            this.setState({
                                unreadData:response.data.data.marketList,
                            })
                        }else {
                            Toast.info(response.data.message)
                        }
                    })



                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            this.getTradeMarketList()
        }


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
    changeType=(item)=>{

        let {messType} = this.state;

        messType.map((_item)=>{
            if(_item.value==item.value){
                _item.flag=true;
            }else {
                _item.flag = false
            }

        })

        this.setState({
            messType,
            type:item.value
        })

    }



    onEndReached = ()=>{
        let {pages,noData,unreadData,readData} = this.state;

        let marketId = ''

        let messageJump = this.props.navigation.state.params;
        console.log(this.props.navigation.state,'messageJump');
        if(messageJump && messageJump.messageJump && messageJump.messageJump.publishId) {
            marketId = messageJump.messageJump.publishId

        }
            if(!noData){
            this.setState({
                pages:pages+1
            },()=>{
                axios.post(`/notice/getTradeMarketList`, {
                    current:this.state.pages,
                    pageSize:50,
                    goodsNo:this.state.seachGoodsNo,
                    marketId,
                    isMe:this.state.isMe
                })
                    .then((response) =>{
                        if(messageJump){
                            this.props.navigation.state.params.messageJump = null
                        }

                        console.log(response);
                        this.setState({
                            aa:true,
                            bb:true,
                            refreshing:false,

                        },()=>{
                            if(response.data.code==0){

                                if(response.data.data.marketList.length==0){
                                    this.setState({
                                        noData:true
                                    })
                                }else{
                                    this.setState({
                                        unreadData:[...unreadData,...response.data.data.marketList],
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
    onRefresh = () => {

        this.setState({
            refreshing: true,
            noData:false,pages:1,seachGoodsNo:'',

        },()=>{

            // this.setState({
            //     refreshing:false
            // })
           this.getTradeMarketList()
           this.getPublishList()
           this.geClueList()
        });


        

    };


    //上传库存
    uploadItem = (item) => {

        const { navigate } = this.props.navigation;

        navigate('TabHome',{ publish: item });

    };


    //报价
    baojia=(item)=>{
        this.comfirmSelected(item)
    }

    //立即购买
    getSearchShop = (item ,i) => {
        const {roleStr} = this.props.reduxData;
        console.log(roleStr,'roleStr');

        const { navigate } = this.props.navigation;
        if(i){
            item.userId = ''
        }

        if(roleStr==2){
            let data = {
                isApp: 1,
                role: 1
            }
            axios.get(`/user/changeUserRole`,data,
            )
                .then((response) =>{
                    console.log(response);

                    if(response.data.code==0){
                        global.roleStr = data.role;
                        // console.log('2313123213123123123',data.role);
                        // Toast.info(`切换${data.role==1?'买家':'卖家'}成功`)
                        this.props.setRoleStr(data.role);
                        navigate('TabHome',{ getSearchShop: item });
                        storage.load({ //读取tokenKey
                            key: 'username',
                            autoSync: false
                        }).then(ret => {
                            ret.roleStr = data.role;

                            storage.save({
                                key: 'username',  // 注意:请不要在key中使用_下划线符号!
                                //data是你想要存储在本地的storage变量，这里的data只是一个示例。如果你想存一个叫item的对象，那么可以data: item，这样使用
                                data:ret,
                                // 如果不指定过期时间，则会使用defaultExpires参数
                                // 如果设为null，则永不过期
                                expires: null
                            });
                        }).catch((error) => {
                        });
                    }else {
                        Toast.info(response.data.message)
                    }

                })
                .catch(function (error) {
                    console.log(error);
                })
        }else {
            navigate('TabHome',{ getSearchShop: item });
        }



    };


    setOrdStatu=(ordStatu)=>{
        this.setState({
            ordStatu
        },()=>{
            this.getTradeMarketList(ordStatu[0]-0)
        })

    }


    seePic = (item,index) =>{
        let pics = JSON.parse(JSON.stringify(item));
        if(item.length==1){
            pics.push(item[0])
        }
        this.setState({
            modalVisible:true,modal:'查看图片',
            pics,picsIndex:index
        })
    }
    addPublish = () =>{
        this.publish = false;
        this.resetMess()
        this.setState({
            modalVisible:true,modal:'发布信息',
            padd:10,
            goodsNo:null,
            model:null,
            content:null,
            file:null,
            price:null,
            saleNum:null,
            type:'',
            image:'',

        })
    }
    addClues = () =>{
        this.publish = false;
        this.resetMess()
        this.setState({
            modalVisible:true,modal:'发布线索',
            content:null,
            file:null,
            type:''
        })
    }


    addPic = (item)=>{
        console.log(item,'addPicaddPicaddPicaddPic');
        this.setState({
            file:item
        })
    }

    publishItem = (item,i)=>{
        this.publish = true;
        this.setState({
            modalVisible:true,modal:i?'发布信息':'发布线索',
            padd:10,
            goodsNo:item.goodsNo,
            model:item.model,
            content:item.content,
            price:item.price,
            saleNum:item.saleNum,
            publishImg:item.images,
            type:(item.type==1||item.type==2)?item.type:'',
            id:item.id,
        })
    }


    saveTradeMarket = ()=>{
        let {type,goodsNo,model,content,price,saleNum,file} = this.state

        if(!goodsNo){
            alert('请输入货号')
            return
        }

        if(!model){
            alert('请输入尺码')
            return
        }

        if(!type){
            alert('请选择发布类型')
            return
        }

        let data=new FormData();
        data.append('price',price-0)
        data.append('saleNum',saleNum-0)
        data.append('goodsNo',goodsNo)
        data.append('model',model)
        data.append('type',type)
        data.append('content',!content?'':content)


        this.state.file && this.state.file.map(item=>{
            data.append('file',item)
        })


        if(type==1){
            this.setState({
                modalVisible: false,
            },()=>{
                axios.post(`/notice/saveTradeMarket`, data)
                    .then( (response)=> {
                        console.log(response,'发布信息');

                        if(response.data.code==0){
                            Toast.info('发布成功')
                            this.onRefresh()
                        }else {
                            Toast.info(response.data.message)
                        }



                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            })
        }else {
            axios.get(`/goods/getGoodsQuotation`, {
                goodsNo,
                model:model.indexOf(' ') == -1 ?model:''
            })
                .then( (ress)=> {
                    console.log(ress);

                    if(ress.data.code==0){
                        if(ress.data.priceList.length > 0){
                            this.setState({
                                modalVisible: false,
                            },()=>{
                                axios.post(`/notice/saveTradeMarket`, data)
                                    .then( (response)=> {
                                        console.log(response,'发布信息');

                                        if(response.data.code==0){
                                            Toast.info('发布成功')
                                            this.onRefresh()
                                        }else {
                                            Toast.info(response.data.message)
                                        }



                                    })
                                    .catch(function (error) {
                                        console.log(error);
                                    });
                            })
                        }else {
                            // alert('请先上架该商品')
                            Alert.alert('请先上架该商品？',`确定上架吗？`,
                                [
                                    {text:"取消", onPress:this.cancelSelected},
                                    {text:"确认", onPress:()=>{this.comfirmSelected({goodsNo,})}}
                                ],
                                { cancelable: false }
                            );

                        }
                    }else {
                        alert(ress.data.message)
                    }



                })
                .catch(function (error) {
                    console.log(error);
                });
        }

    }

    comfirmSelected = (item)=>{
        const {roleStr} = this.props.reduxData;
        this.setState({
            modalVisible: false
        })

        if(roleStr==1){
            let data = {
                isApp: 1,
                role: 2
            }
            axios.get(`/user/changeUserRole`,data,
            )
                .then((response) =>{
                    console.log(response);

                    if(response.data.code==0){
                        global.roleStr = data.role;
                        // console.log('2313123213123123123',data.role);
                        // Toast.info(`切换${data.role==1?'买家':'卖家'}成功`)
                        this.props.setRoleStr(data.role);
                        this.uploadItem(item)
                        storage.load({ //读取tokenKey
                            key: 'username',
                            autoSync: false
                        }).then(ret => {
                            ret.roleStr = data.role;

                            storage.save({
                                key: 'username',  // 注意:请不要在key中使用_下划线符号!
                                //data是你想要存储在本地的storage变量，这里的data只是一个示例。如果你想存一个叫item的对象，那么可以data: item，这样使用
                                data:ret,
                                // 如果不指定过期时间，则会使用defaultExpires参数
                                // 如果设为null，则永不过期
                                expires: null
                            });
                        }).catch((error) => {
                        });
                    }else {
                        Toast.info(response.data.message)
                    }

                })
                .catch(function (error) {
                    console.log(error);
                })
        }else {
            this.uploadItem(item)
        }

    }

    cancelSelected = ()=>{

    }

    resetMess = ()=>{
        this.setState({
            messType:[
                {
                    value:1,
                    flag:false
                },
                {
                    value:2,
                    flag:false
                },

            ],
        })
    }

    addClue = ()=>{
        let {type,model,content,price,saleNum,file} = this.state

        console.log(type,'typetype');
        if(!type){
            alert('请选择发布类型')
            return
        }

        if(!content){
            alert('请填写内容')
            return
        }
        let data=new FormData();
        data.append('content',!content?'':content)
        data.append('type',type)


        this.state.file && this.state.file.map(item=>{
            data.append('file',item)
        })
        
        console.log(data,'datadata');

        this.setState({
            modalVisible: false,
        },()=>{
            axios.post(`/notice/addClue`, data)
                .then( (response)=> {
                    console.log(response,'发布线索list');

                    if(response.data.code==0){
                        Toast.info('发布线索成功')
                        this.onRefresh()
                    }else {
                        Toast.info(response.data.message)
                    }



                })
                .catch(function (error) {
                    console.log(error, 'hjdhjahdjkahsdjahsjdkhasjkdhk');
                });
        })



    }


    updatePublishInfo = (item)=>{
        this.setState({
            modalVisible: false,
        },()=>{
            axios.get(`/notice/updatePublishInfo`, {
                type:item,
                id:this.state.id
            })
                .then( (response)=> {
                    console.log(response,'修改信息');

                    if(response.data.code==0){
                        Toast.info(item==1?'删除成功':'刷新成功')
                        this.onRefresh()
                    }else {
                        Toast.info(response.data.message)
                    }



                })
                .catch(function (error) {
                    console.log(error);
                });
        })
    }
    deleteClue = (item)=>{
        this.setState({
            modalVisible: false,
        },()=>{
            axios.get(`/notice/deleteClue`, {
                id:this.state.id
            })
                .then( (response)=> {
                    console.log(response,'修改线索');

                    if(response.data.code==0){
                        Toast.info('删除成功')
                        this.onRefresh()
                    }else {
                        Toast.info(response.data.message)
                    }



                })
                .catch(function (error) {
                    console.log(error);
                });
        })
    }


    focus=()=>{

        this.setState({
            padd:300,
        })

    }

    toastMsg = (_item)=>{
        Toast.info(`发货时间:${_item.sendTime}天 配货率:${_item.goodsRate}% 售后率:${_item.saleRate}%`,2)
    }

    setGoodsNo = (goodsNo)=>{
        let price = ''
        let image = ''
        let priceFlag = false

        axios.get(`/goods/getGoodsBaseByNo`,
            {goodsNo}
        )
            .then((response) =>{
                console.log(response);
                if(response.data.code==0){
                    if(response.data.data.goods){
                        price = response.data.data.goods.marketPrice+''
                        image = response.data.data.goods.image
                        priceFlag = true
                    }else {
                        price = ''
                        priceFlag = false
                    }

                }

                this.setState({
                    price,priceFlag,image
                },()=>{
                    console.log(this.state.price,'pricepriceprice');
                })
            })
            .catch(function (error) {
                console.log(error);
            })

        this.setState({
            goodsNo,
        })

    }

    componentWillReceiveProps(newporops) {

        this.getPublishList();
        this.geClueList();

        console.log(newporops.navigation.state.params,'publish');
        let messageJump = newporops.navigation.state.params;
        if(messageJump && messageJump.messageJump && messageJump.messageJump.publishId){
            this.setState({
                handelMsg:[
                    {
                        value:"交易大厅",
                        flag:true
                    },
                    {
                        value:"批量发布",
                        flag:false
                    },

                    {
                        value:"精确发布",
                        flag:false
                    },

                ],
                changeMsg: '交易大厅'
            });
            axios.post(`/notice/getTradeMarketList`, {
                current:1,
                pageSize:50,
                marketId:messageJump.messageJump.publishId
            })
                .then( (response)=> {
                    console.log(response,'获取交易大厅信息列表');

                    this.setState({
                        aa:true,
                        refreshing:false
                    },()=>{
                        if(response.data.code==0){
                            this.setState({
                                unreadData:response.data.data.marketList,
                            })
                        }else {
                            Toast.info(response.data.message)
                        }
                    })



                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            this.getTradeMarketList()
        }
    }

    render(){

        let {clueList,pics,picsIndex,ordStatu,handelMsg,changeMsg,unreadData,readData,refreshing,role} = this.state;

        let modalBackgroundStyle = {
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
        };
        let innerContainerTransparentStyle = this.state.transparent
            ? { backgroundColor: '#fff', padding: 10 ,
                // height:"90%",
                overflow:"hidden"}
            : null;

        const {roleStr} = this.props.reduxData;

        return (

            <View style={{height: Dimensions.get("window").height,backgroundColor:"#fff"}}>

                <View>
                    <Image source={topBg} style={{height:70,width:Dimensions.get('window').width,resizeMode:"stretch"}} />
                </View>

                <View style={{borderTopColor:"#f96f59",borderTopWidth:1,flexDirection:"row",justifyContent:"space-around"}}>
                    {
                        handelMsg.map((item,index)=>

                            <LinearGradient key={index} colors={[item.flag?'#f96f59':"#fff", item.flag?'#f94939':"#fff"]} style={{width:"33.33%"}}>
                                <TouchableHighlight   onPress={()=>this.handelMsg(item)} style={{padding:10,alignItems:"center",
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

                                        <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}>{this.state.modal=='查看图片'?'查看图片':this.state.modal=='发布线索'?'发布信息':`${this.state.role==1?'求货':''}信息发布`}</Text></View>



                                        <TouchableHighlight underlayColor={"#fff"} onPress={this._setModalVisible.bind(this,false) } style={{}}>
                                            <Image style={{height:30,width:30}} source={close}/>
                                        </TouchableHighlight>

                                    </View>


                                    {
                                        this.state.modal=='查看图片'?
                                            <View style={{height:Dimensions.get('window').height-200}}>

                                                {
                                                    <View>
                                                        <Carousel
                                                            autoplay={false}
                                                            infinite={true}
                                                            selectedIndex={picsIndex-0}
                                                            dots={false}

                                                        >
                                                            {pics.map((val, index) => (
                                                                <View key={index}>
                                                                    <Image
                                                                        source={{uri:val}}
                                                                        style={{
                                                                            height: '100%',
                                                                            width: '100%',
                                                                            resizeMode: "contain"
                                                                        }}
                                                                        alt=""
                                                                    />
                                                                </View>
                                                            ))}
                                                        </Carousel>
                                                    </View>


                                                }
                                            </View>:

                                            this.state.modal=='发布信息'?
                                            <View>
                                                <ScrollView style={{maxHeight:Dimensions.get('window').height-200}}>
                                                    <View style={{padding:10,paddingBottom:this.state.padd}}>

                                                        <View style={styles.a}>
                                                            <Text style={styles.f}><Text style={{color:"red"}}>*</Text>类型:</Text>
                                                            <View style={[styles.b,{flex:3,flexDirection:'row'}]}>
                                                                {
                                                                    this.state.messType.map((item,index)=>
                                                                        <TouchableHighlight
                                                                            onPress={()=>{this.changeType(item)}} key={index} underlayColor="transparent">
                                                                            <View style={{flexDirection:"row",marginRight:15,alignItems:"center"}}>
                                                                                <View style={{backgroundColor:item.flag ? "#f96f59" :'#fff',marginRight:5,
                                                                                    width:20,height:20,borderRadius:10,borderColor:"#ccc",borderWidth:1,overflow:"hidden"}} >
                                                                                    <Image style={{width:20,height:20}} source={selectIcon}/>
                                                                                </View>
                                                                                <Text>{item.value==1?'求货':'出货'}</Text>
                                                                            </View>
                                                                        </TouchableHighlight>

                                                                    )
                                                                }
                                                            </View>
                                                        </View>
                                                        <View style={styles.a}>
                                                            <Text style={styles.f}><Text style={{color:"red"}}>*</Text>货号:</Text>
                                                            <View style={[styles.b,{flex:3}]}>
                                                                <TextInput
                                                                    placeholder={this.state.goodsNo?this.state.goodsNo:'请填写商品货号'}
                                                                    style={[styles.teCor,{backgroundColor:!this.publish?"#fff":"#f0f0f0"}]}
                                                                    editable={!this.publish}
                                                                    underlineColorAndroid="transparent"
                                                                    value={this.state.goodsNo}
                                                                    autoCapitalize={'none'}
                                                                    // onFocus={this.focus}
                                                                    onChangeText={(goodsNo) => this.setGoodsNo(goodsNo)}
                                                                />
                                                            </View>
                                                        </View>

                                                        <View style={styles.a}>
                                                            <Text style={styles.f}><Text style={{color:"red"}}>*</Text>尺码:</Text>
                                                            <View style={[styles.b,{flex:3}]}>
                                                                <TextInput
                                                                    placeholder={this.state.model?this.state.model:'可填写多个尺码 空格隔开'}
                                                                    editable={!this.publish}
                                                                    style={[styles.teCor,{backgroundColor:!this.publish?"#fff":"#f0f0f0"}]}
                                                                    underlineColorAndroid="transparent"
                                                                    value={this.state.model}
                                                                    autoCapitalize={'none'}
                                                                    // onFocus={this.focus}
                                                                    onChangeText={(model) => this.setState({model})}
                                                                />
                                                            </View>
                                                        </View>

                                                        <View style={styles.a}>
                                                            <Text style={styles.f}>吊牌价:</Text>
                                                            <View style={[styles.b,{flex:3}]}>
                                                                <TextInput
                                                                    placeholder={this.publish?this.state.price+'':'请填写商品价格'}
                                                                    placeholderTextColor={this.publish?"#000":'#ccc'}
                                                                    editable={!this.publish}
                                                                    style={[styles.teCor,{backgroundColor:!this.publish?"#fff":"#f0f0f0"}]}
                                                                    underlineColorAndroid="transparent"
                                                                    value={this.state.price}
                                                                    onFocus={this.focus}
                                                                    keyboardType={'numeric'}
                                                                    onChangeText={(price) => this.setState({price})}
                                                                />
                                                            </View>
                                                        </View>

                                                        <View style={styles.a}>
                                                            <Text style={styles.f}>{this.state.role==1?'数量':'库存'}:</Text>
                                                            <View style={[styles.b,{flex:3}]}>
                                                                <TextInput
                                                                    placeholder={this.publish?this.state.saleNum+'':`请填写商品${this.state.role==1?'数量':'库存'}`}
                                                                    placeholderTextColor={this.publish?"#000":'#ccc'}
                                                                    style={[styles.teCor,{backgroundColor:!this.publish?"#fff":"#f0f0f0"}]}
                                                                    underlineColorAndroid="transparent"
                                                                    value={this.state.saleNum}
                                                                    onFocus={this.focus}
                                                                    editable={!this.publish}
                                                                    keyboardType={'numeric'}
                                                                    onChangeText={(saleNum) => this.setState({saleNum})}
                                                                />
                                                            </View>
                                                        </View>

                                                        <View style={styles.a}>
                                                            <Text style={styles.f}>描述:</Text>
                                                            <View style={[styles.b,{flex:3}]}>
                                                                <TextInput
                                                                    placeholder={this.state.content?this.state.content:'请填写描述内容'}
                                                                    style={[styles.teCor,{backgroundColor:!this.publish?"#fff":"#f0f0f0"}]}
                                                                    placeholderTextColor={this.publish?"#000":'#ccc'}
                                                                    multiline={true}
                                                                    editable={!this.publish}
                                                                    underlineColorAndroid="transparent"
                                                                    // value={this.state.content}
                                                                    onFocus={this.focus}
                                                                    onChangeText={(content) => this.setState({content})}
                                                                />
                                                            </View>
                                                        </View>

                                                        {
                                                            (!this.publish && this.state.image)?
                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>图片:</Text>
                                                                <View style={{flex:3}}>
                                                                    <View style={{height:210,marginTop:10}}>
                                                                        <Image style={{height:200,width:"80%",resizeMode:"contain"}}
                                                                               source={{uri:this.state.image}}
                                                                        />
                                                                    </View>
                                                                </View>
                                                            </View>:<View/>
                                                        }

                                                        {
                                                            (!this.publish&& this.state.image)?
                                                            <View style={styles.a}>
                                                                <Text style={styles.f}></Text>
                                                                <View style={{flex:3}}>
                                                                    <Text style={{color:'red'}}>如不使用上述图片 可自行上传图片</Text>
                                                                </View>
                                                            </View>:<View/>
                                                        }



                                                        {!this.publish&&<AddPic  addPic={this.addPic}/>}


                                                        {
                                                            (this.publish&&this.state.publishImg)?
                                                                <View style={styles.a}>
                                                                    <Text style={styles.f}>图片:</Text>
                                                                    <View style={{flex:3}}>
                                                                        {
                                                                            this.state.publishImg.map((item,index)=>
                                                                                <View key={index} style={{height:210,marginTop:10}}>
                                                                                    <Image style={{height:200,width:"80%",resizeMode:"contain"}}
                                                                                           source={{uri:item}}
                                                                                    />
                                                                                </View>
                                                                            )
                                                                        }
                                                                    </View>
                                                                </View>
                                                                :null
                                                        }

                                                        {!this.publish?
                                                            <View style={{alignItems:"center",justifyContent:"center",marginTop:20}}>


                                                                <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,alignItems:"center",justifyContent:"center"}}>
                                                                    <TouchableHighlight onPress={()=>{this.saveTradeMarket()}} underlayColor="transparent" style={{width:100,padding:10,alignItems:"center",justifyContent:"center",}}>
                                                                        <Text style={{color:"#fff"}}>发布</Text>
                                                                    </TouchableHighlight>
                                                                </LinearGradient>


                                                            </View>
                                                            :<View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-around",marginTop:20}}>


                                                                <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,alignItems:"center",justifyContent:"center",width:100}}>
                                                                    <TouchableHighlight onPress={()=>{this.updatePublishInfo(2)}} underlayColor="transparent" style={{padding:10,alignItems:"center",justifyContent:"center",}}>
                                                                        <Text style={{color:"#fff"}}>刷新</Text>
                                                                    </TouchableHighlight>
                                                                </LinearGradient>

                                                                <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,alignItems:"center",justifyContent:"center",width:100}}>
                                                                    <TouchableHighlight onPress={()=>{this.updatePublishInfo(1)}} underlayColor="transparent" style={{padding:10,alignItems:"center",justifyContent:"center",}}>
                                                                        <Text style={{color:"#fff"}}>删除</Text>
                                                                    </TouchableHighlight>
                                                                </LinearGradient>


                                                            </View>}


                                                    </View>



                                                </ScrollView>

                                            </View>:
                                                <View>
                                                    <ScrollView style={{maxHeight:Dimensions.get('window').height-200}}>
                                                        <View style={{padding:10,paddingBottom:this.state.padd}}>
                                                            <View style={styles.a}>
                                                                <Text style={styles.f}><Text style={{color:"red"}}>*</Text>类型:</Text>
                                                                <View style={[styles.b,{flex:3,flexDirection:'row'}]}>
                                                                    {
                                                                        this.state.messType.map((item,index)=>
                                                                            <TouchableHighlight
                                                                                onPress={()=>{this.changeType(item)}} key={index} underlayColor="transparent">
                                                                                <View style={{flexDirection:"row",marginRight:15,alignItems:"center"}}>
                                                                                    <View style={{backgroundColor:item.flag ? "#f96f59" :'#fff',marginRight:5,
                                                                                        width:20,height:20,borderRadius:10,borderColor:"#ccc",borderWidth:1,overflow:"hidden"}} >
                                                                                        <Image style={{width:20,height:20}} source={selectIcon}/>
                                                                                    </View>
                                                                                    <Text>{item.value==1?'求货':'出货'}</Text>
                                                                                </View>
                                                                            </TouchableHighlight>

                                                                        )
                                                                    }
                                                                </View>
                                                            </View>

                                                            <Text style={{color:"red",marginTop:10,fontWeight:"bold"}}>请务必填写货号 尺码 价格 数量 4要素</Text>


                                                            <View style={styles.a}>
                                                                <Text style={styles.f}>信息:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <TextInput
                                                                        placeholder={this.state.content?this.state.content:'请填写信息内容'}
                                                                        style={[styles.teCor,{backgroundColor:!this.publish?"#fff":"#f0f0f0",height:100}]}
                                                                        placeholderTextColor={this.publish?"#000":'#ccc'}
                                                                        multiline={true}
                                                                        editable={!this.publish}
                                                                        underlineColorAndroid="transparent"
                                                                        // value={this.state.content}
                                                                        onFocus={this.focus}
                                                                        onChangeText={(content) => this.setState({content})}
                                                                    />
                                                                </View>
                                                            </View>
                                                            <View style={{marginTop:10}}><Text style={{color:"grey"}}>
                                                                (可直接上传复杂/批量（出）求货图片，系统自动识别)
                                                            </Text></View>

                                                            {!this.publish&&<AddPic  addPic={this.addPic}/>}


                                                            {
                                                                (this.publish&&this.state.publishImg)?
                                                                    <View style={styles.a}>
                                                                        <Text style={styles.f}>图片:</Text>
                                                                        <View style={{flex:3}}>
                                                                            {
                                                                                this.state.publishImg.map((item,index)=>
                                                                                    <View key={index} style={{height:210,marginTop:10}}>
                                                                                        <Image style={{height:200,width:"80%",resizeMode:"contain"}}
                                                                                               source={{uri:item}}
                                                                                        />
                                                                                    </View>
                                                                                )
                                                                            }
                                                                        </View>
                                                                    </View>
                                                                    :null
                                                            }

                                                            {!this.publish?
                                                                <View style={{alignItems:"center",justifyContent:"center",marginTop:20}}>


                                                                    <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,alignItems:"center",justifyContent:"center"}}>
                                                                        <TouchableHighlight onPress={()=>{this.addClue()}} underlayColor="transparent" style={{width:100,padding:10,alignItems:"center",justifyContent:"center",}}>
                                                                            <Text style={{color:"#fff"}}>发布</Text>
                                                                        </TouchableHighlight>
                                                                    </LinearGradient>


                                                                </View>
                                                                :<View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-around",marginTop:20}}>
                                                                    <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,alignItems:"center",justifyContent:"center",width:100}}>
                                                                        <TouchableHighlight onPress={()=>{this.deleteClue(1)}} underlayColor="transparent" style={{padding:10,alignItems:"center",justifyContent:"center",}}>
                                                                            <Text style={{color:"#fff"}}>删除</Text>
                                                                        </TouchableHighlight>
                                                                    </LinearGradient>


                                                                </View>}


                                                        </View>



                                                    </ScrollView>

                                                </View>

                                    }


                                </View>


                            </View>
                        </View>
                    </Modal>



                </View>


                {
                    changeMsg=='交易大厅'?
                        <View  style={{
                            ...Platform.select({
                                android:{
                                    paddingBottom:310,
                                },
                                ios:{
                                    // paddingBottom:240,
                                    paddingBottom:280,
                                }
                            }),

                            ...ifIphoneX({
                                paddingBottom:320,
                            })
                        }}>

                            <View style={{flexDirection:"row",justifyContent:"space-between",marginTop:5}}>
                                <View style={{width:"30%"}}>
                                    <Picker
                                        data={this.state.orderStatus}
                                        cols={1}
                                        value={ordStatu}
                                        onChange={ordStatu => {this.setOrdStatu(ordStatu)}}
                                        className="forss">
                                        <RoomInfo></RoomInfo>
                                    </Picker>
                                </View>
                                <View style={{width:"45%"}}>
                                    <TextInput
                                        placeholder={'请填写商品货号'}
                                        style={[styles.teCor,{backgroundColor:"#fff",padding:8}]}
                                        underlineColorAndroid="transparent"
                                        autoCapitalize={'none'}
                                        // onFocus={this.focus}
                                        // value={this.state.seachGoodsNo}
                                        onChangeText={(seachGoodsNo) => this.setState({seachGoodsNo})}
                                    />
                                </View>
                                <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,alignItems:"center",justifyContent:"center",width:'20%'}}>
                                    <TouchableHighlight onPress={()=>{this.getTradeMarketList()}} underlayColor="transparent" style={{padding:8,alignItems:"center",justifyContent:"center",}}>
                                        <Text style={{color:"#fff",fontWeight:"bold"}}>搜索</Text>
                                    </TouchableHighlight>
                                </LinearGradient>
                            </View>
                            <View style={{flexDirection:"row",justifyContent:"space-between",padding:5}}>

                                <TouchableHighlight onPress={()=>{this.isMeList()}} underlayColor="transparent" style={{}}>
                                    <Text style={{color:"#f96f59",fontWeight:"bold",textDecorationLine:"underline"}}>只看我发布的</Text>
                                </TouchableHighlight>
                                <TouchableHighlight onPress={()=>{this.onRefresh()}} underlayColor="transparent" style={{}}>
                                    <Text style={{color:"#f96f59",fontWeight:"bold",textDecorationLine:"underline"}}>刷新</Text>
                                </TouchableHighlight>
                            </View>


                            <View>
                                <FlatList
                                    data={unreadData}  //列表的渲染数据源
                                    ListEmptyComponent={()=><View style={{marginTop:30,alignItems:"center"}}><Text>{this.state.aa?'暂无数据':'获取交易大厅数据中'}</Text></View>} //列表没有数据时展示，箭头函数中可以写一个react组件
                                    ListFooterComponent={this.state.noData?()=><View style={{marginTop:10,alignItems:"center"}}><Text>到底啦</Text></View>:null} //列表没有数据时展示，箭头函数中可以写一个react组件
                                    getItemLayout={(data, index) => ( {length: 220, offset: 220 * index, index} )}
                                    initialNumToRender={10}  //首次渲染的条数
                                    onEndReached={this.onEndReached}  //列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
                                    onEndReachedThreshold={0.1} //定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                                    onRefresh={this.onRefresh} //下拉刷新
                                    refreshing={refreshing} //下拉刷新时候的正在加载的符号，设置为true显示，false隐藏。加载完成，需要设置为false
                                    keyExtractor={(item,index)=>`${index}`}
                                    renderItem={({item,index}) => (  //渲染列表的方式

                                        <View key={index} style={{padding:10,borderBottomColor:"#ccc",borderBottomWidth:1}}>
                                            <View style={{flexDirection:"row"}}>
                                                <View style={{flex:1}}>
                                                    <View  style={{width:50,height:50,borderRadius:10,overflow:"hidden"}}>
                                                        <Image style={{width:50,height:50}} source={{uri:item.headImg}}/>
                                                    </View>
                                                </View>
                                                <View style={{flex:4}}>
                                                    <View><Text style={{fontWeight:"bold",color:"#606792",}}>{item.type==1?'(求货)':'(出货)'}</Text></View>
                                                    <View style={{marginTop:5}}><Text style={{fontWeight:"bold"}}>{item.content}</Text></View>
                                                    <View style={{marginTop:5,flexDirection:"row",flexWrap:"wrap"}}>

                                                        <Text  style={{color:"grey"}}>{`尺码:${item.model}, 吊牌价:${item.price}, 货号:`}</Text>
                                                        <Text style={{color:"grey"}} selectable={true}>{item.goodsNo}</Text>
                                                        <Text style={{color:"grey"}}>, 数量:{item.saleNum}</Text>
                                                    </View>

                                                    {item.images.length>0&&
                                                    <View style={{marginTop:5,flexDirection:"row"}}>
                                                        {item.images.map((imgs,_index)=>
                                                            <TouchableHighlight key={_index} underlayColor="transparent" onPress={()=>{this.seePic(item.images,_index)}} style={{width:'30%',marginRight:5}} key={index}>
                                                                <Image style={{width:'100%',height:80,resizeMode:"contain"}}  source={{uri:imgs}}/>
                                                            </TouchableHighlight>

                                                        )}
                                                    </View>}

                                                    <View>
                                                        <Text style={{color:"grey"}}>{setDate(moment(item.createTime))}</Text>
                                                    </View>
                                                    <View  style={{marginTop:10}}>

                                                        {
                                                            item.type == 2&&
                                                            <View style={{flexDirection:'row-reverse'}}>
                                                                <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,alignItems:"center",justifyContent:"center",width:100}}>
                                                                    <TouchableHighlight onPress={()=>{this.getSearchShop(item)}} underlayColor="transparent" style={{width:100,padding:5,borderRadius:5,alignItems:"center",justifyContent:"center",}}>
                                                                        <Text style={{color:"#fff"}}>立即购买</Text>
                                                                    </TouchableHighlight>
                                                                </LinearGradient>
                                                            </View>

                                                        }

                                                        {
                                                            item.type == 1&&
                                                            <View style={{flexDirection:'row-reverse'}}>
                                                                <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,alignItems:"center",justifyContent:"center",width:100}}>
                                                                    <TouchableHighlight onPress={()=>{this.baojia(item)}} underlayColor="transparent" style={{width:100,padding:5,borderRadius:5,alignItems:"center",justifyContent:"center",}}>
                                                                        <Text style={{color:"#fff"}}>立即报价</Text>
                                                                    </TouchableHighlight>
                                                                </LinearGradient>

                                                            </View>
                                                        }



                                                    </View>
                                                    {
                                                        (item.type == 1) &&
                                                        <Text style={{
                                                            color: "grey",
                                                            textAlign: "right",marginTop:5
                                                        }}>(上传库存平台会自动通知买家下单)</Text>
                                                    }

                                                    {
                                                        (item.type==1)&&
                                                        <View style={{flexDirection:'row-reverse'}}>
                                                            <TouchableHighlight underlayColor="transparent" style={{marginTop:10}}>
                                                                <Text style={{color:"#f94939",textDecorationLine:"underline"}}>({item.priceList.length}条报价)</Text>
                                                            </TouchableHighlight>
                                                        </View>

                                                    }



                                                </View>
                                            </View>

                                            {this.state.pubIndex===index&&

                                            <View style={{alignItems:"center",justifyContent:"center"}}>
                                                <Text>暂无报价信息</Text>
                                            </View>

                                            }

                                            {
                                                (item.type==1) && (item.priceList&&item.priceList.length>0)&&
                                                <View>
                                                    {
                                                        item.priceList.map((_item,indexx)=>

                                                            <TouchableHighlight  style={{marginTop:5}} key={indexx} onPress={()=>{this.toastMsg(_item)}} underlayColor="transparent">

                                                                <View>
                                                                    <View  style={{flexDirection:"row",flexWrap:"wrap"}}>
                                                                        <Text style={{color:"grey",textDecorationLine:"underline"}}>渠道:{_item.channelName}</Text>
                                                                        {
                                                                            _item.models.map((model,ii)=>

                                                                                <View key={ii} style={{flexDirection:"row",marginLeft:10}}>
                                                                                    <Text style={{color:"grey"}}>{model.modelName}*</Text>
                                                                                    <Text style={{color:"#000"}}>{model.stockNum}件--</Text>
                                                                                    <Text style={{color:"red"}}>{model.salePrice}元</Text>
                                                                                </View>


                                                                            )
                                                                        }
                                                                    </View>

                                                                </View>




                                                            </TouchableHighlight>

                                                        )
                                                    }

                                                    {
                                                        (item.type==1)&&
                                                        <View style={{flexDirection:"row-reverse"}}>
                                                            <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,alignItems:"center",justifyContent:"center",width:100,marginTop:5}}>
                                                                <TouchableHighlight onPress={()=>{this.getSearchShop(item,true)}} underlayColor="transparent" style={{width:100,padding:5,borderRadius:5,alignItems:"center",justifyContent:"center",}}>
                                                                    <Text style={{color:"#fff"}}>立即购买</Text>
                                                                </TouchableHighlight>
                                                            </LinearGradient>
                                                        </View>
                                                    }



                                                </View>
                                            }




                                        </View>


                                    )}
                                />
                            </View>
                        </View>
                        :changeMsg=='精确发布'?
                        <View>

                            <View style={{flexDirection:"row-reverse",marginTop:5,marginRight:5}}>
                                <TouchableHighlight onPress={this.addPublish} underlayColor="transparent" >
                                    <Image source={add} style={{width:20,height:20}}></Image>
                                </TouchableHighlight>
                            </View>

                            <View style={{height: Dimensions.get("window").height-185}}>
                                <FlatList
                                    data={readData}  //列表的渲染数据源
                                    ListEmptyComponent={()=><View style={{marginTop:30,alignItems:"center"}}><Text>{this.state.aa?'暂无数据':'获取数据中'}</Text></View>} //列表没有数据时展示，箭头函数中可以写一个react组件
                                    getItemLayout={(data, index) => ( {length: 80, offset: 80 * index, index} )}
                                    initialNumToRender={10}  //首次渲染的条数
                                    // onEndReached={this.onEndReached}  //列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
                                    onEndReachedThreshold={0.5} //定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                                    onRefresh={this.onRefresh} //下拉刷新
                                    refreshing={refreshing} //下拉刷新时候的正在加载的符号，设置为true显示，false隐藏。加载完成，需要设置为false
                                    keyExtractor={(item,index)=>`${index}`}
                                    renderItem={({item}) => (  //渲染列表的方式

                                        <View style={{flexDirection:"row",justifyContent:"space-between",padding:10,borderBottomColor:"#ccc",borderBottomWidth:1}}>

                                            <View style={{flex:1}}>
                                                <Text style={{fontWeight:"bold"}}>{item.content}</Text>
                                                <Text style={{color:"grey",marginTop:5}}>{`尺码:${item.model}, 吊牌价:${item.price}, 货号:${item.goodsNo}, 数量:${item.saleNum}`}</Text>
                                            </View>
                                            <TouchableHighlight underlayColor="transparent" onPress={()=>{this.publishItem(item,true)}} style={{justifyContent:"center"}}>
                                                <Text style={{color:"red",textDecorationLine:"underline"}}>{item.status==0?'待审核':item.status==1?'已审核':'驳回'}></Text>
                                            </TouchableHighlight>


                                        </View>


                                    )}
                                />
                            </View>
                        </View>:
                        <View>

                            <View style={{flexDirection:"row-reverse",marginTop:5,marginRight:5}}>
                                <TouchableHighlight onPress={this.addClues} underlayColor="transparent" >
                                    <Image source={add} style={{width:20,height:20}}></Image>
                                </TouchableHighlight>
                            </View>

                            <View style={{height: Dimensions.get("window").height-185}}>
                                <FlatList
                                    data={clueList}  //列表的渲染数据源
                                    ListEmptyComponent={()=><View style={{marginTop:30,alignItems:"center"}}><Text>{this.state.aa?'暂无数据':'获取数据中'}</Text></View>} //列表没有数据时展示，箭头函数中可以写一个react组件
                                    getItemLayout={(data, index) => ( {length: 80, offset: 80 * index, index} )}
                                    initialNumToRender={10}  //首次渲染的条数
                                    // onEndReached={this.onEndReached}  //列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
                                    onEndReachedThreshold={0.5} //定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                                    onRefresh={this.onRefresh} //下拉刷新
                                    refreshing={refreshing} //下拉刷新时候的正在加载的符号，设置为true显示，false隐藏。加载完成，需要设置为false
                                    keyExtractor={(item,index)=>`${index}`}
                                    renderItem={({item}) => (  //渲染列表的方式

                                        <View style={{flexDirection:"row",justifyContent:"space-between",padding:10,borderBottomColor:"#ccc",borderBottomWidth:1}}>

                                            <View style={{flex:1}}>
                                                <Text style={{fontWeight:"bold"}}>{item.content}</Text>
                                                </View>
                                            <TouchableHighlight underlayColor="transparent" onPress={()=>{this.publishItem(item)}} style={{justifyContent:"center"}}>
                                                <Text style={{color:"red",textDecorationLine:"underline"}}>{item.status==0?'待处理':'已处理'}></Text>
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
    message:{
        flexDirection:"row",
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
        flexDirection:"row",alignItems:"center",marginTop:10
    },

    b:{
        marginLeft:10,flex:1,
    },
    f:{
        flex:1,color:"grey"
    },
    teCor:{minWidth:'100%',padding:10,backgroundColor:"#fff",borderRadius:5,borderColor:"#ccc",borderWidth:1},

});

export default connect (
    state => ({reduxData: state.reduxData}),
    dispath => bindActionCreators({setRoleStr},dispath)
)(ReadMessage)

