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
import moment from "moment";
import LinearGradient from "react-native-linear-gradient";
import close from "../style/close.png";
import shose from "../style/shose.png";
import topBg from "../style/topBg.png";
import search from "../style/search.png";
export default class App extends React.Component {


    constructor(props) {
        super(props);
        this.state = {

            goodsName:'',
            goodsList:[],
            refreshing:false,
            aa:false,
            noData:false,
            pages:1,
            animationType: 'none',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示
            goodsItem:{}

        };

        this.goodsItem = {}


    }



    submit=(item)=>{
        
        item.models.map(_item=>{
            _item.stockNo = 0
        })


        this.setState({
            goodsItem:item,
            modalVisible: true,
        })
    }


    onEndReached = ()=>{
        let {pages,goodsList,noData} = this.state;


        if(!noData){
            this.setState({
                pages:pages+1
            },()=>{
                axios.post(`/goods/searchGoods`,
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

                                if(response.data.data.goodsList.length==0){
                                    this.setState({
                                        noData:true
                                    })
                                }else{
                                    this.setState({
                                        goodsList:[...goodsList,...response.data.data.goodsList]
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


    setStockNo = (stockNo,item) =>{
        let {goodsItem} = this.state;

        goodsItem.models.map(_item=>{
            if(_item.modelId==item.modelId){

                console.log(stockNo);
                console.log(_item.stockNum);

                if((stockNo-0)>_item.stockNum){
                    alert(`最多可买${_item.stockNum}件`)
                    _item.stockNo = _item.stockNum
                }else{
                    _item.stockNo = stockNo
                }
            }
        })

        this.setState({
            goodsItem
        })


    }



    stockNoSub = (item) =>{
        let {goodsItem} = this.state;
        goodsItem.models.map(_item=>{
            if(_item.modelId==item.modelId){

                _item.stockNo--

                if(_item.stockNo<0){
                    _item.stockNo =0
                }


            }
        })

        this.setState({
            goodsItem
        })

    }

    stockNoAdd = (item) =>{
        let {goodsItem} = this.state;
        goodsItem.models.map(_item=>{
            if(_item.modelId==item.modelId){
                _item.stockNo ++

                if(_item.stockNum!=-1){
                    if(_item.stockNo>_item.stockNum){
                        alert(`最多可买${_item.stockNum}件`)
                        _item.stockNo = _item.stockNum
                    }
                }


            }
        })

        this.setState({
            goodsItem
        })

    }


    onPay = ()=>{
        let {goodsItem} = this.state;
        let a = goodsItem.models.filter(_item=>{
            return _item.stockNo!=0
        });

        if(a.length>0){
            const { navigate } = this.props.navigation;
            this.setState({
                modalVisible:false
            },()=>{
                navigate('Pay',{ user: goodsItem })
            })


        }else{
            alert('请输入购买数量')
        }

    }


    //搜索货物
    searchGoods = ()=>{
        axios.post(`/goods/searchGoods`,
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
                            goodsList:response.data.data.goodsList
                        })
                    }
                })



            })
            .catch(function (error) {
                console.log(error);
            })
    }


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



    render() {



        let {goodsItem,goodsList,refreshing} = this.state
        let modalBackgroundStyle = {
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
        };
        let innerContainerTransparentStyle = this.state.transparent
            ? { backgroundColor: '#fff', padding: 10 ,
                // height:"90%",
                overflow:"hidden"}
            : null;


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

                                            <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}>确定下单</Text></View>



                                            <TouchableHighlight underlayColor={"#fff"} onPress={this._setModalVisible.bind(this,false) } style={{}}>
                                                <Image style={{height:30,width:30}} source={close}/>
                                            </TouchableHighlight>

                                        </View>


                                        <ScrollView style={{maxHeight:Dimensions.get('window').height-200}}>

                                            <View style={{padding:10}}>

                                                <View style={styles.a}>
                                                    <Text style={styles.f}>仓库:</Text>
                                                    <View style={[styles.b,{flex:3}]}>
                                                        <Text style={{flex:1}}>{`${goodsItem.channelName} ${goodsItem.channelDesc}`}</Text>
                                                    </View>
                                                </View>


                                                <View style={styles.a}>
                                                    <Text style={styles.f}>商品信息:</Text>
                                                    <View style={[styles.b,{flex:3}]}>
                                                        <Text style={{flex:1}}>{`${goodsItem.brandName} ${goodsItem.goodsNo} ${goodsItem.color}`}</Text>
                                                    </View>
                                                </View>

                                                <View style={styles.a}>
                                                    <Text style={styles.f}>价格:</Text>
                                                    <View style={[styles.b,{flex:3}]}>
                                                        <Text style={{flex:1}}>{goodsItem.salePrice}</Text>
                                                    </View>
                                                </View>


                                                <View style={styles.a}>
                                                    <Text style={styles.f}>型号:</Text>
                                                    <View style={[styles.b,{flex:3,}]}>

                                                        {
                                                            goodsItem.models && goodsItem.models.length>0 && goodsItem.models.map((_item,index)=>

                                                                (_item.stockNum>0||_item.stockNum==-1) &&

                                                                (<View key={index} style={{flexDirection:"row",alignItems:"center",marginTop:5}}>
                                                                    <View style={{flex:1,}}><Text>{_item.modelName}</Text></View>

                                                                    <View style={{flex:3,flexDirection:"row",borderColor:"#f0f0f0",borderWidth:1,borderRadius:5}}>
                                                                        <TouchableHighlight underlayColor="transparent" onPress={()=>{this.stockNoSub(_item)}} style={{flex:1,padding:10,backgroundColor:"#f5f7fa",alignItems:"center",justifyContent:"center",}}><Text>-</Text></TouchableHighlight>

                                                                        <View style={{flex:3,}}>
                                                                            <TextInput
                                                                                placeholder={''}
                                                                                style={{minWidth:'100%',padding:10,backgroundColor:"#fff",}}
                                                                                underlineColorAndroid="transparent"
                                                                                value={_item.stockNo+''}
                                                                                onChangeText={(stockNo) => this.setStockNo(stockNo,_item)}
                                                                            />
                                                                        </View>

                                                                        <TouchableHighlight underlayColor="transparent"  onPress={()=>{this.stockNoAdd(_item)}} style={{flex:1,padding:10,backgroundColor:"#f5f7fa",alignItems:"center",justifyContent:"center",}}><Text>+</Text></TouchableHighlight>
                                                                    </View>
                                                                </View>)

                                                            )
                                                        }





                                                    </View>
                                                </View>


                                                <View style={{alignItems:"center",justifyContent:"center",marginTop:20}}>
                                                    <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,alignItems:"center",justifyContent:"center",width:100}}>
                                                        <TouchableHighlight onPress={this.onPay} underlayColor="transparent" style={{width:100,padding:10,borderRadius:5,alignItems:"center",justifyContent:"center",}}>
                                                            <Text style={{color:"#fff"}}>确定支付</Text>
                                                        </TouchableHighlight>
                                                    </LinearGradient>
                                                </View>

