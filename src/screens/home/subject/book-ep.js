/*
 * @Author: czy0729
 * @Date: 2019-06-08 22:14:06
 * @Last Modified by: czy0729
 * @Last Modified time: 2020-12-15 14:18:51
 */
import React from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import {
  Flex,
  Touchable,
  Text,
  Input,
  Button,
  Iconfont,
  Heatmap
} from '@components'
import { SectionTitle } from '@screens/_'
import { _ } from '@stores'
import { observer } from '@utils/decorators'
import { t } from '@utils/fetch'

function BookEp({ style }, { $, navigation }) {
  const styles = memoStyles()
  const { chap, vol } = $.state
  const { book = {} } = $.subjectFormHTML
  const {
    status = {
      name: '未收藏'
    }
  } = $.collection
  return (
    <View style={[styles.container, _.container.wind, style]}>
      <SectionTitle
        right={
          !$.isLimit && $.wenku.wid ? (
            <Touchable
              style={styles.iconPlay}
              onPress={() => $.toWenku8($.wenku.wid)}
            >
              <Flex>
                <Iconfont name='discovery' size={16} />
                <Text style={_.ml.xs} size={12} type='sub'>
                  阅读
                </Text>
              </Flex>
              <Heatmap id='条目.阅读轻小说' />
            </Touchable>
          ) : (
            <Touchable
              style={styles.iconPlay}
              onPress={() => {
                t('条目.跳转', {
                  from: '源头',
                  subjectId: $.subjectId
                })

                navigation.push('Comic', {
                  cn: $.cn,
                  jp: $.jp,
                  subjectId: $.subjectId
                })
              }}
            >
              <Flex>
                <Iconfont name='search' size={16} />
                <Text style={_.ml.xs} size={12} type='sub'>
                  源头
                </Text>
              </Flex>
              <Heatmap
                id='条目.跳转'
                data={{
                  from: '源头'
                }}
              />
            </Touchable>
          )
        }
      >
        章节
      </SectionTitle>
      <Flex style={_.mt.md} align='start'>
        {status.name === '未收藏' ? (
          <Text type='sub'>收藏后开启管理进度</Text>
        ) : (
          <>
            <Flex.Item>
              <Flex>
                <Text style={styles.label} align='right'>
                  Chap.
                </Text>
                <View style={[styles.input, _.ml.sm]}>
                  <Input
                    keyboardType='numeric'
                    value={chap}
                    placeholder={book.chap || '0'}
                    clearButtonMode='never'
                    returnKeyType='done'
                    returnKeyLabel='更新'
                    onChangeText={text => {
                      const newText = text.replace(/[^\d]+/, '')
                      $.changeText('chap', newText)
                    }}
                    onSubmitEditing={$.doUpdateBookEp}
                  />
                  {!!book.totalChap && (
                    <Text style={styles.total} type='sub'>
                      / {book.totalChap}
                    </Text>
                  )}
                </View>
                <Button
                  style={[styles.btnPlus, _.ml.sm]}
                  type='ghostPrimary'
                  onPress={() => $.doUpdateNext('chap')}
                >
                  +
                </Button>
              </Flex>
              <Flex style={_.mt.sm}>
                <Text style={styles.label} align='right'>
                  Vol.
                </Text>
                <View style={[styles.input, _.ml.sm]}>
                  <Input
                    keyboardType='numeric'
                    value={vol}
                    placeholder={book.vol || '0'}
                    clearButtonMode='never'
                    returnKeyType='done'
                    returnKeyLabel='更新'
                    onChangeText={text => {
                      const newText = text.replace(/[^\d]+/, '')
                      $.changeText('vol', newText)
                    }}
                    onSubmitEditing={$.doUpdateBookEp}
                  />
                  {!!book.totalVol && (
                    <Text style={styles.total} type='sub'>
                      / {book.totalVol}
                    </Text>
                  )}
                </View>
                <Button
                  style={[styles.btnPlus, _.ml.sm]}
                  type='ghostPrimary'
                  onPress={() => $.doUpdateNext('vol')}
                >
                  +
                </Button>
                <Heatmap id='条目.更新书籍下一个章节' />
              </Flex>
            </Flex.Item>
            <View style={_.ml.md}>
              <Button
                style={styles.btn}
                type='ghostPrimary'
                onPress={$.doUpdateBookEp}
              >
                更新
              </Button>
              <Heatmap id='条目.更新书籍章节' />
            </View>
          </>
        )}
      </Flex>
    </View>
  )
}

BookEp.contextTypes = {
  $: PropTypes.object,
  navigation: PropTypes.object
}

export default observer(BookEp)

const memoStyles = _.memoStyles(_ => ({
  container: {
    height: 120
  },
  label: {
    width: 40
  },
  input: {
    width: 120,
    height: 34
  },
  btn: {
    width: 80,
    height: 34
  },
  btnPlus: {
    width: 40,
    height: 34
  },
  iconPlay: {
    padding: _.sm,
    marginRight: -_.sm
  },
  total: {
    position: 'absolute',
    zIndex: 100,
    top: 8,
    right: 12
  }
}))
