/*
 * @Author: czy0729
 * @Date: 2020-02-02 05:03:58
 * @Last Modified by: czy0729
 * @Last Modified time: 2020-12-20 17:38:38
 */
import React from 'react'
import { StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'
import { ScrollView, FixedTextarea, Input, Text, Loading } from '@components'
import { _ } from '@stores'
import { inject, withHeader, observer } from '@utils/decorators'
import Chat from './chat'
import Heatmaps from './heatmaps'
import Store from './store'

const title = '短信'

export default
@inject(Store)
@withHeader({
  screen: title,
  hm: ['pm', 'PM']
})
@observer
class PM extends React.Component {
  static navigationOptions = {
    title
  }

  static contextTypes = {
    $: PropTypes.object,
    navigation: PropTypes.object
  }

  scrollView
  fixedTextarea

  componentDidMount() {
    const { $ } = this.context
    $.init(this.scrollView)
  }

  connectRefScrollView = ref => (this.scrollView = ref)

  connectRefFixedTextarea = ref => (this.fixedTextarea = ref)

  showFixedTextare = () => this.fixedTextarea.onFocus()

  onTitleChange = evt => {
    const { $ } = this.context
    const { nativeEvent } = evt
    const { text } = nativeEvent
    $.onTitleChange(text)
  }

  onSubmit = value => {
    const { $, navigation } = this.context
    return $.doSubmit(value, this.scrollView, navigation)
  }

  renderNewForm() {
    const { $ } = this.context
    const { userId, userName } = $.params
    if (!userId) {
      return null
    }

    return (
      <>
        <View style={styles.form}>
          <Text>收件人: {userName}</Text>
        </View>
        <Input
          style={styles.ipt}
          placeholder='输入标题'
          onChange={this.onTitleChange}
        />
      </>
    )
  }

  render() {
    const { $ } = this.context
    const { value } = $.state
    return (
      <View style={_.container.screen}>
        {$.pmParams._loaded || $.pmDetail._loaded ? (
          <ScrollView
            ref={this.connectRefScrollView}
            style={_.container.screen}
            contentContainerStyle={_.container.bottom}
            scrollToTop
          >
            <Chat />
          </ScrollView>
        ) : (
          <Loading />
        )}
        <FixedTextarea
          ref={this.connectRefFixedTextarea}
          placeholder='回复'
          value={value}
          onChange={$.onChange}
          onClose={$.closeFixedTextarea}
          onSubmit={this.onSubmit}
        >
          {this.renderNewForm()}
        </FixedTextarea>
        <Heatmaps />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  form: {
    paddingVertical: _.space,
    paddingHorizontal: _.wind
  },
  ipt: {
    paddingVertical: _.space,
    paddingHorizontal: _.wind,
    borderRadius: 0
  }
})
