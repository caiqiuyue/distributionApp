import React,{Component} from 'react';
import {View, Text,Dimensions} from 'react-native';
import Order1 from './buyers/Order'
import Order2 from './seller/Order'
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
                        <Order1   navigation={this.props.navigation}/>
                    ) : (
                        <Order2  navigation={this.props.navigation}/>
                    )
                }
            </View>
        )
    }
}



export default connect (
    state => ({reduxData: state.reduxData}),
    dispath => bindActionCreators({getData, setRoleStr},dispath)
)(MineBox);