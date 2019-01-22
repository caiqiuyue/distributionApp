import React,{Component} from 'react';
import {View, Text,Dimensions} from 'react-native';
import GoodSelect1 from './buyers/GoodSelect'
import GoodSelect2 from './seller/GoodSelect'
import axios from "../../axios";
import {Toast} from "antd-mobile/lib/index";
// import Dimensions from 'Dimensions';

export default class MineBox extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentWillMount() {

    }



    render(){

        return (
            <View style={{}}>
                {
                    global.roleStr == 1 ? (
                        <GoodSelect1   navigation={this.props.navigation}/>
                    ) : (
                        <GoodSelect2  navigation={this.props.navigation}/>
                    )
                }
            </View>
        )
    }
}



