/*
 * @Author: czy0729
 * @Date: 2020-04-25 14:54:15
 * @Last Modified by: czy0729
 * @Last Modified time: 2020-12-19 14:38:55
 */
import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { Loading, ListView, Heatmap } from '@components'
import { ItemSearch, ItemCollectionsGrid } from '@screens/_'
import { _ } from '@stores'
import { keyExtractor } from '@utils/app'
import { MODEL_SUBJECT_TYPE } from '@constants/model'

const event = {
  id: '作品.跳转'
}

export default
@observer
class List extends React.Component {
  static contextTypes = {
    $: PropTypes.object,
    navigation: PropTypes.object
  }

  renderItem = ({ item, index }) => {
    const { $, navigation } = this.context
    const { list } = $.state
    if (list) {
      return (
        <ItemSearch
          style={_.container.item}
          navigation={navigation}
          index={index}
          typeCn={MODEL_SUBJECT_TYPE.getTitle(item.type)}
          event={{
            ...event,
            data: {
              type: 'list'
            }
          }}
          {...item}
        >
          {!index && <Heatmap id='作品.跳转' />}
        </ItemSearch>
      )
    }
    return (
      <ItemCollectionsGrid
        navigation={navigation}
        index={index}
        event={{
          ...event,
          data: {
            type: 'grid'
          }
        }}
        typeCn={MODEL_SUBJECT_TYPE.getTitle(item.type)}
        {...item}
        id={item.id.replace('/subject/', '')}
      />
    )
  }

  render() {
    const { $ } = this.context
    const { _loaded } = $.monoWorks
    if (!_loaded) {
      return <Loading />
    }

    const { list } = $.state
    const numColumns = list ? undefined : 4
    return (
      <ListView
        key={String(numColumns)}
        numColumns={numColumns}
        contentContainerStyle={list ? this.styles.list : this.styles.grid}
        keyExtractor={keyExtractor}
        data={$.monoWorks}
        scrollToTop
        renderItem={this.renderItem}
        onHeaderRefresh={$.onHeaderRefresh}
        onFooterRefresh={$.fetchMonoWorks}
      />
    )
  }

  get styles() {
    return memoStyles()
  }
}

const memoStyles = _.memoStyles(_ => ({
  list: {
    paddingBottom: _.bottom
  },
  grid: {
    paddingHorizontal: _.wind - _._wind,
    paddingBottom: _.bottom
  }
}))
