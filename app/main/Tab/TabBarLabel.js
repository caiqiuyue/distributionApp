import React,{Component} from 'react';
import { Text ,View,Platform, TouchableHighlight} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setData} from '../../components/active/reducer';
import Message from "../../MyHome/Message/message";
import Mine from "../../MyHome/Mine/Mine";
import GoodSelect from "../../MyHome/GoodSelect/buyers/GoodSelect";
import TabHome from "../../MyHome/HomePage/buyers/homePage";
import Order from "../../MyHome/Order/Order";
import Publish from '../../MyHome/Publish/publishBox';

class TabBarLabel extends Component {

    getRoot = () => {
        // console.log(this.props);
        const callback = () => {
            if(this.props.nameKey === '1') {
                this.props.navigation.navigate('TabHome',{ user: '' })
            } else if(this.props.nameKey === '2') {
                this.props.navigation.navigate('Message',{ user: '' })
            } else if(this.props.nameKey === '3') {
                this.props.navigation.navigate('GoodSelect',{ user: '' })
            }else if(this.props.nameKey === '5'){

                this.props.navigation.navigate('Order',{ user: '' })
            }else if(this.props.nameKey === '6'){

                this.props.navigation.navigate('Publish',{ user: '' })
            }
            else {
                this.props.navigation.navigate('Mine',{ user: '' })
            }
        };
        this.props.setData(this.props.nameKey, callback);
    };

    render() {
        return(
            <TouchableHighlight underlayColor="transparent" onPress={this.getRoot}>
                <View>
                    <Text style={{...Platform.select({
                            android: {
                                left:"35%"
                            },
                            ios:{

                            }
                        }),color: this.props.focused ? '#f94939' : '#333',fontSize:12}}>{this.props.lableName}</Text>
                </View>
            </TouchableHighlight>
        )
    }

}
export default connect (
    state => ({reduxData: state.reduxData}),
    dispath => bindActionCreators({setData},dispath)
)(TabBarLabel);
