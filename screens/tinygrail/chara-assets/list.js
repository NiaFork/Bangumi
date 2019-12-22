/*
 * @Author: czy0729
 * @Date: 2019-09-19 00:35:07
 * @Last Modified by: czy0729
 * @Last Modified time: 2019-12-21 22:08:01
 */
import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { Loading, ListView } from '@components'
import { _ } from '@stores'
import { t } from '@utils/fetch'
import Item from '../_/item'
import ItemTemple from '../_/item-temple'
import { sortList } from '../_/utils'

function List({ index }, { $, navigation }) {
  const { chara, ico, _loaded } = $.myCharaAssets
  if (!_loaded) {
    return <Loading style={_.container.flex} />
  }

  const type = index === 0 ? 'chara' : 'ico'
  const isChara = type === 'chara'
  const isTemple = index === 1

  let data
  if (isChara) {
    data = chara
  } else if (isTemple) {
    data = $.temple
  } else {
    data = ico
  }

  const { sort, direction } = $.state
  if (isChara && sort) {
    data = {
      ...chara,
      list: sortList(sort, direction, chara.list)
    }
  }

  const numColumns = isTemple ? 3 : undefined
  const event = {
    id: '我的持仓.跳转'
  }
  return (
    <ListView
      key={String(numColumns)}
      style={_.container.flex}
      keyExtractor={(item, index) => String(index)}
      data={data}
      numColumns={numColumns}
      renderItem={({ item, index }) => {
        if (isTemple) {
          return (
            <ItemTemple
              index={index}
              {...item}
              onPress={() => {
                t('我的持仓.跳转', {
                  to: 'TinygrailSacrifice',
                  monoId: item.id
                })

                navigation.push('TinygrailSacrifice', {
                  monoId: `character/${item.id}`
                })
              }}
            />
          )
        }
        return (
          <Item
            index={index}
            {...item}
            type={type}
            users={type === 'ico' ? 'ico' : undefined} // 这里api有bug
            event={event}
          />
        )
      }}
      onHeaderRefresh={() => {
        if (isTemple) {
          return $.fetchTemple()
        }
        return $.fetchMyCharaAssets()
      }}
    />
  )
}

List.contextTypes = {
  $: PropTypes.object,
  navigation: PropTypes.object
}

export default observer(List)
