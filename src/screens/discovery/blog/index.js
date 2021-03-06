/*
 * @Author: czy0729
 * @Date: 2020-04-04 16:02:05
 * @Last Modified by: czy0729
 * @Last Modified time: 2020-12-18 16:36:59
 */
import React from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import { Heatmap } from '@components'
import { _ } from '@stores'
import { open } from '@utils'
import { inject, withHeader, observer } from '@utils/decorators'
import { t } from '@utils/fetch'
import Tabs from './tabs'
import Store from './store'

const title = '日志'

export default
@inject(Store)
@withHeader({
  screen: title,
  alias: '全站日志',
  hm: ['discovery/blog', 'DiscoveryBlog']
})
@observer
class DiscoveryBlog extends React.Component {
  static navigationOptions = {
    title
  }

  static contextTypes = {
    $: PropTypes.object,
    navigation: PropTypes.object
  }

  componentDidMount() {
    const { $, navigation } = this.context
    $.init()

    navigation.setParams({
      heatmap: '全站日志.右上角菜单',
      popover: {
        data: ['浏览器查看'],
        onSelect: key => {
          t('全站日志.右上角菜单', {
            key
          })

          switch (key) {
            case '浏览器查看':
              open('https://bgm.tv/blog')
              break
            default:
              break
          }
        }
      }
    })
  }

  render() {
    const { $ } = this.context
    const { _loaded } = $.state
    return (
      <View style={_.container.bg}>
        {!!_loaded && <Tabs />}
        <Heatmap
          right={_.wind + 62}
          bottom={_.window.height - _.tabsHeaderHeight - 12}
          id='全站日志.标签页切换'
          transparent
        />
        <Heatmap
          right={_.wind}
          bottom={_.window.height - _.tabsHeaderHeight - 12}
          id='全站日志.标签页点击'
          transparent
        />
      </View>
    )
  }
}
