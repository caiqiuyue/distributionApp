import React, { Component } from 'react'
import { StyleSheet, View, TouchableHighlight, Text, TextInput,Image } from 'react-native'
import add from '../../GoodSelect/style/add.png'
import deleteIcon from  '../../GoodSelect/style/delete.png'
class Detail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modelArr: []
        };
    }

    handlePressButton = () => {
        let {modelArr} = this.state;
        let data = {
            id: modelArr.length,
            stock: null,
            name: null,
            salePrice: this.props.salePrice || null
        };
        modelArr.push(data);
        this.setState({modelArr})

    };

    handleDeleteItem = (id) => {
        console.log(id);
        let {modelArr} = this.state;
        modelArr = modelArr.filter(_item => _item.id !== id);
        this.setState({modelArr})
    };

    setName = (name,id)=>{
        let {modelArr} = this.state;
        modelArr.map(item=>{
            if(item.id==id){
                item.name = name
            }
        })

        this.setState({
            modelArr
        },()=>{this.props.addModel(this.state.modelArr)})
    }


    setStock = (name,id)=>{
        let {modelArr} = this.state;
        modelArr.map(item=>{
            if(item.id==id){
                item.stock = name
            }
        })

        this.setState({
            modelArr
        },()=>{this.props.addModel(this.state.modelArr)})
    }

    setPrice = (salePrice,id)=>{
        let {modelArr} = this.state;
        modelArr.map(item=>{
            if(item.id==id){
                item.salePrice = salePrice
            }
        })

        this.setState({
            modelArr
        },()=>{this.props.addModel(this.state.modelArr)})
    }

    render() {

        let {modelArr} = this.state;
        return (
            <View style={styles.box}>

                <View style={styles.a}>
                    <Text style={styles.f}><Text style={{color:"red"}}>*</Text>添加尺码:</Text>
                    <View style={[styles.b,{flex:3}]}>
                        <TouchableHighlight underlayColor="transparent" onPress={this.handlePressButton}>
                            <Image source={add} style={{width:20,height:20}}/>
                        </TouchableHighlight>
                    </View>
                </View>


                {
                    modelArr.map((item, index) => (
                        <View style={styles.a} key={`model-${index}`}>
                            <View style={[styles.b,{flex:3}]}>
                                <TextInput
                                    placeholder={item.name?item.name:'商品尺码'}
                                    style={styles.teCor}
                                    autoCapitalize={'none'}
                                    underlineColorAndroid="transparent"
                                    onChangeText={(name) => this.setName(name,item.id)}
                                />
                            </View>
                            <View style={[styles.b,{flex:3}]}>
                                <TextInput
                                    placeholder={item.stock?item.stock:'商品数量'}
                                    style={styles.teCor}
                                    keyboardType={'numeric'}
                                    underlineColorAndroid="transparent"
                                    onChangeText={(stock) => this.setStock(stock,item.id)}
                                />
                            </View>
                            <View style={[styles.b,{flex:3}]}>
                                <TextInput
                                    placeholder={'商品价格'}
                                    style={styles.teCor}
                                    keyboardType={'numeric'}
                                    value={item.salePrice}
                                    underlineColorAndroid="transparent"
                                    onChangeText={(salePrice) => this.setPrice(salePrice,item.id)}
                                />
                            </View>
                            <TouchableHighlight style={{flex:1,alignItems:"center",justifyContent:"center"}} underlayColor="transparent" onPress={() => this.handleDeleteItem(item.id)}>
                                <Image source={deleteIcon} style={{width:20,height:20}}/>
                            </TouchableHighlight>
                        </View>
                    ))
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    teCor:{
        minWidth:'100%',
        padding:5,
        backgroundColor:"#fff",
        borderRadius:5,
        borderColor:"#ccc",
        borderWidth:1},
    Text: {
        color: 'grey',
    },
    a:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center"
        ,marginTop:5
    },
    b:{
        marginLeft:10,
        flex:1,
    },
    f:{
        color:"grey"
    },
});


export default Detail
