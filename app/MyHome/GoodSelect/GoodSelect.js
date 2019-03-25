import React,{Component} from 'react';
import {View, Text,Dimensions} from 'react-native';
import GoodSelect1 from './buyers/GoodSelect'
import GoodSelect2 from './seller/GoodSelect'
import axios from "../../axios";
import {Toast} from "antd-mobile/lib/index";
// import Dimensions from 'Dimensions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getData, setRoleStr} from '../../components/active/reducer';

class MineBox extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentWillMount() {

    }



    render(){
        const {roleStr} = this.props.reduxData;

        return (
            <View style={{}}>
                {
                    roleStr == 1 ? (
                        <GoodSelect1   navigation={this.props.navigation}/>
                    ) : (
                        <GoodSelect2  navigation={this.props.navigation}/>
                    )
                }
            </View>
        )
    }
}

export default connect (
    state => ({reduxData: state.reduxData}),
    dispath => bindActionCreators({setRoleStr},dispath)
)(MineBox);


