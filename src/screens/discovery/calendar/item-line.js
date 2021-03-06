/*
 * @Author: czy0729
 * @Date: 2020-04-10 16:13:18
 * @Last Modified by: czy0729
 * @Last Modified time: 2020-12-18 00:23:44
 */
import React from 'react'
import { StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { Touchable, Flex, Katakana, Text } from '@components'
import { Cover, Tag } from '@screens/_'
import { _, systemStore } from '@stores'
import { toFixed } from '@utils'
import { HTMLDecode } from '@utils/html'
import { t } from '@utils/fetch'

const imageWidth = 72
const imageHeight = imageWidth * 1.28

function ItemLine(
  { subjectId, images = {}, name, air, timeCN, score },
  { $, navigation }
) {
  const showScore = !systemStore.setting.hideScore && !!score
  const collection = $.userCollectionsMap[subjectId]
  const indent = collection ? '　 　 ' : ''
  return (
    <Touchable
      style={styles.item}
      onPress={() => {
        t('每日放送.跳转', {
          to: 'Subject',
          subjectId
        })

        navigation.push('Subject', {
          subjectId,
          _cn: name,
          _image: images.medium
        })
      }}
    >
      <Flex align='start'>
        <View style={styles.time}>
          {!!timeCN && (
            <Text align='center'>
              {`${timeCN.slice(0, 2)}:${timeCN.slice(2)}`}
            </Text>
          )}
        </View>
        <View style={styles.image}>
          <Cover
            width={imageWidth}
            height={imageHeight}
            src={images.medium}
            radius
            shadow
          />
        </View>
        <Flex.Item style={_.ml.md}>
          <Flex
            style={styles.body}
            direction='column'
            justify='between'
            align='start'
          >
            {!!collection && (
              <Tag style={styles.collection} value={collection} />
            )}
            <Katakana.Provider
              itemStyle={styles.katakanas}
              size={13}
              numberOfLines={2}
            >
              <Katakana type='desc' size={13} numberOfLines={2} bold>
                {indent}
                {HTMLDecode(name)}
              </Katakana>
            </Katakana.Provider>
            <Flex>
              {!!air && (
                <Text style={_.mr.sm} type='main' size={13} bold>
                  第{air}话
                </Text>
              )}
              {showScore && (
                <Text style={styles.score} type='sub' size={13} bold>
                  {toFixed(score, 1)}{' '}
                </Text>
              )}
            </Flex>
          </Flex>
        </Flex.Item>
      </Flex>
    </Touchable>
  )
}

ItemLine.contextTypes = {
  $: PropTypes.object,
  navigation: PropTypes.object
}

export default observer(ItemLine)

const styles = StyleSheet.create({
  item: {
    width: '100%',
    paddingVertical: 12
  },
  time: {
    width: 72
  },
  image: {
    width: imageWidth
  },
  body: {
    width: '100%',
    height: imageHeight - 6,
    paddingTop: _.xs,
    paddingRight: _.wind
  },
  katakanas: {
    marginTop: -10
  },
  collection: {
    position: 'absolute',
    zIndex: 1,
    top: 2,
    left: 0
  }
})