                                            </View>

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








                <View style={{height: Dimensions.get("window").height-150}}>
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
                                <View style={{flexDirection: 'row',padding:10}}>
                                    <View style={{flex: 1,height: 100,borderColor:"#f0f0f0",borderWidth:1 }}>
                                        <Image source={shose} style={{width:'100%',height:"100%"}}/>
                                    </View>
                                    <View style={{flex: 3,paddingLeft: 10,paddingRight: 10}}>
                                        <Text>{`${item.brandName} ${item.goodsNo}`}</Text>
                                        <View style={{flexDirection:"row",marginTop:10}}>
                                            <View style={styles.qw}><Text style={{color:"#f94939"}}>{item.feedbackTime>24?`${item.feedbackTime}小时`:'当天'}反馈</Text></View>
                                            <View style={styles.qw}><Text style={{color:"#f94939"}}>配货率{item.goodsRate}%</Text></View>
                                            <View style={styles.qw}><Text style={{color:"#f94939"}}>{item.sendTime}天发货</Text></View>
                                        </View>

                                        <View style={{flexDirection:"row",marginTop:5}}>
                                            <View style={styles.as}><Text style={{fontSize:22,color:"orange"}}>{item.salePrice}</Text></View>
                                            <View style={[styles.as,{marginRight:30}]}><Text style={{color:"grey",textDecorationLine:"line-through"}}>{item.marketPrice}</Text></View>
                                            <View style={styles.as}><Text>{item.channelName}</Text></View>
                                        </View>

