/*
 * @Author: czy0729
 * @Date: 2019-05-11 04:19:28
 * @Last Modified by: czy0729
 * @Last Modified time: 2020-12-19 11:52:42
 */
import React from 'react'
import { StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'
import { ListView, Heatmap } from '@components'
import { ItemTopic, NavigationBarEvents } from '@screens/_'
import { _ } from '@stores'
import { open, copy } from '@utils'
import { keyExtractor } from '@utils/app'
import { inject, withTransitionHeader, observer } from '@utils/decorators'
import { hm, t } from '@utils/fetch'
import { info } from '@utils/ui'
import HeaderTitle from './header-title'
import Extra from './extra'
import Info from './info'
import Store from './store'

const title = '人物'
const event = {
  id: '人物.跳转',
  data: {
    from: '吐槽'
  }
}

export default
@inject(Store)
@withTransitionHeader({
  screen: title,
  barStyle: 'dark-content',
  HeaderTitle
})
@observer
class Mono extends React.Component {
  static contextTypes = {
    $: PropTypes.object,
    navigation: PropTypes.object
  }

  async componentDidMount() {
    const { $ } = this.context
    if ($.mono._loaded && $.chara._loaded) {
      this.updateNavigation()
    }

    await $.init()
    this.updateNavigation()

    hm($.monoId, 'Mono')
  }

  updateNavigation = () => {
    const { $, navigation } = this.context
    const { name } = $.mono
    withTransitionHeader.setTitle(navigation, name)

    navigation.setParams({
      heatmap: '人物.右上角菜单',
      popover: {
        data: ['浏览器查看', '复制链接'],
        onSelect: key => {
          t('人物.右上角菜单', {
            key
          })

          switch (key) {
            case '浏览器查看':
              open($.url)
              break
            case '复制链接':
              copy($.url)
              info('已复制')
              break
            default:
              break
          }
        }
      },
      extra: <Extra $={$} navigation={navigation} />
    })
  }

  onScroll = e => {
    const { $ } = this.context
    const { onScroll } = this.props
    onScroll(e)

    const { showHeaderTitle } = $.state
    const { nativeEvent } = e
    const { y } = nativeEvent.contentOffset
    const headerTranstion = 48
    if (!showHeaderTitle && y > headerTranstion) {
      $.updateShowHeaderTitle(true)
      return
    }

    if (showHeaderTitle && y <= headerTranstion) {
      $.updateShowHeaderTitle(false)
    }
  }

  ListHeaderComponent = (<Info />)

  renderItem = ({ item, index }) => {
    const { navigation } = this.context
    return (
      <ItemTopic navigation={navigation} index={index} event={event} {...item}>
        {index === 2 && (
          <Heatmap
            id='人物.跳转'
            data={{
              from: '吐槽'
            }}
          />
        )}
        {index === 3 && (
          <Heatmap
            id='人物.跳转'
            data={{
              to: 'Zone',
              alias: '空间'
            }}
          />
        )}
        {index === 4 && (
          <Heatmap
            id='人物.跳转'
            data={{
              to: 'WebBrowser',
              alias: '浏览器'
            }}
          />
        )}
      </ItemTopic>
    )
  }

  render() {
    const { $ } = this.context
    return (
      <View style={_.container.plain}>
        <NavigationBarEvents />
        <ListView
          contentContainerStyle={styles.contentContainerStyle}
          keyExtractor={keyExtractor}
          data={$.monoComments}
          scrollEventThrottle={16}
          scrollToTop
          ListHeaderComponent={this.ListHeaderComponent}
          removeClippedSubviews={false}
          renderItem={this.renderItem}
          onScroll={this.onScroll}
          onHeaderRefresh={$.onHeaderRefresh}
          onFooterRefresh={$.fetchMono}
          {...withTransitionHeader.listViewProps}
        />
        <Heatmap id='人物' screen='Mono' />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingBottom: _.space
  }
})
