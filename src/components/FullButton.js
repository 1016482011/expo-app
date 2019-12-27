import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'

export default class FullButton extends Component {
  render() {
    const { title, loading } = this.props
    return (
      <Button
        title={title}
        containerStyle={styles.submitButtonContainer}
        buttonStyle={styles.submitButton}
        titleStyle={styles.submitButtonText}
        loading={loading}
        onPress={() => this.props.onPress()}
      />
    )
  }
}

const styles = StyleSheet.create({
  submitButtonText: {
    fontFamily: 'bold',
    fontSize: 14
  },
  submitButton: {
    borderRadius: 4,
    width: '100%',
    height: 50,
    backgroundColor: '#3781C6',
    elevation: 1
  },
  submitButtonContainer: {
    elevation: 1
  }
})
