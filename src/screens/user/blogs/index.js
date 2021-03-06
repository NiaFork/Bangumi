/*
 * @Author: czy0729
 * @Date: 2020-03-22 14:18:50
 * @Last Modified by: czy0729
 * @Last Modified time: 2020-12-20 03:27:04
 */
import React from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import { ListView, Heatmap } from '@components'
import { ItemBlog } from '@screens/_'
import { _ } from '@stores'
import { inject, withHeader, observer } from '@utils/decorators'
import { hm } from '@utils/fetch'
import { keyExtractor } from '@utils/app'
import Store from './store'

const title = '用户日志'
const event = {
  id: '用户日志.跳转'
}

export default
@inject(Store)
@withHeader({
  screen: title
})
@observer
class Blogs extends React.Component {
  static navigationOptions = {
    title
  }

  static contextTypes = {
    $: PropTypes.object,
    navigation: PropTypes.object
  }

  async componentDidMount() {
    const { $ } = this.context
    $.init()

    hm(`user/${$.userId}/blog`, 'Blogs')
  }

  renderItem = ({ item, index }) => {
    const { navigation } = this.context
    return (
      <ItemBlog
        key={item.userId}
        navigation={navigation}
        event={event}
        index={index}
        {...item}
      />
    )
  }

  render() {
    const { $ } = this.context
    return (
      <View>
        <ListView
          style={_.container.plain}
          data={$.blogs}
          keyExtractor={keyExtractor}
          scrollToTop
          renderItem={this.renderItem}
          onHeaderRefresh={$.refresh}
          onFooterRefresh={() => $.fetchBlogs()}
        />
        <Heatmap bottom={_.bottom} id='用户日志' screen='Blogs' />
      </View>
    )
  }
}
