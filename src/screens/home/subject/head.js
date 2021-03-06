/*
 * @Author: czy0729
 * @Date: 2019-03-23 04:30:59
 * @Last Modified by: czy0729
 * @Last Modified time: 2020-12-21 13:59:13
 */
import React from 'react'
import { View, Clipboard } from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { Flex, Text, Katakana, Heatmap } from '@components'
import { ScoreTag, Tag } from '@screens/_'
import { _, systemStore } from '@stores'
import { toFixed } from '@utils'
import { info } from '@utils/ui'
import { x18 } from '@utils/app'
import { imageWidth, imageHeight } from './store'
import Cover from './cover'
import Series from './series'

function Head({ style }, { $ }) {
  const styles = memoStyles()
  const { showRelation } = systemStore.setting
  const { images = {} } = $.subject
  const { relations = [] } = $.subjectFormHTML

  // 关联: 前传和续集, 或系列: 若为单行本, relations第一项则为系列
  const subjectPrev = relations.find(item => item.type === '前传')
  const subjectAfter = relations.find(item => item.type === '续集')
  const subjectSeries = relations?.[0]?.type === '系列' ? relations[0] : null
  const hasRelation = !!(subjectPrev || subjectAfter)
  const showSeries = subjectPrev || subjectAfter || subjectSeries

  // 主标题大小
  let size = $.cn.length > 24 ? 11 : $.cn.length > 16 ? 13 : 16
  if (showRelation && hasRelation) size = Math.max(10, size - 2)
  return (
    <View style={[styles.container, style]}>
      <Cover image={images.common} placeholder={$.coverPlaceholder} />
      <View style={styles.content}>
        <View style={styles.title}>
          <View>
            {!!$.jp && (
              <Katakana.Provider
                size={$.jp.length > 12 ? 11 : 13}
                itemStyle={styles.katakana}
                numberOfLines={hasRelation ? 1 : 2}
              >
                <Katakana
                  type='sub'
                  size={$.jp.length > 12 ? 11 : 13}
                  numberOfLines={hasRelation ? 1 : 2}
                  onLongPress={() => {
                    Clipboard.setString($.jp)
                    info(`已复制 ${$.jp}`)
                  }}
                >
                  {!!$.titleLabel && `${$.titleLabel} · `}
                  {$.jp}
                </Katakana>
              </Katakana.Provider>
            )}
            {!subjectSeries && (
              <Text
                style={!!$.cn && _.mt.xs}
                size={size}
                bold
                onLongPress={() => {
                  Clipboard.setString($.cn)
                  info(`已复制 ${$.cn}`)
                }}
              >
                {$.cn}
              </Text>
            )}
            <Heatmap id='条目.复制标题' />
          </View>
          {showSeries && (
            <Series
              prev={subjectPrev}
              after={subjectAfter}
              series={subjectSeries}
              size={size}
            />
          )}
        </View>
        <Flex>
          {!$.hideScore && (
            <>
              <Text type='main' size={20}>
                {$.rating.score === '' ? '-' : toFixed($.rating.score, 1)}{' '}
              </Text>
              {$.rating.score !== '' && (
                <ScoreTag style={_.ml.sm} value={$.rating.score} />
              )}
              {x18($.subjectId, $.cn || $.jp) && (
                <Tag style={_.ml.sm} size={13} value='H' />
              )}
            </>
          )}
        </Flex>
      </View>
    </View>
  )
}

Head.contextTypes = {
  $: PropTypes.object,
  navigation: PropTypes.object
}

export default observer(Head)

const memoStyles = _.memoStyles(_ => ({
  container: {
    paddingTop: 48
  },
  content: {
    minHeight: imageHeight - _.space,
    paddingVertical: _.space,
    paddingLeft: imageWidth + _.wind + 12,
    paddingRight: _.wind,
    backgroundColor: _.colorPlain,
    borderTopLeftRadius: _.radiusLg,
    borderTopRightRadius: _.radiusLg
  },
  title: {
    minHeight: 84
  },
  katakana: {
    marginTop: -11
  },
  series: {
    width: 168,
    paddingRight: _.sm,
    marginTop: _.sm
  }
}))
