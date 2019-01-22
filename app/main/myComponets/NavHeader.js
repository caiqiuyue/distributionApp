import React, { Component } from 'react'
import {View, Text, Image, ImageBackground, TouchableOpacity} from 'react-native'

/**
 * nav, navigation对象，必传参数
 * bgSrc, 背景图片的url，必须require('./bg_01.png')方式引入
 * icon, 回退按钮的url，必须require('./bg_01.png')方式引入
 * title, 导航栏的title
 * height, 导航栏高度，默认60
 * iconStyle, 回退按钮的样式
 * textStyle title的样式
 */
export default class Security extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {nav, bgSrc, icon, title, height = 60, iconStyle, textStyle} = this.props;
    return (
      <ImageBackground source={bgSrc} style={{width: '100%', height: '100%'}}>
        <View style={{height: height, flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => nav.navigation.goBack(null)}>
            <Image source={icon} style={{marginRight: 20, marginLeft: 20, width: 20, height: 22, ...iconStyle}} />
          </TouchableOpacity>
          <Text style={{color: '#333', fontSize: 20, ...textStyle}}>{title}</Text>
        </View>
      </ImageBackground>
    )
  }
}