                                    </View>

                                </View>

                                <View style={{padding:10,flexDirection:"row",justifyContent: "space-around",flexWrap: "wrap"}}>
                                    <View style={styles.er}>
                                        <View style={styles.flex2}><Text>系列</Text></View>
                                        <View style={styles.flex3}><Text  style={styles.teCor}>{item.series}</Text></View>
                                    </View>

                                    <View style={styles.er}>
                                        <View style={styles.flex2}><Text>类型</Text></View>
                                        <View style={styles.flex3}><Text  style={styles.teCor}>{item.type}</Text></View>
                                    </View>

                                    <View style={styles.er}>
                                        <View style={styles.flex2}><Text>性别</Text></View>
                                        <View style={styles.flex3}><Text  style={styles.teCor}>{item.sex==0?'女':item.sex==1?'男':'中性'}</Text></View>
                                    </View>

                                    <View style={styles.er}>
                                        <View style={styles.flex2}><Text>类目</Text></View>
                                        <View style={styles.flex3}><Text  style={styles.teCor}>{item.category}</Text></View>
                                    </View>

                                    <View style={styles.er}>
                                        <View style={styles.flex2}><Text>上市日期</Text></View>
                                        <View style={styles.flex3}><Text  style={styles.teCor}>{item.marketTime}</Text></View>
                                    </View>

                                    <View style={styles.er}>
                                        <View style={styles.flex2}><Text>颜色</Text></View>
                                        <View style={styles.flex3}><Text  style={styles.teCor}>{item.color}</Text></View>
                                    </View>
                                </View>

                                <View style={{padding:10}}>
                                    <Text>型号</Text>
                                    <View style={{flexDirection:"row",flexWrap: "wrap"}}>



                                        {
                                            item.models.length>0 && item.models.map((_item,index)=>


                                                <View key={index} style={{marginRight:10}}>
                                                    <View style={{width:50,padding:5,alignItems: "center",justifyContent:'center'}}><Text>{_item.stockNum==-1?'有货':_item.stockNum==0?'无货':`剩${_item.stockNum}`}</Text></View>
                                                    <View style={{width:50,padding:5,alignItems: "center",justifyContent:'center',backgroundColor:"#f0f0f0",borderRadius:3}}><Text style={{color:_item.stockNum==0?'grey':"#000"}}>{_item.modelName}</Text></View>
                                                </View>

                                            )
                                        }



                                    </View>

                                </View>

                                <View style={{padding:10}}>
                                    <Text style={{fontWeight: 'bold',marginBottom: 5}}>{item.channelDesc}</Text>
                                </View>


                                <View  style={{alignItems:"center",justifyContent:"center"}}>
                                    <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,alignItems:"center",justifyContent:"center",width:100}}>
                                        <TouchableHighlight underlayColor="transparent" onPress={()=>{this.submit(item)}} style={{padding:10,borderRadius:5,alignItems:"center",justifyContent:"center"}}>
                                            <Text style={{color:"#fff"}}>确定下单</Text>
                                        </TouchableHighlight>
                                    </LinearGradient>
                                </View>



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

    qw:{marginRight:10,backgroundColor:'rgba(249,73,57,.1)',padding:5,borderColor:"rgba(255,0,0,.2)",borderRadius:4},
    as:{justifyContent: "center",alignItems:"center",marginRight:10},
    er:{width: "50%",flexDirection:"row",marginTop:10},
    flex2:{flex:2},
    flex3:{flex:3},
    teCor:{color:"grey"},
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
