
import React, { Component } from 'react'
import {StyleSheet, View, Dimensions } from 'react-native';

let styles = StyleSheet.create({
  cross: {
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  vertical: {
    position: 'absolute',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  crossItem: {
    borderWidth: 1
  },
  verticalItem: {
    borderWidth: 1
  },

});

export default class Password extends Component {
  constructor(props) {
    super(props);
  };

  componentDidMount() {

  }

  render() {
    const { width, height } = Dimensions.get('window');
    const { size = 1, type = 'dashed', color = '#333', border = ['left', 'right', 'top', 'bottom'] } = this.props;
    const cross = [];
    const vertical = [];
    for (let i = 0; i < width/2; i ++) {
      cross.push(i);
    }
    for (let i = 0; i < height/2; i ++) {
      vertical.push(i);
    }
    return (
      <View style={{ overflow: 'hidden' }}>
        <View onLayout={this.onLayout}>
          {
            this.props.children
          }
        </View>
        {
          border && border.length > 0 && border.indexOf('top') !== -1 && (
            <View style={[styles.cross, { top: 0, left: 0, height: type === 'dashed' ? size : size * 2 }]}>
              {
                cross.map((o, i) => {
                  return (
                    <View key={i} style={[styles.crossItem, {
                      height: type === 'dashed' ? size : size * 2,
                      width: type === 'dashed' ? size * 6 : size * 2,
                      backgroundColor: color,
                      borderColor: color,
                      borderRadius: type === 'dashed' ? 0 : size / 2,
                      marginLeft: 2,
                      marginRight: i === 0 ? 0 : 2,
                    }]} />
                  );
                })
              }
            </View>
          )
        }
        {
          border && border.length > 0 && border.indexOf('right') !== -1 && (
            <View style={[styles.vertical, {  width: type === 'dashed' ? size : size * 2, right: 0, top: 0 }]}>
              {
                vertical.map((o, i) => {
                  return (
                    <View key={i} style={[styles.verticalItem, {
                      width: type === 'dashed' ? size : size * 2,
                      height: type === 'dashed' ? size * 6 : size * 2,
                      backgroundColor: color,
                      borderColor: color,
                      borderRadius: type === 'dashed' ? 0 : size / 2,
                      marginTop: i === 0 ? 0 : 2,
                      marginBottom: 2,
                    }]} />
                  );
                })
              }
            </View>
          )
        }
        {
          border && border.length > 0 && border.indexOf('bottom') !== -1 && (
            <View style={[styles.cross, { bottom: 0, left: 0, height: type === 'dashed' ? size : size * 2 }]}>
              {
                cross.map((o, i) => {
                  return (
                    <View key={i} style={[styles.crossItem, {
                      height: type === 'dashed' ? size : size * 2,
                      width: type === 'dashed' ? size * 6 : size * 2,
                      backgroundColor: color,
                      borderColor: color,
                      borderRadius: type === 'dashed' ? 0 : size / 2,
                      marginLeft: 2,
                      marginRight: i === 0 ? 0 : 2,
                    }]} />
                  );
                })
              }
            </View>
          )
        }
        {
          border && border.length > 0 && border.indexOf('left') !== -1 && (
            <View style={[styles.vertical, {  width: type === 'dashed' ? size : size * 2, left: 0, top: 0 }]}>
              {
                vertical.map((o, i) => {
                  return (
                    <View key={i} style={[styles.verticalItem, {
                      width: type === 'dashed' ? size : size * 2,
                      height: type === 'dashed' ? size * 6 : size * 2,
                      backgroundColor: color,
                      borderColor: color,
                      borderRadius: type === 'dashed' ? 0 : size / 2,
                      marginTop: i === 0 ? 0 : 2,
                      marginBottom: 2,
                    }]} />
                  );
                })
              }
            </View>
          )
        }
      </View>
    );
  };
};