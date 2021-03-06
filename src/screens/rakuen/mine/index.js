/*
 * @Author: czy0729
 * @Date: 2020-05-02 15:54:30
 * @Last Modified by: czy0729
 * @Last Modified time: 2020-12-19 17:05:57
 */
import React from 'react'
import PropTypes from 'prop-types'
import { ScrollView, Flex } from '@components'
import { _ } from '@stores'
import { open } from '@utils'
import { inject, withHeader, observer } from '@utils/decorators'
import { t } from '@utils/fetch'
import Item from './item'
import Store from './store'

const title = '我的小组'

export default
@inject(Store)
@withHeader({
  screen: title,
  hm: ['group/mine', 'Mine']
})
@observer
class Mine extends React.Component {
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
      heatmap: '我的小组.右上角菜单',
      popover: {
        data: ['浏览器查看'],
        onSelect: key => {
          t('我的小组.右上角菜单', {
            key
          })

          switch (key) {
            case '浏览器查看':
              open($.url)
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
    const { list } = $.mine
    return (
      <ScrollView
        style={_.container.plain}
        contentContainerStyle={_.container.outer}
        scrollToTop
      >
        <Flex wrap='wrap'>
          {list.map(item => (
            <Item key={item.id} {...item} />
          ))}
        </Flex>
      </ScrollView>
    )
  }
}
