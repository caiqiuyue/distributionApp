import React,{Component} from 'react';
import {View, Text,Dimensions} from 'react-native';
import Order1 from './buyers/Order'
import Order2 from './seller/Order'

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
                        <Order1   navigation={this.props.navigation}/>
                    ) : (
                        <Order2  navigation={this.props.navigation}/>
                    )
                }
            </View>
        )
    }
}



