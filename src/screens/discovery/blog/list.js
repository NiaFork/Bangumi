/*
 * @Author: czy0729
 * @Date: 2020-04-04 16:14:03
 * @Last Modified by: czy0729
 * @Last Modified time: 2020-12-18 22:01:23
 */
import React from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import { ActivityIndicator } from '@ant-design/react-native'
import { ScrollView, Flex } from '@components'
import { Pagination, ItemBlog } from '@screens/_'
import { _ } from '@stores'
import { observer } from '@utils/decorators'

const event = {
  id: '全站日志.跳转'
}
const heatmaps = {
  prev: '全站日志.上一页',
  next: '全站日志.下一页',
  search: '全站日志.页码跳转'
}

export default
@observer
class List extends React.Component {
  static contextTypes = {
    $: PropTypes.object,
    navigation: PropTypes.object
  }

  renderPagination() {
    const { $ } = this.context
    const { type } = this.props
    const { ipt } = $.state
    return (
      <Pagination
        style={_.mt.md}
        input={ipt[type]}
        heatmaps={heatmaps}
        onPrev={$.prev}
        onNext={$.next}
        onChange={$.onChange}
        onSearch={$.doSearch}
      />
    )
  }

  render() {
    const { $, navigation } = this.context
    const { type } = this.props
    const { show } = $.state
    const { list, _loaded } = $.blog(type)
    return (
      <ScrollView
        contentContainerStyle={_.container.bottom}
        scrollToTop={type === $.type}
      >
        {this.renderPagination()}
        {show && (
          <>
            {_loaded ? (
              <View style={this.styles.container}>
                {list.map((item, index) => (
                  <ItemBlog
                    key={item.id}
                    style={_.container.item}
                    navigation={navigation}
                    event={event}
                    index={index}
                    {...item}
                  />
                ))}
              </View>
            ) : (
              <Flex style={this.styles.loading} justify='center'>
                <ActivityIndicator />
              </Flex>
            )}
            {this.renderPagination()}
          </>
        )}
      </ScrollView>
    )
  }

  get styles() {
    return memoStyles()
  }
}

const memoStyles = _.memoStyles(_ => ({
  container: {
    paddingVertical: _.md,
    minHeight: _.window.height
  },
  loading: {
    paddingTop: _.md,
    paddingBottom: 240,
    minHeight: _.window.height
  }
}))
