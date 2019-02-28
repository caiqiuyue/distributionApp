import React from 'react';
import {

    Text,
    TextInput,
    StyleSheet,
    TouchableHighlight,
    View,Dimensions,
    FlatList,Modal,ScrollView,Image,DeviceEventEmitter

} from 'react-native';

import axios from '../../../axios'
import moment from "moment";
import LinearGradient from "react-native-linear-gradient";
import close from "../style/close.png";
import shose from "../style/shose.png";
import topBg from "../style/topBg.png";
import search from "../style/search.png";
import cart from "../style/cart.png";
import deleteIcon from  '../../GoodSelect/style/delete.png'
export default class App extends React.Component {


    constructor(props) {
        super(props);
        this.state = {

            goodsName:'',
            modal:'下单',
            goodsList:[],
            refreshing:false,
            aa:false,
            noData:false,
            pages:1,
            animationType: 'none',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示
            goodsItem:{},
            goodsDatas: []

        };

        this.goodsItem = {}
        this.addCart = null


    }


    componentDidMount(){

        this.yiPay =  DeviceEventEmitter.addListener('Pay', (item)=>{
            if(item=='Pay'){

                this.searchGoods();
                // 读取
                storage.load({
                    key: 'username',
                    autoSync: false
                }).then(ret => {
                    console.log(ret);
                    this.userName = ret.realname;
                    // 读取
                    storage.load({
                        key: 'goodsDatas',
                        autoSync: false
                    }).then(res => {
                        console.log(res);
                        this.goodsData = res;
                        if(this.goodsData[ret.realname]) {
                            console.log(this.goodsData[ret.realname]);
                            this.setState({
                                goodsDatas: this.goodsData[ret.realname]
                            });
                        } else {
                            this.goodsData[ret.realname] = [];
                            storage.save({
                                key: 'goodsDatas',
                                data:this.goodsData,
                                expires: null
                            });
                        }

                    }).catch(err => {
                        //设置storage
                        let goodsDatas = {};
                        goodsDatas[ret.realname] = [];
                        this.goodsData = goodsDatas;
                        storage.save({
                            key: 'goodsDatas',
                            data: goodsDatas,
                            expires: null
                        });
                    });
                }).catch(err => {
                    console.log(err)
                });
            }
        });
    }

    componentWillUnmount(){
        this.yiPay&&this.yiPay.remove();
    };

