
import React, { Component } from 'react'
import {StyleSheet, View, TextInput, Text, TouchableHighlight } from 'react-native';

let styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  inputBox: {
    position: 'absolute',
    left: 0,
    opacity: 0,
      padding:0
  },
  inputItem: {
    height: 45,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputItemBorderLeftWidth: {
    borderLeftWidth: 1,
    borderColor: '#ccc',
  },
  iconStyle: {
    width: 16,
    height: 16,
    backgroundColor: '#222',
    borderRadius: 8,
  },
});

export default class Password extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    }
  };

  _onPress = () => {
    this.refs.textInput.focus();
  };

  _onChange = (text) => {
    this.setState({
      text
    });
    this.props.onChange && this.props.onChange(text)
  };

  render(){
    let { maxLength, style } = this.props;
    return(
      <TouchableHighlight onPress={this._onPress} activeOpacity={1} underlayColor='transparent'>
        <View style={[styles.container, style]} >
          <TextInput
            style={[styles.inputBox, {width: maxLength * (style && style.width ? style.width : 45)}]}
            ref='textInput'
            maxLength={maxLength}
            autoFocus={true}
            keyboardType="numeric"
            onChangeText={this._onChange}
          />
          {
            this._getInputItem()
          }
        </View>
      </TouchableHighlight>
    )
  }

  _getInputItem(){
    let { maxLength, itemStyle, iconStyle } = this.props;
    let inputItem = [];
    let {text}=this.state;
    for (let i = 0; i < parseInt(maxLength); i ++) {
      if (i == 0) {
        inputItem.push(
          <View key={i} style={[styles.inputItem, itemStyle]}>
            {i < text.length ? <View style={[styles.iconStyle, iconStyle]} /> : null}
          </View>)
      } else {
        inputItem.push(
          <View key={i} style={[styles.inputItem,styles.inputItemBorderLeftWidth, itemStyle]}>
            {i < text.length ? <View style={[styles.iconStyle, iconStyle]} /> : null}
          </View>)
      }
    }
    return inputItem;
  }
};