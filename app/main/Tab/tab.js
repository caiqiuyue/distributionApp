import React,{Component} from 'react';
import { Image,Text ,View,DeviceEventEmitter} from 'react-native';
import { TabNavigator, TabBarBottom} from 'react-navigation';
// import TabHome from '../../MyHome/HomePage/buyers/homePage';
import TabHome from '../../MyHome/HomePage/homepageBox';
import Mine from '../../MyHome/Mine/MineBox';
// import Mine from '../../MyHome/Mine/Security';
import TabBarItem from './TabBarItem';
import TabBarLabel from './TabBarLabel';
import Message from '../../MyHome/Message/message';
import Publish from '../../MyHome/Publish/publishBox';
import GoodSelect from '../../MyHome/GoodSelect/GoodSelect';
import CodePush from 'react-native-code-push'
import Order from '../../MyHome/Order/Order';

const Tab = TabNavigator(
    {
        TabHome:{
            screen:TabHome,
            navigationOptions:({navigation}) => {

                if(navigation.isFocused()){
                    CodePush.sync();
                    CodePush.allowRestart();//在加载完了可以允许重启
                }

                return ({
                    tabBarLabel:({focused,tintColor}) => (
                        <TabBarLabel
                            navigation={navigation}
                            nameKey={'1'}
                            tintColor={tintColor}
                            focused={focused}
                            lableName={'商品'}
                        />),
                    tabBarIcon:({focused,tintColor}) => (
                        <TabBarItem
                            navigation={navigation}
                            nameKey={'1'}
                            tintColor={tintColor}
                            focused={focused}
                            normalImage={require('./home1.png')}
                            selectedImage={require('./home2.png')}
                        />


                    ),

                })
            },
        },


        Publish:{
            screen:Publish,
            navigationOptions:({navigation}) => {

                if(navigation.isFocused()){
                    CodePush.sync();
                    CodePush.allowRestart();//在加载完了可以允许重启
                }

                return ({
                    tabBarLabel:({focused,tintColor}) => (
                        <TabBarLabel
                            navigation={navigation}
                            nameKey={'6'}
                            tintColor={tintColor}
                            focused={focused}
                            lableName={'大厅'}
                        />),
                    tabBarIcon:({focused,tintColor}) => (
                        <TabBarItem
                            navigation={navigation}
                            nameKey={'6'}
                            tintColor={tintColor}
                            focused={focused}
                            normalImage={require('./publish.png')}
                            selectedImage={require('./publish.png')}
                        />


                    ),

                })
            },
        },


        GoodSelect:{
            screen:GoodSelect,
            navigationOptions:({navigation}) => {
                


                if(navigation.isFocused()){
                    
                    console.log(navigation.isFocused(),'navigation.isFocused()');
                    
                    DeviceEventEmitter.emit('tab','GoodSelect');
                    CodePush.sync();
                    CodePush.allowRestart();//在加载完了可以允许重启
                }

                
                return ({
                    tabBarLabel:({focused,tintColor}) => (
                        <TabBarLabel
                            navigation={navigation}
                            nameKey={'3'}
                            tintColor={tintColor}
                            focused={focused}
                            lableName={'订单'}
                        />),
                    tabBarIcon:({focused,tintColor}) => (
                        <TabBarItem
                            navigation={navigation}
                            nameKey={'3'}
                            tintColor={tintColor}
                            focused={focused}
                            normalImage={require('./order1.png')}
                            selectedImage={require('./order2.png')}

                        />
                    )
                })
            },
        },


        Order:{
            screen:Order,
            navigationOptions:({navigation}) => {

                if(navigation.isFocused()){
                    DeviceEventEmitter.emit('tab','Order');
                    CodePush.sync();
                    CodePush.allowRestart();//在加载完了可以允许重启
                }

                return ({
                    tabBarLabel:({focused,tintColor}) => (
                        <TabBarLabel
                            navigation={navigation}
                            nameKey={'5'}
                            tintColor={tintColor}
                            focused={focused}
                            lableName={'工单'}
                        />),
                    tabBarIcon:({focused,tintColor}) => (
                        <TabBarItem
                            navigation={navigation}
                            nameKey={'5'}
                            tintColor={tintColor}
                            focused={focused}
                            normalImage={require('./ord1.png')}
                            selectedImage={require('./ord2.png')}

                        />
                    )
                })
            },
        },


        Message:{
            screen:Message,
            navigationOptions:({navigation}) => {

                if(navigation.isFocused()){
                    CodePush.sync();
                    CodePush.allowRestart();//在加载完了可以允许重启
                }



                return ({
                    tabBarLabel:({focused,tintColor}) => (
                        <TabBarLabel
                            navigation={navigation}
                            nameKey={'2'}
                            tintColor={tintColor}
                            focused={focused}
                            lableName={'消息'}
                        />),
                    tabBarIcon:({focused,tintColor}) => (
                        <TabBarItem
                            navigation={navigation}
                            nameKey={'2'}
                            tintColor={tintColor}
                            type={true}
                            focused={focused}
                            normalImage={require('./msg1.png')}
                            selectedImage={require('./msg2.png')}
                        />

                    )
                })
            },
        },

        Mine:{
            screen:Mine,

            navigationOptions:({navigation}) => {


                if(navigation.isFocused()){
                    CodePush.sync();
                    CodePush.allowRestart();//在加载完了可以允许重启
                }

                return ({
                    tabBarLabel:({focused,tintColor}) => (
                        <TabBarLabel
                            navigation={navigation}
                            nameKey={'4'}
                            tintColor={tintColor}
                            focused={focused}
                            lableName={'我的'}
                        />),
                    tabBarIcon:({focused,tintColor}) => (
                        <TabBarItem
                            navigation={navigation}
                            nameKey={'4'}
                            tintColor={tintColor}
                            focused={focused}
                            normalImage={require('./mine1.png')}
                            selectedImage={require('./mine2.png')}
                        />
                    ),
                })
            },
        },
    },

    {
        initialRouteName: 'TabHome',
        tabBarComponent:TabBarBottom,
        tabBarPosition:'bottom',
        swipeEnabled:true,
        animationEnabled:false,
        lazy:true,
        tabBarOptions:{
            //tabBarComponent:TabBarBottom,
            activeTintColor:'#f94939',
            inactiveTintColor:'grey',
            style:{backgroundColor:'#fff',padding:3},
            labelStyle: {
                fontSize: 8,
                color: '#333'
            },
        }

    },


);

export default Tab;

