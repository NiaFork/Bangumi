/*
 * @Author: czy0729
 * @Date: 2020-05-02 16:30:02
 * @Last Modified by: czy0729
 * @Last Modified time: 2020-11-07 14:24:11
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Text, Touchable } from '@components'
import { Cover } from '@screens/_'
import { _ } from '@stores'
import { observer } from '@utils/decorators'
import { t } from '@utils/fetch'

const imgHeight = 48

function Item({ id, cover, name, num }, { navigation }) {
  const styles = memoStyles()
  return (
    <Touchable
      style={styles.container}
      onPress={() => {
        t('我的小组.跳转', {
          groupId: id
        })

        navigation.push('Group', {
          groupId: id
        })
      }}
    >
      <Flex align='start'>
        <Cover size={imgHeight} src={cover} border radius shadow />
        <Flex.Item style={_.ml.sm}>
          <Flex
            style={styles.body}
            direction='column'
            align='start'
            justify='center'
          >
            <Text size={12} numberOfLines={2} bold>
              {name}
            </Text>
            <Text style={_.mt.xs} type='sub' size={10}>
              <Text type='sub' size={10} bold>
                {num}
              </Text>{' '}
              位成员
            </Text>
          </Flex>
        </Flex.Item>
      </Flex>
    </Touchable>
  )
}

Item.contextTypes = {
  navigation: PropTypes.object
}

export default observer(Item)

const memoStyles = _.memoStyles(_ => ({
  container: {
    width: '48%',
    paddingVertical: _.sm,
    marginRight: '2%'
  },
  body: {
    height: imgHeight
  }
}))