    //打开弹框
    submit=(item,val)=>{

        this.addCart = val

        item.models.map(_item=>{
            _item.stockNo = 0
        })


        this.setState({
            goodsItem:item,
            modalVisible: true,
            modal:'下单'
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

    //下单减数量
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

    //下单添加数量
    stockNoAdd = (item) =>{
        let {goodsItem} = this.state;

        console.log(goodsItem,'加加加');

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



    //跳转到支付
    onPay = ()=>{
        let {goodsItem} = this.state;
        let a = goodsItem.models.filter(_item=>{
            return _item.stockNo!=0
        });

        console.log(goodsItem,'goodsItem');

        if(a.length>0){
            const { navigate } = this.props.navigation;
            this.setState({
                modalVisible:false
            },()=>{
                if(this.addCart!=1){
                    navigate('Pay',{ user: [goodsItem] })
                } else {
                    let dataItem = JSON.parse(JSON.stringify(goodsItem));
                    let {goodsDatas} = this.state;

                    console.log(dataItem,'dataItem');

                    if(goodsDatas.length>0){
                        let flag = false;
                        goodsDatas.map(item=>{
                            if(item.goodsId==dataItem.goodsId){
                                flag = true;
                                item.models.map(__item=>{
                                    let type = false;
                                    dataItem.models.map(_item=>{
                                        if(_item.modelId==__item.modelId){
                                            type = _item.stockNo;
                                        }
                                    });
                                    if(type) {
                                        console.log(item.goodsId,__item.modelName,__item.stockNo, type);
                                        __item.stockNo = __item.stockNo + type;
                                    }
                                })
                            }
                        })
                        if(!flag) {
                            goodsDatas.push(dataItem);
                        }
                    }else {
                        goodsDatas.push(dataItem);
                    }

                    console.log(goodsDatas,'goodsDatas');

                    this.saveGoodsDatas(goodsDatas)
                }
            })
        }else{
            alert('请输入购买数量')
            return
        }
    };

    //购物车弹框
    shoppingCart = ()=>{
        let {goodsDatas} = this.state;
        let a = goodsDatas.filter(item => item.models.filter(_item=>_item.stockNo!=0).length > 0);
        console.log(goodsDatas,'goodsDatasgoodsDatas');

        if(a.length>0){
            this.setState({
                modal:'111',
                modalVisible: true,
            })
        }else{
            alert('请输入购买数量')
        }
    };


    shoppingCartPay = ()=>{
        let {goodsDatas} = this.state;
        let a = goodsDatas.filter(item => item.models.filter(_item=>_item.stockNo!=0).length > 0);

        this.setState({
            modalVisible: false,
        });

        if(a.length>0){
            const { navigate } = this.props.navigation;
            navigate('Pay',{ user: goodsDatas, type: true })
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
        this.searchGoods();
        // 读取
        storage.load({
            key: 'username',
            autoSync: false
        }).then(ret => {
            console.log(ret);
            this.userName = ret.realname;
            // 读取
            storage.load({
                key: 'goodsDatas',
                autoSync: false
            }).then(res => {
                console.log(res);
                this.goodsData = res;
                if(this.goodsData[ret.realname]) {
                    console.log(this.goodsData[ret.realname]);
                    this.setState({
                        goodsDatas: this.goodsData[ret.realname]
                    });
                } else {
                    this.goodsData[ret.realname] = [];
                    storage.save({
                        key: 'goodsDatas',
                        data:this.goodsData,
                        expires: null
                    });
                }

            }).catch(err => {
                //设置storage
                let goodsDatas = {};
                goodsDatas[ret.realname] = [];
                this.goodsData = goodsDatas;
                storage.save({
                    key: 'goodsDatas',
                    data: goodsDatas,
                    expires: null
                });
            });
        }).catch(err => {
            console.log(err)
        });
    }


    onRefresh = ()=>{

        this.setState({
            refreshing:true,
        },()=>{
            this.searchGoods()
        })
    }


    //删除购物车中的数据
    deleteCartGoods=(i,_i)=>{
        let {goodsDatas} = this.state;
        goodsDatas.map(item=>{
            if(item.goodsId==i.goodsId){
                item.models.map(_item=>{
                    if(_item.modelId==_i.modelId){
                        _item.stockNo=0
                    }
                })

            }
        })


        this.saveGoodsDatas(goodsDatas)
    }


    setStockNoCart = (stockNo,i,_i) =>{

        let {goodsDatas} = this.state;
        goodsDatas.map(item=>{
            if(item.goodsId==i.goodsId){
                item.models.map(_item=>{
                    if(_item.modelId==_i.modelId){

                        if((stockNo-0)>_item.stockNum){
                            alert(`最多可买${_item.stockNum}件`)
                            _item.stockNo = _item.stockNum
                        }else{
                            _item.stockNo = stockNo
                        }
                    }
                })

            }
        })
        this.saveGoodsDatas(goodsDatas)
    }

    stockNoSubCart = (i,_i) =>{

        let {goodsDatas} = this.state;
        goodsDatas.map(item=>{
            if(item.goodsId==i.goodsId){
                item.models.map(_item=>{
                    if(_item.modelId==_i.modelId){

                        _item.stockNo--

                        if(_item.stockNo<0){
                            _item.stockNo =0
                        }
                    }
                })

            }
        })


        this.saveGoodsDatas(goodsDatas)

    }


    saveGoodsDatas = (data) => {

        let goodsDatas = data.filter(item=>{
            return item.models.filter(_item=>{
                return _item.stockNo>0
            }).length>0
        })

        console.log(goodsDatas);

        this.setState({
            goodsDatas
        },()=>{
            this.goodsData[this.userName] = goodsDatas;
            storage.save({
                key: 'goodsDatas',
                data: this.goodsData,
                expires: null
            });
        })
    }

    stockNoAddCart = (i,_i) =>{

        let {goodsDatas} = this.state;
        console.log(this.state.goodsDatas,'goodsDatasgoodsDatas');
        goodsDatas.map(item=>{
            if(item.goodsId==i.goodsId){
                item.models.map(_item=>{

                    if(_item.modelId==_i.modelId){

                        console.log(_item,'_item_item');
                        console.log(item,'itemitem');
                        console.log(i,'ii');
                        console.log(_i,'_i_i');

                        _item.stockNo ++
                        if(_item.stockNum!=-1){
                            if(_item.stockNo>_item.stockNum){
                                alert(`最多可买${_item.stockNum}件`)
                                _item.stockNo = _item.stockNum
                            }
                        }
                    }
                })

            }
        })
        this.saveGoodsDatas(goodsDatas)
    }

    componentWillReceiveProps(newporops) {

        console.log(newporops.navigation.state.params,'componentWillReceiveProps');
        let getSearchShop = newporops.navigation.state.params;
        if(getSearchShop && getSearchShop.getSearchShop){
            this.setState({
                goodsName:getSearchShop.getSearchShop.goodsNo
            },()=>{
                axios.post(`/goods/searchGoods`,
                    {
                        goodsNo:this.state.goodsName,
                        current:1,
                        pageSize:10,
                        sellerId: getSearchShop.getSearchShop.userId,
                        modelName: getSearchShop.getSearchShop.model
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
            })


        }
    }

    render() {
        let {goodsItem,goodsList,refreshing,goodsDatas} = this.state;
        let num = 0;
        goodsDatas.map(item => {
            item.models.map(_item=> {
                if(_item.stockNo!=0) {
                    num ++;
                }
            })
        });

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

                                <View>
                                    <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>

                                        <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}>{this.addCart==1?'加入购物车':'确定下单'}</Text></View>



                                        <TouchableHighlight underlayColor={"#fff"} onPress={this._setModalVisible.bind(this,false) } style={{}}>
                                            <Image style={{height:30,width:30}} source={close}/>
                                        </TouchableHighlight>

                                    </View>


                                    {
                                        this.state.modal=='下单'?
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
                                                                <Text style={{color:"#fff"}}>确定</Text>
                                                            </TouchableHighlight>
                                                        </LinearGradient>
                                                    </View>

                                                </View>

                                            </ScrollView>

                                            :

                                            <ScrollView style={{maxHeight:Dimensions.get('window').height-200}}>
                                                <View>
                                                    {
                                                        goodsDatas && goodsDatas.map(_item => {
                                                            return _item.models && _item.models.map((item,index)=>


                                                                item.stockNo > 0 &&

                                                                <View  key={index} style={{borderColor:"#f0f0f0",borderBottomWidth:3,padding:10}}>
                                                                    <View style={{}}>
                                                                        <View>
                                                                            <Text style={{fontWeight:"bold"}}>{`${_item.brandName} ${_item.goodsNo} ${_item.channelName}`}</Text>
                                                                            <View style={{flexDirection:"row",marginTop:10,justifyContent:"space-around"}}>
                                                                                <View style={[styles.qw2,{justifyContent:"center"}]}><Text>{item.modelName}码</Text></View>

                                                                                <View style={{flexDirection:"row",alignItems:"center",width:'40%'}}>
                                                                                    <View style={{flexDirection:"row",borderColor:"#f0f0f0",borderWidth:1,borderRadius:5}}>
                                                                                        <TouchableHighlight underlayColor="transparent" onPress={()=>{this.stockNoSubCart(_item,item)}} style={{flex:1,padding:10,backgroundColor:"#f5f7fa",alignItems:"center",justifyContent:"center",}}><Text>-</Text></TouchableHighlight>

                                                                                        <View style={{flex:3,}}>
                                                                                            <TextInput
                                                                                                placeholder={''}
                                                                                                style={{minWidth:'100%',padding:10,backgroundColor:"#fff",}}
                                                                                                underlineColorAndroid="transparent"
                                                                                                value={item.stockNo+''}
                                                                                                onChangeText={(stockNo) => this.setStockNoCart(stockNo,_item,item)}
                                                                                            />
                                                                                        </View>

                                                                                        <TouchableHighlight underlayColor="transparent"  onPress={()=>{this.stockNoAddCart(_item,item)}} style={{flex:1,padding:10,backgroundColor:"#f5f7fa",alignItems:"center",justifyContent:"center",}}><Text>+</Text></TouchableHighlight>
                                                                                    </View>
                                                                                </View>

                                                                                <View style={[styles.qw2,{justifyContent:"center"}]}><Text><Text style={{color:"grey"}}>单价:</Text>{_item.salePrice}元</Text></View>
                                                                                <TouchableHighlight style={{justifyContent:"center"}} underlayColor="transparent" onPress={()=>{this.deleteCartGoods(_item,item)}}><Image style={{width:20,height:20}} source={deleteIcon}/></TouchableHighlight>
                                                                            </View>

                                                                        </View>

                                                                    </View>

                                                                </View>
                                                            )
                                                        })
                                                    }
                                                </View>
                                                <View style={{alignItems:"center",justifyContent:"center",marginTop:20}}>
                                                    <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,alignItems:"center",justifyContent:"center",width:100}}>
                                                        <TouchableHighlight onPress={this.shoppingCartPay} underlayColor="transparent" style={{width:100,padding:10,borderRadius:5,alignItems:"center",justifyContent:"center",}}>
                                                            <Text style={{color:"#fff"}}>确定</Text>
                                                        </TouchableHighlight>
                                                    </LinearGradient>
                                                </View>
                                            </ScrollView>

                                    }






                                </View>


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
                                    value={this.state.goodsName}
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
                    <TouchableHighlight onPress={this.shoppingCart} underlayColor="transparent" >
                        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",}}>
                            <View><Image source={cart} style={{width:20,height:20}}></Image></View>
                            <View style={{marginLeft:10}}><Text><Text style={{fontSize:18,fontWeight:"bold"}}>{num}</Text>件商品</Text></View>
                        </View>
                    </TouchableHighlight>
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
                                        <Image source={shose} style={{width:'100%',height:"100%",resizeMode:'stretch'}}/>
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
                                        <View style={styles.flex2}><Text  style={styles.teCor}>系列</Text></View>
                                        <View style={styles.flex3}><Text>{item.series}</Text></View>
                                    </View>

                                    <View style={styles.er}>
                                        <View style={styles.flex2}><Text  style={styles.teCor}>类型</Text></View>
                                        <View style={styles.flex3}><Text>{item.type}</Text></View>
                                    </View>

                                    <View style={styles.er}>
                                        <View style={styles.flex2}><Text  style={styles.teCor}>性别</Text></View>
                                        <View style={styles.flex3}><Text>{item.sex==0?'女':item.sex==1?'男':'中性'}</Text></View>
                                    </View>

                                    <View style={styles.er}>
                                        <View style={styles.flex2}><Text  style={styles.teCor}>类目</Text></View>
                                        <View style={styles.flex3}><Text>{item.category}</Text></View>
                                    </View>

                                    <View style={styles.er}>
                                        <View style={styles.flex2}><Text  style={styles.teCor}>上市日期</Text></View>
                                        <View style={styles.flex3}><Text>{item.marketTime}</Text></View>
                                    </View>

                                    <View style={styles.er}>
                                        <View style={styles.flex2}><Text  style={styles.teCor}>颜色</Text></View>
                                        <View style={styles.flex3}><Text>{item.color}</Text></View>
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


                                <View  style={{flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>

                                    <LinearGradient colors={['orange', 'orange']} style={{borderRadius:5,alignItems:"center",justifyContent:"center",width:130}}>
                                        <TouchableHighlight underlayColor="transparent" onPress={()=>{this.submit(item,1)}} style={{padding:10,borderRadius:5,alignItems:"center",justifyContent:"center"}}>
                                            <Text style={{color:"#fff"}}>加入购物车</Text>
                                        </TouchableHighlight>
                                    </LinearGradient>

                                    <LinearGradient colors={['#f96f59', '#f94939']} style={{borderRadius:5,alignItems:"center",justifyContent:"center",width:100}}>
                                        <TouchableHighlight underlayColor="transparent" onPress={()=>{this.submit(item,2)}} style={{padding:10,borderRadius:5,alignItems:"center",justifyContent:"center"}}>
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
    qw2:{marginRight:10,},
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
