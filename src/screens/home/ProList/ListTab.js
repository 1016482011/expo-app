import React from 'react'
import { StyleSheet, FlatList, RefreshControl, Alert } from 'react-native'
import { Text, View, Body, Content } from 'native-base'
import { connect } from 'react-redux'
import ActionSheet from 'react-native-actionsheet'
import Image from 'react-native-image-progress'
import _ from 'lodash'
import EmptyFull from '../../../components/EmptyFull'
import TouchFeedback from '../../../components/TouchFeedback'
import { problemSelectIdAction } from '../../../store/actions/problemAction'
import { AssProblemsImgQuery } from '../../../helper/api'
import { problemDelMutationAction } from '../../../store/actions/requestAction'
import { showToast } from '../../../helper/util'

class ListCard extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      imgs: []
    }
  }
  ListItem = props => {
    const { label, text } = props
    return (
      <View style={styles.flexRow}>
        <Text style={styles.flexRowLeft}>{label}</Text>
        <Text numberOfLines={1} style={styles.flexRowRight}>
          {text}
        </Text>
      </View>
    )
  }
  componentDidMount() {
    const {
      data: { fileToken }
    } = this.props
    AssProblemsImgQuery(fileToken).then(v => {
      if (_.isEmpty(v.result.cosFiles)) return
      this.setState({ imgs: v.result.cosFiles })
    })
  }
  render() {
    const {
      data: { pfUser, problemDescription, requirementName, subProjectName }
    } = this.props
    const { imgs } = this.state
    const ListItem = this.ListItem
    return (
      <TouchFeedback
        style={styles.itemBox}
        onPress={() => this.props.onPress()}
      >
        <Body>
          <ListItem label={'操作者: '} text={pfUser} />
          <ListItem label={'指标要求: '} text={requirementName} />
          <ListItem label={'子项目: '} text={subProjectName} />
          <ListItem
            label={'问题描述: '}
            text={problemDescription === 'null' ? '未填写' : problemDescription}
          />
          {!_.isEmpty(imgs) && (
            <View style={styles.flexRow}>
              <Text style={styles.flexRowLeft}>图片: </Text>
              <View style={styles.flexRowRight}>
                {imgs.map((v, index) => (
                  <Image
                    key={index}
                    style={styles.imgList}
                    onError={e => {
                      showToast('图片加载错误!')
                      console.log(e)
                    }}
                    source={{
                      uri: v.downloadUrl
                    }}
                  />
                ))}
              </View>
            </View>
          )}
        </Body>
      </TouchFeedback>
    )
  }
}

class ListTab extends React.PureComponent {
  constructor(props) {
    super(props)
  }
  _selectPro = id => () => {
    const { problemSelectIdAction } = this.props
    problemSelectIdAction(id)
    this.ActionSheet.show()
  }
  _confirm = index => {
    const { problemDelMutationAction, navigation } = this.props
    if (index === 0) navigation.navigate('ReadProblemDetail')
    if (index === 1) navigation.navigate('ProblemEdit')
    if (index === 2) {
      Alert.alert(
        '警告',
        '删除后不可恢复，是否进行删除操作？',
        [
          { text: '否', onPress: () => {}, style: 'cancel' },
          {
            text: '是',
            onPress: () => problemDelMutationAction()
          }
        ],
        { cancelable: false }
      )
    }
  }

  _renderItem = ({ item }) => (
    <ListCard key={item.id} data={item} onPress={this._selectPro(item.id)} />
  )
  _keyExtractor = item => item.id

  _onRefresh = () => {
    this.props.onRefresh()
  }

  render() {
    const {
      problemData: { proList, isProReady }
    } = this.props
    return (
      <Content
        refreshControl={
          <RefreshControl
            refreshing={!isProReady}
            onRefresh={this._onRefresh}
          />
        }
      >
        <View style={{ paddingVertical: 10 }}>
          <FlatList
            data={proList}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            ListEmptyComponent={() => (
              <View style={{ flex: 1 }}>
                <EmptyFull tips={'暂时还没有任何问题~'} />
              </View>
            )}
          />
        </View>
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          title={'请选择你的操作'}
          options={['查看', '编辑', '删除', '取消']}
          cancelButtonIndex={3}
          destructiveButtonIndex={2}
          onPress={this._confirm}
        />
      </Content>
    )
  }
}

export default connect(
  state => ({
    projectData: state.project,
    problemData: state.problem
  }),
  {
    problemSelectIdAction,
    problemDelMutationAction
  }
)(ListTab)

const styles = StyleSheet.create({
  itemBox: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 8,
    marginVertical: 10
  },
  flexRow: { flex: 1, flexDirection: 'row', marginBottom: 5 },
  flexRowLeft: { width: 80 },
  flexRowRight: { flex: 1, flexDirection: 'row' },
  imgList: {
    width: '30%',
    height: 50,
    resizeMode: 'contain',
    marginRight: '3%'
  },
  iconTool: {
    flex: 1,
    flexDirection: 'row'
  },
  iconToolBtn: {
    flexDirection: 'row',
    paddingRight: 10
  }
})
