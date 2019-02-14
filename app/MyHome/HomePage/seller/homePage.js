import React from 'react';
import {

    Text,
    TextInput,
    StyleSheet,
    TouchableHighlight,
    View,Dimensions,
    FlatList,Modal,ScrollView,Image

} from 'react-native';

import axios from '../../../axios'
import s1 from "../style/234.png";
import right from "../style/right.png";
import moment from "moment";
import {Picker,DatePicker,Toast} from "antd-mobile";
import close from "../style/close.png";
import AddModels from "./addModels";
import topBg from "../style/topBg.png";
import search from "../style/search.png";
import add from "../../GoodSelect/style/add.png";
import LinearGradient from "react-native-linear-gradient";
import shose from "../style/shose.png";
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

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            goodsName:'',
            goodsList:[],
            channelList:[],
            genderList:[
                {
                    label:'男',
                    value:'1'
                },
                {
                    label:'女',
                    value:'0'
                },
            ],
            seasonList:[
                {
                    label:'春季',
                    value:'spring'
                },
                {
                    label:'夏季',
                    value:'summer'
                },
                {
                    label:'秋季',
                    value:'autumn'
                },
                {
                    label:'冬季',
                    value:'winter'
                },
            ],
            categoryList:[
                {
                    label:'鞋',
                    value:'鞋'
                },
                {
                    label:'服饰',
                    value:'服饰'
                },
                {
                    label:'配饰',
                    value:'配饰'
                },
            ],
            shelvesList:[
                {
                    value:'1',
                    label:'下架'
                },
                {
                    value:'2',
                    label:'上架'
                },

            ],
            refreshing:false,
            aa:false,
            noData:false,
            date:null,
            pages:1,
            animationType: 'none',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示
            goodsItem:{},
            gender:['1'],
            season:[],
            shelves:[],
            category:null,
            channelId:[],
            goodsNo:null,
            shelvesGoodsName:null,
            brandName:null,
            series:null,
            type:[],
            sport:null,
            color:null,
            marketPrice:null,
            salePrice:null,
            changeSalePrice:null,
            changeStock:null,
            modelList:[],
            editGoodsInfo:{},
            padd:10

        };

        this.goodsItem = {};
        this.timer = null;
    }


    focus=()=>{

        this.setState({
            padd:300,
        })


    }

    //查询渠道,上架弹框
    submit=()=>{


        this.setState({
            modalVisible: true,
            gender:['1'],
            season:[],
            modal:"上架",
            category:null,
            channelId:[],
            date:null,
            goodsNo:null,
            shelvesGoodsName:null,
            brandName:null,
            series:null,
            type:[],
            sport:null,
            color:null,
            marketPrice:null,
            salePrice:null,
            modelList:[],

        },()=>{
            axios.get(`/goods/getChannelKV`,{},

            )
                .then((response) =>{
                    console.log(response);
                    if(response.data.code==0){

                        let channelList = []

                        response.data.data.channelList.map(item=>{


                            let a = {
                                label:item.channelName,
                                value:item.channelId+''
                            }

                            channelList.push(a)

                        })

                        this.setState({
                            channelList
                        })
                    }



                })
                .catch(function (error) {
                    console.log(error);
                })
        })
    }


    //上啦加载
    onEndReached = ()=>{
        let {pages,goodsList,noData} = this.state;


        if(!noData){
            this.setState({
                pages:pages+1
            },()=>{
                axios.post(`/goods/getGoodsList`,
                    {
                        goodsNo:this.state.goodsName,
                        current:this.state.pages,
                        pageSize:10,
                    },

                )
                    .then((response) =>{
                        console.log(response);
                        this.setState({
                            aa:true,
                            refreshing:false,

                        },()=>{
                            if(response.data.code==0){

                                if(response.data.data.stockList.length==0){
                                    this.setState({
                                        noData:true
                                    })
                                }else{
                                    this.setState({
                                        goodsList:[...goodsList,...response.data.data.stockList]
                                    })
                                }



                            }
                        })



                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            })
        }


    }

    _setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    };



    //确定上架
    goodsShelves=()=>{

        let {channelId,gender,goodsNo,shelvesGoodsName,brandName,season,series,type,category,sport,color,marketPrice,date,salePrice,modelList} = this.state

        if(!channelId[0]){
            alert('请选择渠道')
            return
        }

        if(!goodsNo){
            alert('请填写商品货号')
            return
        }

        if(!shelvesGoodsName){
            alert('请填写商品名称')
            return
        }

        if(!brandName){
            alert('请填写品牌')
            return
        }

        if(!season[0]){
            alert('请选择季节')
            return
        }

        if(!date){
            alert('请选择上市日期')
            return
        }

        if(!category){
            alert('请填写分类')
            return
        }

        if(!marketPrice){
            alert('请填写市场价格')
            return
        }

        if(!salePrice){
            alert('请填写售卖价格')
            return
        }

        if(!gender[0]){
            alert('请选择性别')
            return
        }

        if(!series){
            alert('请填写系列')
            return
        }

        if(!type[0]){
            alert('请选择类型')
            return
        }

        if(!color){
            alert('请填写颜色')
            return
        }

        if(modelList.length==0){
            alert('请添加型号')
            return
        }

        let data = {
            channelId:channelId[0],
            sex:gender[0],
            goodsNo:goodsNo,
            goodsName:shelvesGoodsName,
            brandName:brandName,
            season:season[0],
            series:series,
            type:type[0],
            category:category,
            sport:sport,
            color:color,
            marketTime:moment(date).format('YYYY-MM-DD'),
            marketPrice:marketPrice-0,
            salePrice:salePrice-0,
            modelList:modelList,

        }




        axios.post(`/goods/goodsShelves`,data,)
            .then((response) =>{
                console.log(response);
                this.onRefresh()
                alert(response.data.code==0?'上架成功':response.data.message)
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    //搜索货物
    searchGoods = ()=>{
        axios.post(`/goods/getGoodsList`,
            {
                goodsNo:this.state.goodsName,
                current:1,
                pageSize:10,
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
                            goodsList:response.data.data.stockList
                        })
                    }
                })



            })
            .catch(function (error) {
                console.log(error);
            })
    }


    getGoodsBaseByNo = ()=>{

    }


    setGoodsNo = (item)=>{

        this.setState({
            goodsNo:item
        });
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            axios.get(`/goods/getGoodsBaseByNo`,
                {goodsNo:item}
            )
                .then((response) =>{
                    console.log(response);
                    if(response.data.code==0){

                        if(response.data.data.goods){

                            let goods = response.data.data.goods

                            let gender = [];
                            let season = [];
                            let type = [];
                            let channelId = [];

                            let {categoryList} = this.state

                            let a = this.state.channelList.filter(item=> {return item.value==goods.channelId})
                            let b = categoryList.filter(item=> {return item.value==goods.type})

                            if(b.length==0){
                                let c = {
                                    label:goods.type,
                                    value:goods.type,
                                }

                                categoryList.push(c)
                            }

                            gender[0] = goods.sex!=null?goods.sex+'':'1';
                            season[0] = goods.season?goods.season:'';
                            type[0] = goods.type?goods.type:'';
                            channelId[0] = a.length>0?a[0].value:'';


                            this.setState({

                                gender,
                                season,
                                type,
                                channelId,
                                categoryList,
                                brandName:goods.brandName?goods.brandName:null,
                                goodsNo:goods.goodsNo?goods.goodsNo:null,
                                shelvesGoodsName:goods.goodsName?goods.goodsName:null,
                                series:goods.series?goods.series:null,
                                category:goods.category?goods.category:null,
                                sport:goods.sport?goods.sport:null,
                                color:goods.color?goods.color:null,
                                marketPrice:goods.marketPrice?goods.marketPrice+'':null,
                                salePrice:goods.salePrice?goods.salePrice+'':null,
                                date:goods.marketTime?new Date(goods.marketTime):null,
                            })
                        }

                    }
                })
                .catch(function (error) {
                    console.log(error);
                })
        }, 1000);
    };


    componentWillMount() {

        this.searchGoods()
    }


    onRefresh = ()=>{

        this.setState({
            refreshing:true,
        },()=>{
            this.searchGoods()
        })
    }


    addModel = (model)=>{

        
        
        let modelList = model.filter(item=> {return item.stock && item.name });
        
        console.log(modelList);
        
        this.setState({
            modelList
        })

    }



    changeGoodsInfo = (item)=>{


        this.setState({
            editGoodsInfo :item,
            changeSalePrice:item.salePrice+'',
            changeStock:item.stock+'',
            modal:"12",
            modalVisible:true

        },()=>{


            let {editGoodsInfo} = this.state
            axios.get(`/goods/getGoodsById`,
                {
                    goodsId:item.goodsId,
                },

            )
                .then((response) =>{
                    console.log(response);
                    if(response.data.code==0){

                        let goods = response.data.data.goods

                        editGoodsInfo.category =goods.category
                        editGoodsInfo.color =goods.color
                        editGoodsInfo.marketTime =goods.marketTime
                        editGoodsInfo.series =goods.series
                        editGoodsInfo.season =goods.season
                        editGoodsInfo.sex =goods.sex

                        let shelves = [];

                        shelves[0] = goods.shelves==0?'1':'2';


                        this.setState({editGoodsInfo,shelves})

                    }


                })
                .catch(function (error) {
                    console.log(error);
                })
        })
    }


    submitChangeGoodsInfo = ()=>{
        let {shelves,editGoodsInfo,changeStock,changeSalePrice} = this.state;

        this.setState({
            modalVisible:false
        },()=>{
            axios.post(`/goods/editGoodsInfo`,
                {
                    goodsId:editGoodsInfo.goodsId,
                    modelId:editGoodsInfo.modelId,
                    stock:changeStock-0,
                    shelves:shelves[0]-0,
                    salePrice:changeSalePrice-0,

                },

            )
                .then((response) =>{
                    console.log(response);

                    this.onRefresh()

                    Toast.info(response.data.code==0?'修改成功':response.data.message)


                })
                .catch(function (error) {
                    console.log(error);
                })
        })


    }


    render() {



        let {editGoodsInfo,goodsItem,goodsList,refreshing} = this.state
        let modalBackgroundStyle = {
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
        };
        let innerContainerTransparentStyle = this.state.transparent
            ? { backgroundColor: '#fff', padding: 10 ,
                // height:"90%",
                overflow:"hidden"}
            : null;


        const nowTimeStamp = Date.now();
        const now = new Date(nowTimeStamp);
        let minDate = new Date(nowTimeStamp-1e7);
        const maxDate = new Date(nowTimeStamp+1e7);

        return (
            <View style={{backgroundColor:"#fff"}}>


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

                                            <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}>{this.state.modal=='上架'?'商品上架':'修改'}</Text></View>

                                            <TouchableHighlight underlayColor={"#fff"} onPress={this._setModalVisible.bind(this,false) } style={{}}>
                                                <Image style={{height:30,width:30}} source={close}/>
                                            </TouchableHighlight>

                                        </View>

                                        <ScrollView style={{maxHeight:Dimensions.get('window').height-200}}>


                                            {this.state.modal=='上架'?


                                                <View style={{padding:10,paddingBottom:this.state.padd}}>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}><Text style={{color:"red"}}>*</Text>商品货号:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <TextInput
                                                                placeholder={this.state.goodsNo?this.state.goodsNo:'请填写商品货号'}
                                                                style={styles.teCor}
                                                                underlineColorAndroid="transparent"
                                                                onChangeText={(name) => this.setGoodsNo(name)}
                                                            />
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}><Text style={{color:"red"}}>*</Text>渠道:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Picker
                                                                data={this.state.channelList}
                                                                cols={1}
                                                                extra={'请选择渠道'}
                                                                value={this.state.channelId}
                                                                onOk={channelId => {this.setState({channelId});}}
                                                                className="forss">
                                                                <RoomInfo></RoomInfo>
                                                            </Picker>
                                                        </View>
                                                    </View>



                                                    <View style={styles.a}>
                                                        <Text style={styles.f}><Text style={{color:"red"}}>*</Text>商品名称:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <TextInput
                                                                placeholder={this.state.shelvesGoodsName?this.state.shelvesGoodsName:'请填写商品名称'}
                                                                style={styles.teCor}
                                                                underlineColorAndroid="transparent"
                                                                onChangeText={(shelvesGoodsName) => this.setState({shelvesGoodsName})}
                                                            />
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}><Text style={{color:"red"}}>*</Text>品牌:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <TextInput
                                                                placeholder={this.state.brandName?this.state.brandName:'请填写品牌'}
                                                                style={styles.teCor}
                                                                underlineColorAndroid="transparent"
                                                                onChangeText={(brandName) => this.setState({brandName})}
                                                            />
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}><Text style={{color:"red"}}>*</Text>性别:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Picker
                                                                data={this.state.genderList}
                                                                cols={1}
                                                                extra={'请选择性别'}
                                                                value={this.state.gender}
                                                                onChange={gender => {this.setState({gender});}}
                                                                className="forss">
                                                                <RoomInfo></RoomInfo>
                                                            </Picker>
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}><Text style={{color:"red"}}>*</Text>上市日期:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <DatePicker
                                                                extra="请选择日期"
                                                                format={val => moment(val).format('YYYY-MM-DD')}
                                                                value={this.state.date}
                                                                mode="date"
                                                                onChange={date => this.setState({date})}
                                                            >
                                                                <RoomInfo></RoomInfo>
                                                            </DatePicker>
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}><Text style={{color:"red"}}>*</Text>季节:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Picker
                                                                data={this.state.seasonList}
                                                                cols={1}
                                                                extra={'请选择季节'}
                                                                value={this.state.season}
                                                                onChange={season => {this.setState({season});}}
                                                                className="forss">
                                                                <RoomInfo></RoomInfo>
                                                            </Picker>
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}><Text style={{color:"red"}}>*</Text>市场价格:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <TextInput
                                                                placeholder={this.state.marketPrice?this.state.marketPrice:'请填写市场价格'}
                                                                keyboardType={'numeric'}
                                                                style={styles.teCor}
                                                                onFocus={this.focus}
                                                                underlineColorAndroid="transparent"
                                                                onChangeText={(marketPrice) => this.setState({marketPrice})}
                                                            />
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}><Text style={{color:"red"}}>*</Text>售卖价格:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <TextInput
                                                                placeholder={this.state.salePrice?this.state.salePrice:'请填写售卖价格'}
                                                                keyboardType={'numeric'}
                                                                onFocus={this.focus}
                                                                style={styles.teCor}
                                                                underlineColorAndroid="transparent"
                                                                onChangeText={(salePrice) => this.setState({salePrice})}
                                                            />
                                                        </View>
                                                    </View>


                                                    <View style={styles.a}>
                                                        <Text style={styles.f}><Text style={{color:"red"}}>*</Text>类型:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Picker
                                                                data={this.state.categoryList}
                                                                cols={1}
                                                                extra={'请选择类型'}
                                                                value={this.state.type}
                                                                onChange={type => {this.setState({type});}}
                                                                className="forss">
                                                                <RoomInfo></RoomInfo>
                                                            </Picker>
                                                        </View>
                                                    </View>


                                                    <View style={styles.a}>
                                                        <Text style={styles.f}><Text style={{color:"red"}}>*</Text>系列:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <TextInput
                                                                placeholder={this.state.series?this.state.series:'请填写系列'}
                                                                onFocus={this.focus}
                                                                style={styles.teCor}
                                                                underlineColorAndroid="transparent"
                                                                onChangeText={(series) => this.setState({series})}
                                                            />
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}><Text style={{color:"red"}}>*</Text>分类:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <TextInput
                                                                placeholder={this.state.category?this.state.category:'请填写分类'}
                                                                onFocus={this.focus}
                                                                style={styles.teCor}
                                                                underlineColorAndroid="transparent"
                                                                onChangeText={(category) => this.setState({category})}
                                                            />
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>运动类型:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <TextInput
                                                                placeholder={this.state.sport?this.state.sport:'请填写运动类型'}
                                                                onFocus={this.focus}
                                                                style={styles.teCor}
                                                                underlineColorAndroid="transparent"
                                                                onChangeText={(sport) => this.setState({sport})}
                                                            />
                                                        </View>
                                                    </View>



                                                    <View style={styles.a}>
                                                        <Text style={styles.f}><Text style={{color:"red"}}>*</Text>颜色:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <TextInput
                                                                placeholder={this.state.color?this.state.color:'请填写颜色'}
                                                                onFocus={this.focus}
                                                                style={styles.teCor}
                                                                underlineColorAndroid="transparent"
                                                                onChangeText={(color) => this.setState({color})}
                                                            />
                                                        </View>
                                                    </View>

                                                    <AddModels addModel={this.addModel}/>



                                                    <View style={{alignItems:"center",justifyContent:"center",marginTop:20}}>
                                                        <TouchableHighlight onPress={this.goodsShelves} underlayColor="#f96f59" style={{width:100,padding:10,backgroundColor:"orange",borderRadius:5,alignItems:"center",justifyContent:"center",}}>
                                                            <Text style={{color:"#fff"}}>确定上架</Text>
                                                        </TouchableHighlight>
                                                    </View>

                                                </View>:
                                                <View style={{padding:10,paddingBottom:this.state.padd}}>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>渠道:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text>{editGoodsInfo.channelName}</Text>
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>品牌:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text>{editGoodsInfo.brandName}</Text>
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>货号:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text>{editGoodsInfo.goodsNo}</Text>
                                                        </View>
                                                    </View>



                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>上市时间:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text>{editGoodsInfo.marketTime}</Text>
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>分类:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text>{editGoodsInfo.category}</Text>
                                                        </View>
                                                    </View>



                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>系列:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text>{editGoodsInfo.series}</Text>
                                                        </View>
                                                    </View>



                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>季节:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text>{editGoodsInfo.season=='spring'?'春季':editGoodsInfo.season=='summer'?'夏季':editGoodsInfo.season=='winter'?'冬季':'秋季'}</Text>
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>性别:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text>{editGoodsInfo.sex==1?'男':'女'}</Text>
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>颜色:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text>{editGoodsInfo.color}</Text>
                                                        </View>
                                                    </View>


                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>型号:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text>{editGoodsInfo.model}</Text>
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>售价:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <TextInput
                                                                placeholder={this.state.changeSalePrice?this.state.changeSalePrice:'请填写商品名称'}
                                                                style={styles.teCor}
                                                                underlineColorAndroid="transparent"
                                                                keyboardType={'numeric'}
                                                                value={this.state.changeSalePrice}
                                                                onChangeText={(changeSalePrice) => this.setState({changeSalePrice})}
                                                            />
                                                        </View>
                                                    </View>


                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>库存:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <TextInput
                                                                placeholder={this.state.changeStock?this.state.changeStock:'请填写商品名称'}
                                                                style={styles.teCor}
                                                                underlineColorAndroid="transparent"
                                                                keyboardType={'numeric'}
                                                                value={this.state.changeStock}
                                                                onChangeText={(changeStock) => this.setState({changeStock})}
                                                            />
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>上架标识:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Picker
                                                                data={this.state.shelvesList}
                                                                cols={1}
                                                                extra={'请选择上架标识'}
                                                                value={this.state.shelves}
                                                                onChange={shelves => {this.setState({shelves});}}
                                                                className="forss">
                                                                <RoomInfo></RoomInfo>
                                                            </Picker>
                                                        </View>
                                                    </View>




                                                    <View style={{alignItems:"center",justifyContent:"center",marginTop:20}}>
                                                        <TouchableHighlight onPress={this.submitChangeGoodsInfo} underlayColor="#f96f59" style={{width:100,padding:10,backgroundColor:"orange",borderRadius:5,alignItems:"center",justifyContent:"center",}}>
                                                            <Text style={{color:"#fff"}}>修改</Text>
                                                        </TouchableHighlight>
                                                    </View>

                                                </View>

                                            }



                                        </ScrollView>
                                    </View>

                                }


                            </View>
                        </View>
                    </Modal>




                </View>


                <View>
                    <Image source={topBg} style={{height:110,width:Dimensions.get('window').width,resizeMode:"stretch"}} />

                    <View  style={{backgroundColor:"#fff",margin:20,flexDirection:"row",position:"absolute",zIndex:999,top:10,borderRadius:5,borderWidth: 1,borderColor:"#ccc"}}>

                        <View style={{padding:10}}>
                            <View  style={{paddingRight:10,alignItems:"center",justifyContent:"center",borderRightColor:"#ccc",borderRightWidth:1,}}><Image source={search} style={{width:20,height:20}}/></View>
                        </View>

                        <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                            <View style={{}}>
                                <TextInput
                                    placeholder={'请输入货号名'}
                                    style={{minWidth:'100%',backgroundColor:"#fff",padding:5}}
                                    underlineColorAndroid="transparent"
                                    onChangeText={(goodsName) => this.setState({goodsName})}
                                />
                            </View>

                        </View>

                        <LinearGradient colors={['#e6e6e6', '#e6e6e6']} style={{alignItems:"center",justifyContent:"center",}}>
                            <TouchableHighlight onPress={this.onRefresh} underlayColor="transparent" style={{padding:10,alignItems:"center",justifyContent:"center",}}>
                                <Text style={{color:"#f94939",fontWeight:"bold"}}>搜索</Text>
                            </TouchableHighlight>
                        </LinearGradient>


                    </View>



                </View>




                <View style={{flexDirection:"row-reverse"}}>
                    <TouchableHighlight onPress={this.submit} underlayColor="transparent" >
                        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",}}>
                            <View><Image source={add} style={{width:14,height:14}}></Image></View>
                            <View><Text style={{color:"#f94939"}}>商品上架</Text></View>
                        </View>
                    </TouchableHighlight>
                </View>







                <View style={{height: Dimensions.get("window").height-170}}>
                    <FlatList
                        data={goodsList}  //列表的渲染数据源
                        ListEmptyComponent={()=><View style={{marginTop:30,alignItems:"center"}}><Text>{this.state.aa?'暂无商品数据':'查询商品中'}</Text></View>} //列表没有数据时展示，箭头函数中可以写一个react组件
                        getItemLayout={(data, index) => ( {length: 80, offset: 80 * index, index} )}
                        initialNumToRender={10}  //首次渲染的条数
                        onEndReached={this.onEndReached}  //列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
                        onEndReachedThreshold={0.1} //定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                        onRefresh={this.onRefresh} //下拉刷新
                        refreshing={refreshing} //下拉刷新时候的正在加载的符号，设置为true显示，false隐藏。加载完成，需要设置为false
                        keyExtractor={(item,index)=>`${index}`}
                        renderItem={({item}) => (  //渲染列表的方式

                            <View style={{borderBottomColor:"#f0f0f0",borderBottomWidth:10,padding:10}}>

                                <TouchableHighlight onPress={()=>{this.changeGoodsInfo(item)}} underlayColor="transparent" >
                                    <View style={{flexDirection: 'row',padding:10}}>
                                        <View style={{flex: 1,height: 100,borderColor:"#f0f0f0",borderWidth:1 }}>
                                            <Image source={shose} style={{width:'100%',height:"100%",resizeMode:'stretch'}}/>
                                        </View>
                                        <View style={{flexDirection:"row",flex: 3,paddingLeft: 10}}>

                                            <View style={{flex:1}}>
                                                <Text>{`${item.brandName} ${item.goodsNo}`}</Text>

                                                <View style={{flexDirection:"row",marginTop:5}}>
                                                    <View style={styles.as}><Text style={{fontSize:22,color:"orange"}}>¥{item.salePrice}元</Text></View>
                                                    <View style={styles.as}><Text>{item.channelName}</Text></View>
                                                </View>

                                                <View style={{flexDirection:"row",marginTop:5}}>
                                                    <View style={styles.as}><Text><Text style={{color:"grey"}}>型号名称:</Text>{item.model}</Text></View>
                                                    <View style={styles.as}><Text><Text style={{color:"grey"}}>库存数量:</Text>{item.stock}</Text></View>
                                                </View>

                                                <View style={{flexDirection:"row",marginTop:5}}>
                                                    <View style={styles.as}><Text style={{color:"grey",fontWeight:"bold"}}>已{item.shelves==0?'下架':'上架'}</Text></View>
                                                </View>
                                            </View>

                                            <View style={{alignItems:"center",justifyContent:"center"}}>
                                                <Image style={{width:20,height:20}} source={right}/>
                                            </View>



                                        </View>

                                    </View>
                                </TouchableHighlight>




                            </View>


                        )}
                    />
                </View>


            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,

    },
    innerContainer: {
        borderRadius: 10,
    },

    qw:{marginRight:10,backgroundColor:'rgba(64,158,255,.1)',padding:5,borderColor:"rgba(64,158,255,.2)",borderRadius:4},
    as:{justifyContent: "center",alignItems:"center",marginRight:10},
    er:{width: "50%",flexDirection:"row",marginTop:10},
    flex2:{flex:2},
    flex3:{flex:3},
    teCor:{minWidth:'100%',padding:5,backgroundColor:"#fff",borderRadius:5,borderColor:"#ccc",borderWidth:1},

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
