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
import {ifIphoneX} from "react-native-iphone-x-helper";

import s1 from "../style/234.png";
import PayComponents from "./payComponents";

import { pca, pcaa } from 'area-data';

import close from "../style/close.png";
import DashLine from "../../../main/myComponets/DashLine";

let a = Dimensions.get("window").height/Dimensions.get("window").width;

const setValues = (data) => {
    const values = [];
    for (let key in data) {
        let item = {
            value: key,
            label: data[key],
        }
        values.push(item);
    }
    return values;
};




const addressAnalyze = (str) => {
    try{
        let info = {}, type = ''
        let areaResult = []
        let isStraight = str.match(/北京|天津|上海|重庆/) // 直辖市
        if (str.match('收货人')) {
            console.log('type:京东')
            str = str.replace(/\s+/g, '')
            type = 'jd'
            info.name = str.split('收货人:')[1].split('地址:')[0]
            info.fullAddress = str.split('地址:')[1].split('手机')[0]
            info.phoneNo = str.split('手机号')[1].replace(/[^0-9]/ig,"")
            let match = info.fullAddress.match(/北京|上海|天津|重庆|河北|山西|河南|辽宁|吉林|黑龙江|内蒙古|江苏|山东|安徽|浙江|福建|湖北|湖南|广东|广西|江西|四川|海南|贵州|云南|西藏|陕西|甘肃|青海|宁夏|新疆|港澳|台湾|钓鱼岛/)
            areaResult[0] = match[0]
            let cityRegion = info.fullAddress.replace(areaResult[0], '')// 去掉一级地区
            let regArea = cityRegion.match(/.+?(市|区)/g) // 市 区
            if(isStraight) {
                areaResult[2] = regArea[0]
            } else {
                areaResult[1] = regArea[0]
                areaResult[2] = regArea[1]
            }
            info.address = info.fullAddress.replace(areaResult.join(''), '')
            console.log(info)
        } else if ( str.match('收货地址:') ) {
            console.log('type:苏宁')
            type = 'sn'
            str = str.replace(/\s+/g, '')
            info.name = str.split('买家')[1].replace(/：|:/g, '')
            info.fullAddress = str.split('地址')[1].split('手机')[0].replace(/：|:/g, '')
            info.phoneNo = str.split('手机')[1].replace(/：|:/g, '').replace(/[^0-9]/ig, '')
            let regArea = /.+?(省|市|自治区|自治州|县|区)/g
            areaResult = info.fullAddress.match(regArea)
            info.address = info.fullAddress.replace(areaResult.slice(0,3).join(''), '')
        } else {
            // 张三 ，13888888888 ，0731-2222222 ，湖南省 长沙市 芙蓉区 五一路888号 ，410005
            console.log('type:淘宝')
            type = 'tb'
            let arr = str.split(',')
            if(arr.length === 4){
                info={
                    name: arr[0],
                    phoneNo: arr[1],
                    fullAddress: arr[2],
                    postNo: arr[3]
                }
            } else {
                info= {
                    name: arr[0],
                    phoneNo: arr[1],
                    telNo: arr[2],
                    fullAddress: arr[3],
                    postNo: arr[4]
                }
            }
            // let regArea = /.+?(省|市|自治区|自治州|县|区)/g
            if(isStraight){
                areaResult[0] = info.fullAddress.split(' ')[1]
                areaResult[1] = ''
                areaResult[2] = info.fullAddress.split(' ')[2]
            }else{
                // areaResult = info.fullAddress.match(regArea)
                areaResult[0] = info.fullAddress.split(' ')[0]
                areaResult[1] = info.fullAddress.split(' ')[1]
                areaResult[2] = info.fullAddress.split(' ')[2]
            }
            info.address = info.fullAddress.split(areaResult[areaResult.length-1])[1]
        }
        console.log('area:', areaResult)
        let provinces = pcaa['86']
        let pKey, cKey, rKey, province = '', city = '', region = ''
        Object.keys(provinces).forEach(key => {
            if (provinces[key].match(areaResult[0])) {
                console.log('province:', key, provinces[key])
                pKey = key
                province = provinces[key]
            }
        })

        if (isStraight) {
            cKey = parseInt(pKey) + 100 + ''
            city = '市辖区'
            console.log('city:', cKey, '市辖区')
        } else {
            let cities = pcaa[pKey]
            Object.keys(cities).forEach(key => {
                if(cities[key].match(areaResult[1])){
                    console.log('city:', key, cities[key])
                    cKey = key
                    city = cities[key]
                }
            })
        }

        let regions = pcaa[cKey]
        Object.keys(regions).forEach(key => {
            if(regions[key].match(areaResult[2])){
                console.log('region:', key, regions[key])
                rKey = key
                region = regions[key]
            }
        })
        info.province = province
        info.city = city
        info.region = region
        console.log(info)
        return info
    } catch (e) {
        return null
    }
}


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

            goodsList:[],
            animationType: 'none',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示
            goodsItem:{},
            provinceList:setValues(pca['86']),
            cityList:[],
            regionList:[],
            province:[],
            city:[],
            region:[],
            provinceVal:null,
            cityVal:null,
            regionVal:null,
            templateListValue:null,
            modal:null,
            postFlag:['1'],
            postFlagList:[
                {
                    value:'1',
                    label:'默认快递',
                },
                {
                    value:'2',
                    label:'最低价格',
                },
            ],
            name:null,
            phoneNo:null,
            address:null,
            smartParsingStr:null,
            custOrderNo:null,
            paySmsCodeFlag:false,
            smsCode:null,
            remark:null,
            totalMoney:0,
            payDatas:{},
            padd:10


        };


        this.parentId = null

    }


    focus=()=>{

        this.setState({
            padd:300,
        })


    }



    _setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    };


    //添加/修改地址弹框
    addAddress = ()=>{
        this.setState({ modalVisible: true ,modal:"地址"});
    }


    componentWillMount() {


        storage.load({ //读取tokenKey
            key: 'username',
            autoSync: false
        }).then(ret => {
                console.log(ret);
                this.setState({
                    paySmsCodeFlag:ret.paySmsCodeFlag
                })

            }
        ).catch(
            (error) => {
                reject(error);
            })

        const {getParam} = this.props.navigation;
        const datas = getParam("user");
        

        // let datas = {"sendFlag":0,"marketPrice":969,"matchFlag":0,"color":"白色","goodsId":88,"goodsRate":1,"type":"鞋子","feedbackFlag":0,"closureTime":"","feedbackTime":1,"sellerId":3,"season":"spring","goodsTime":2,"stock":0,"goodsName":null,"channelId":33,"goodsNo":"554724-104","delivery":"0","models":[{"modelName":"7","modelId":243,"stockNum":1,"salesNum":null,"stockNo":1},{"modelName":"8","modelId":244,"stockNum":1,"salesNum":null,"stockNo":1},{"modelName":"9","modelId":245,"stockNum":0,"salesNum":1,"stockNo":0}],"saleRate":1,"brandName":"NIKE","salePrice":1.01,"sex":1,"sendTime":1,"series":"AJ1","channelName":"北方大仓","channelDesc":"123","category":"篮球鞋","marketTime":""}


        datas.models = datas.models.filter(item => {return item.stockNo>0})

        let a = [];
        let val = [];
        let templateList = [];

        axios.get(`/goods/getPostTemplateByChannelId`,
            {
                channelId:datas.channelId
            }

        )
            .then((response) =>{
                console.log(response,'查询快递模版');


                if(response.data.code==0){

                    templateList = response.data.data

                    templateList.map(item=>{
                        let b = {
                            label:item.post_name,
                            value:item.post_id,
                        }
                        a.push(b)
                    })


                    templateList.map(item=>{
                        if(item.isDefault===1){
                            val[0] = item.post_id;
                        }else {
                            val[0] = a[0].value;
                        }
                    })


                }

                datas.models.map(item=>{
                    item.templateList = a
                    item.templateListValue = val
                    item.postId = val[0]
                    item.postFee = 0
                    item.postName = item.templateList.filter(_item=>_item.value==val[0])[0].label
                    item.goodsAmount = (item.postFee-0)+(datas.salePrice-0)*item.stockNo

                })


                let totalMoney = 0
                datas.models.map(item=>{
                    totalMoney += item.goodsAmount
                })

                this.setState({
                    goodsList:datas,
                    templateList,
                    templateListValue:val[0],
                    totalMoney

                })


            })
            .catch((error)=> {
                console.log(error);
                datas.models.map(item=>{
                    item.templateList = a
                    item.templateListValue = val
                })
                this.setState({
                    goodsList:datas,
                    templateList

                })
            })


    }


    //快递状态修改
    setpostFlag = (item)=>{
        this.setState({
            postFlag:item,
        })
    }


    //快递名称修改
    changePost = (ite,iit) => {
        let {goodsList,templateList,province} = this.state
        
        let val = ite
        val[0] = val[0]-0


        if(!province[0]){
            Toast.info('请先选择省份');
            return
        }


        axios.get(`/goods/getChannelPostFeeByProvince`,{
            channelId:goodsList.channelId,
            postId:val[0],
            province:province[0]?this.state.provinceList.filter(_item=>_item.value==province[0])[0].label:'',
        },)
            .then((response) =>{
                console.log(response);
                if(response.data.code==0){

                    goodsList.models.map(item=>{

                        if(iit.modelId==item.modelId){
                            item.templateListValue = val
                            item.postId = val[0]
                            item.postFee = response.data.data.postFee
                            item.postName = templateList.filter(_item=>_item.value==val[0])[0].label
                            item.goodsAmount = (item.postFee-0)+(goodsList.salePrice-0)*item.stockNo

                        }


                    })


                    let totalMoney = 0
                    goodsList.models.map(item=>{
                        totalMoney += item.goodsAmount
                    })

                    this.setState({
                        goodsList,
                        totalMoney

                    })

                }else {
                    Toast.info(response.data.message)
                }
            })
            .catch(function (error) {
                console.log(error);
            })


    }


    //智能解析地址框
    smartParsing = (item) => {

        let data = addressAnalyze(item)
        
        console.log(data);

        if(data){
            let province = [];
            let city = [];
            let region = [];
            let cityList = [];
            let regionList = [];
            province[0] = this.state.provinceList.filter(item => item.label==data.province)[0].value;
            cityList = province[0] && setValues(pcaa[province[0]]);
            city[0] = data.city && cityList.filter(item => item.label==data.city)[0].value;
            regionList = city[0] && setValues(pcaa[city[0]]);
            region[0] = data.region && regionList.filter(item => item.label==data.region)[0].value;

            this.setState({
                name:data.name,
                phoneNo:data.phoneNo,
                province,
                cityList,
                regionList,
                city,
                region,
                address:data.address,
                provinceVal:province[0] && this.state.provinceList.filter(_item=>_item.value==province[0])[0].label,
                cityVal:city[0] && cityList && cityList.filter(_item=>_item.value==city[0])[0].label,
                regionVal:region[0] && regionList && regionList.filter(_item=>_item.value==region[0])[0].label
            })
        }
    }


    submitAddress = ()=>{
        let {province,city,region,address,name,phoneNo} = this.state;

        if(!name){
            alert('请输入收货人姓名')
            return
        }

        if(!phoneNo){
            alert('请输入收货人电话')
            return
        }

        if(!province[0]){
            alert('请选择省')
            return
        }

        if(!city[0]){
            alert('请选择市')
            return
        }

        if(!region[0]){
            alert('请选择区')
            return
        }

        if(!address){
            alert('请输入详细地址')
            return
        }

        this.setState({
            modalVisible:false
        })


    }


    //提交并准备支付
    submitPay = ()=>{

        let {provinceVal,cityVal,regionVal,remark,postFlag,custOrderNo,totalMoney,province,city,region,address,name,phoneNo} = this.state;

        if(!name){
            Toast.info('请输入收货人姓名',1);
            return
        }

        if(!phoneNo){
            Toast.info('请输入收货人电话',1);
            return
        }

        if(!province[0]){
            Toast.info('请选择省',1);
            return
        }

        if(!city[0]){
            Toast.info('请选择市',1);
            return
        }

        if(!region[0]){
            Toast.info('请选择区',1);
            return
        }

        if(!address){
            Toast.info('请输入详细地址',1);
            return
        }




        let data = {
            totalMoney:(totalMoney-0),
            custOrderNo,postFlag:postFlag[0]-0,remark,
            address:{
                address,
                phoneNo,name,
                province:provinceVal,
                city:cityVal,
                region:regionVal,
            },
            goodsList:[]
        }




        this.state.goodsList.models.map(item=>{
            let a = {}
            a.postId = item.postId
            a.postFee = item.postFee
            a.postName = item.postName
            a.modelId = item.modelId
            a.goodsNum = item.stockNo
            a.goodsPrice = (this.state.goodsList.salePrice-0)
            a.goodsAmount = (this.state.goodsList.salePrice-0)+(item.postFee-0)
            a.channelId = this.state.goodsList.channelId
            a.goodsId = this.state.goodsList.goodsId
            a.goodsNo = this.state.goodsList.goodsNo
            a.sellerId = this.state.goodsList.sellerId
            data.goodsList.push(a)
        }

        )

        axios.post(`/order/orderCommit`,data,)
            .then((res) =>{
                console.log(res);
                if(res.data.code==0){

                    this.parentId = res.data.data.parentId

                    axios.get(`/order/orderPayView`,{
                        parentId:res.data.data.parentId
                    },)
                        .then((response) =>{
                            console.log(response);
                            if(response.data.code==0){

                                this.setState({
                                    modalVisible:true,
                                    modal:"123",
                                    payDatas:response.data.data
                                })

                            }else {
                                alert(response.data.message)
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        })
                }else {
                    Toast.info(res.data.message,1)
                }
            })
            .catch(function (error) {
                console.log(error);
            })

    }


    //选择省且得到邮费
    setProvince = (province)=>{

        let {goodsList,templateListValue} = this.state;

        axios.get(`/goods/getChannelPostFeeByProvince`,{
            channelId:goodsList.channelId,
            postId:templateListValue,
            province:this.state.provinceList.filter(_item=>_item.value==province[0])[0].label,
        },)
            .then((response) =>{
                console.log(response);
                if(response.data.code==0){

                    goodsList.models.map(item=>{
                        item.postFee = response.data.data.postFee
                        item.goodsAmount = (item.postFee-0)+(goodsList.salePrice-0)*item.stockNo

                    })


                    let totalMoney = 0
                    goodsList.models.map(item=>{
                        totalMoney += item.goodsAmount
                    })

                    this.setState({
                        goodsList,
                        totalMoney

                    })

                }else {
                    alert(response.data.message)
                }
            })
            .catch(function (error) {
                console.log(error);
            })


        this.setState({
            province,
            cityList:setValues(pcaa[province[0]]),
            provinceVal:province[0]&&this.state.provinceList.filter(_item=>_item.value==province[0])[0].label
        })
    }



    topUp = ()=>{
        const { navigate } = this.props.navigation;
        navigate('TopUp',{ user: '' });
    }




    //支付
    onPay = ()=>{
        let {payPassword,totalMoney} = this.state
        if(!payPassword){
            alert('请输入支付密码')
            return
        }

        axios.post(`/order/orderPay`,{
            parentId:this.parentId,
            payMoney:totalMoney,
            password:payPassword,
        },)
            .then((res) =>{
                console.log(res);
                if(res.data.code==0){


                }else {
                    alert(res.data.message)
                }
            })
            .catch(function (error) {
                console.log(error);
            })



    }





    render() {



        let {payDatas,regionVal,cityVal,provinceVal,province,cityList,regionList,address,name,phoneNo,goodsItem,goodsList} = this.state
        let modalBackgroundStyle = {
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
        };
        let innerContainerTransparentStyle = this.state.transparent
            ? { backgroundColor: '#fff', padding: 10 ,
                // height:"90%",
                overflow:"hidden"}
            : null;


        return (
            <View style={{backgroundColor:"#fff",height:Dimensions.get('window').height}}>


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

                                                <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}>{this.state.modal=='地址'?'收货地址':'确认支付'}</Text></View>



                                                <TouchableHighlight underlayColor={"#fff"} onPress={this._setModalVisible.bind(this,false) } style={{}}>
                                                    <Image style={{height:30,width:30}} source={close}/>
                                                </TouchableHighlight>

                                            </View>


                                            <ScrollView style={{maxHeight:Dimensions.get('window').height-200}}>

                                                {
                                                    this.state.modal=='地址'?

                                                <View style={{padding:10,paddingBottom:this.state.padd}}>


                                                    {/*<View style={styles.a}>*/}
                                                        {/*<Text style={styles.f}>智能解析:</Text>*/}
                                                        {/*<View style={[styles.b,{flex:3}]}>*/}
                                                            {/*<TextInput*/}
                                                                {/*placeholder={'智能解析地址,可粘贴淘宝/京东/苏宁的地址'}*/}
                                                                {/*multiline={true}*/}
                                                                {/*style={[styles.teCor,{height:100,}]}*/}
                                                                {/*underlineColorAndroid="transparent"*/}
                                                                {/*onChangeText={(name) => this.smartParsing(name)}*/}
                                                            {/*/>*/}
                                                        {/*</View>*/}
                                                    {/*</View>*/}




                                                    <View style={styles.a}>
                                                        <Text style={styles.f}><Text style={{color:"red"}}>*</Text>姓名:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <TextInput
                                                                placeholder={this.state.name?this.state.name:'请输入收货人姓名'}
                                                                style={styles.teCor}
                                                                underlineColorAndroid="transparent"
                                                                onChangeText={(name) => this.setState({name})}
                                                            />
                                                        </View>
                                                    </View>


                                                    <View style={styles.a}>
                                                        <Text style={styles.f}><Text style={{color:"red"}}>*</Text>电话:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <TextInput
                                                                placeholder={this.state.phoneNo?this.state.phoneNo:'请输入收货人电话'}
                                                                style={styles.teCor}
                                                                underlineColorAndroid="transparent"
                                                                onChangeText={(phoneNo) => this.setState({phoneNo})}
                                                            />
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}><Text style={{color:"red"}}>*</Text>省:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Picker
                                                                data={this.state.provinceList}
                                                                cols={1}
                                                                extra={'请选择省'}
                                                                value={this.state.province}
                                                                onChange={province => {this.setProvince(province);}}
                                                                className="forss">
                                                                <RoomInfo></RoomInfo>
                                                            </Picker>
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}><Text style={{color:"red"}}>*</Text>市:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Picker
                                                                data={this.state.cityList}
                                                                cols={1}
                                                                extra={'请选择市'}
                                                                value={this.state.city}
                                                                onChange={city => {this.setState({city,regionList:setValues(pcaa[city[0]]),cityVal:city[0]&&cityList.filter(_item=>_item.value==city[0])[0].label,})}}
                                                                className="forss">
                                                                <RoomInfo></RoomInfo>
                                                            </Picker>
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}><Text style={{color:"red"}}>*</Text>区:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Picker
                                                                data={this.state.regionList}
                                                                cols={1}
                                                                extra={'请选择区'}
                                                                value={this.state.region}
                                                                onChange={region => {this.setState({region,regionVal:region[0]&&regionList.filter(_item=>_item.value==region[0])[0].label})}}
                                                                className="forss">
                                                                <RoomInfo></RoomInfo>
                                                            </Picker>
                                                        </View>
                                                    </View>



                                                    <View style={styles.a}>
                                                        <Text style={styles.f}><Text style={{color:"red"}}>*</Text>详细地址:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <TextInput
                                                                placeholder={this.state.address?this.state.address:'请输入详细地址'}
                                                                multiline={true}
                                                                style={[styles.teCor,{height:50,}]}
                                                                onFocus={this.focus}
                                                                underlineColorAndroid="transparent"
                                                                onChangeText={(address) => this.setState({address})}
                                                            />
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>订单备注:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <TextInput
                                                                placeholder={'订单备注'}
                                                                multiline={true}
                                                                style={[styles.teCor,{height:50,}]}
                                                                onFocus={this.focus}
                                                                underlineColorAndroid="transparent"
                                                                onChangeText={(remark) => this.setState({remark})}
                                                            />
                                                        </View>
                                                    </View>


                                                    <View style={{alignItems:"center",justifyContent:"center",marginTop:20}}>
                                                        <TouchableHighlight onPress={this.submitAddress} underlayColor="#f96f59" style={{width:100,padding:10,backgroundColor:"orange",borderRadius:5,alignItems:"center",justifyContent:"center",}}>
                                                            <Text style={{color:"#fff"}}>确定</Text>
                                                        </TouchableHighlight>
                                                    </View>

                                                </View>:<PayComponents payDatas={this.state.payDatas} parentId={this.parentId}/>}

                                            </ScrollView>
                                        </View>




                            </View>
                        </View>
                    </Modal>



                </View>

                <View  style={{paddingBottom:100}}>
                    <ScrollView>
                        <View>
                            <View style={{padding:10}}>

                                <TouchableHighlight underlayColor="transparent" onPress={this.addAddress} style={{padding:5,borderBottomColor:"#f0f0f0",borderBottomWidth:2}}>
                                    <Text style={{textAlign:"right",marginBottom:5}}>{province[0]?'修改':'添加'}收货地址></Text>
                                </TouchableHighlight>



                                {
                                    name?
                                        <View style={{marginTop:5}}>
                                            <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                                                <Text><Text style={{color:"grey"}}>收货人:</Text>  {name?name:'--'}</Text>
                                                <Text><Text style={{color:"grey"}}>电话:</Text>  {phoneNo?phoneNo:'--'}</Text>
                                            </View>
                                            <View style={{marginTop:10}}>

                                                <Text><Text style={{color:"grey"}}>收货地址:</Text>  {province[0]?`${provinceVal} ${cityVal} ${regionVal} ${address}`:'--'}</Text>

                                            </View>
                                        </View>:null
                                }



                                {/*<View style={[styles.a,{marginTop:20}]}>*/}
                                    {/*<Text style={styles.f}>请填写自定义单号:</Text>*/}
                                    {/*<View style={[styles.b,{flex:3}]}>*/}
                                        {/*<TextInput*/}
                                            {/*placeholder={'请填写自定义单号'}*/}
                                            {/*style={[styles.teCor,{padding:5}]}*/}
                                            {/*underlineColorAndroid="transparent"*/}
                                            {/*onChangeText={(custOrderNo) => this.setState({custOrderNo})}*/}
                                        {/*/>*/}
                                    {/*</View>*/}
                                {/*</View>*/}


                                {/*<View style={styles.a}>*/}
                                    {/*<Text style={styles.f}>快递策略:</Text>*/}
                                    {/*<View style={[styles.b,{flex:3}]}>*/}
                                        {/*<Picker*/}
                                            {/*data={this.state.postFlagList}*/}
                                            {/*cols={1}*/}
                                            {/*extra={'请选择快递策略'}*/}
                                            {/*value={this.state.postFlag}*/}
                                            {/*onChange={item => {this.setpostFlag(item)}}*/}
                                            {/*className="forss">*/}
                                            {/*<RoomInfo></RoomInfo>*/}
                                        {/*</Picker>*/}
                                    {/*</View>*/}
                                {/*</View>*/}

                            </View>
                        </View>



                        {
                            goodsList.models && goodsList.models.map((item,index)=>


                                item.stockNo > 0 &&

                                <View key={index} style={{borderColor:"#f0f0f0",borderTopWidth:5,padding:10}}>
                                    <View style={{padding:10}}>
                                        <View>
                                            <Text style={{fontWeight:"bold"}}>{`${goodsList.brandName} ${goodsList.goodsNo} ${goodsList.channelName}`}</Text>
                                            <View style={{flexDirection:"row",marginTop:10,justifyContent:"space-between"}}>
                                                <View style={styles.qw}><Text>{item.modelName}码</Text></View>
                                                <View style={styles.qw}><Text><Text style={{color:"grey"}}>数量</Text>*{item.stockNo}</Text></View>
                                                <View style={styles.qw}><Text><Text style={{color:"grey"}}>单价:</Text>{goodsList.salePrice}元</Text></View>
                                                <View style={styles.qw}><Text style={{fontWeight:"bold"}}>{(goodsList.salePrice-0)*(item.stockNo-0)}元</Text></View>
                                            </View>
                                            <DashLine/>

                                            <View style={{flexDirection:"row",marginTop:5,justifyContent:"space-between"}}>

                                                <View  style={{flex:1,justifyContent:"center"}}><Text>快递选择</Text></View>

                                                <View style={{flex:3,}}>
                                                    <View style={{width:"90%"}}>
                                                        <Picker
                                                            data={item.templateList}
                                                            cols={1}
                                                            extra={'请选择快递'}
                                                            value={item.templateListValue}
                                                            onChange={itemm => {this.changePost(itemm,item)}}
                                                            className="forss">
                                                            <RoomInfo></RoomInfo>
                                                        </Picker>
                                                    </View>

                                                </View>

                                                <View style={{flex:1,justifyContent:"center",alignItems:"center"}}><Text>邮费:<Text style={{color:"orange"}}>{item.postFee}元</Text></Text></View>
                                            </View>
                                            <DashLine/>

                                            <View style={{marginTop:5,flexDirection:"row",justifyContent:"space-between"}}>
                                                <View><Text>共计支付</Text></View>
                                                <View><Text style={{fontSize:22,color:"orange",fontWeight:"bold"}}>{item.goodsAmount&&item.goodsAmount.toFixed(2)}元</Text></View>

                                            </View>

                                        </View>

                                    </View>

                                </View>
                            )
                        }


                    </ScrollView>

                </View>








                <View style={styles.userItem}>
                    <View style={{padding:10,flexDirection:"row",justifyContent:"space-around",flex:1,borderTopColor:"grey",borderTopWidth:1}}>
                        <Text>共计:</Text>
                        <Text style={{color:"#f1803a",fontWeight:"bold"}}>{this.state.totalMoney.toFixed(2)}元</Text>
                    </View>
                    <TouchableHighlight onPress={this.submitPay} underlayColor="#fff"  style={{padding:10,backgroundColor:"#f1803a",flex:1}}>
                        <Text style={{color:"#fff",paddingLeft:50}}>确认支付</Text>
                    </TouchableHighlight>
                </View>

            </View>
        )
    }
}





const styles = StyleSheet.create({

    userItem:{
        backgroundColor:"#fff",flexDirection:"row",position:"absolute",zIndex:999,


        ...Platform.select({
            ios: {
                bottom:65,
            },
            android: {
                bottom:a>1.9?95:80,
            },
        }),

        ...ifIphoneX({
            bottom:105,
        }, {

        })

    },

    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,

    },
    innerContainer: {
        borderRadius: 10,
    },

    qw:{justifyContent:"center"},
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


