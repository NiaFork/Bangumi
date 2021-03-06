/*
 * @Author: czy0729
 * @Date: 2019-03-23 09:16:00
 * @Last Modified by: czy0729
 * @Last Modified time: 2020-12-15 14:22:32
 */
import React from 'react'
import { Alert, View } from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { Flex, Button, Icon, Text, Touchable, Heatmap } from '@components'
import { SectionTitle, IconTouchable } from '@screens/_'
import { _ } from '@stores'
import { getType, getRating } from '@utils/app'
import { info } from '@utils/ui'

function Box({ style }, { $, navigation }) {
  const styles = memoStyles()

  // 自己的收藏状态
  const { status = { name: '未收藏' }, rating = 0 } = $.collection
  const { formhash } = $.subjectFormHTML
  const showErase = status.name !== '未收藏' && !!formhash
  const leftStyle = []
  const rightStyle = []
  if (rating) {
    leftStyle.push(styles.left)
    rightStyle.push(styles.right)
  }
  const btnText = $.isLogin ? status.name : '登陆管理'
  const onPress = $.isLogin
    ? $.showManageModel
    : () => navigation.push('LoginV2')

  const statusSize = $.status[$.status.length - 1]?.text.length >= 6 ? 11 : 12
  return (
    <View style={[_.container.wind, styles.container, style]}>
      <SectionTitle
        style={styles.sectionTitle}
        right={
          <IconTouchable
            style={styles.iconErase}
            name='close'
            size={16}
            color={_.colorIcon}
            onPress={() => {
              if (!showErase) {
                info('无法操作, 请检查登陆状态')
                return
              }

              Alert.alert('警告', '确定删除收藏?', [
                {
                  text: '取消',
                  style: 'cancel'
                },
                {
                  text: '确定',
                  onPress: () => $.doEraseCollection()
                }
              ])
            }}
          >
            <Heatmap id='条目.删除收藏' />
          </IconTouchable>
        }
      >
        收藏
      </SectionTitle>
      <Touchable style={styles.btn} onPress={onPress}>
        <Flex justify='center'>
          <Flex.Item>
            <Button style={leftStyle} type={getType(btnText)}>
              {btnText}
            </Button>
          </Flex.Item>
          {!!rating && (
            <Flex.Item>
              <Button style={rightStyle} type={getType(btnText)}>
                {getRating(rating)}{' '}
                {[1, 2, 3, 4, 5].map(item => {
                  let type
                  if (rating / 2 >= item) {
                    type = 'ios-star'
                  } else if (rating / 2 >= item - 0.5) {
                    type = 'ios-star-half'
                  } else {
                    type = 'ios-star-outline'
                  }
                  return (
                    <Icon
                      key={item}
                      name={type}
                      size={16}
                      color={_.__colorPlain__}
                    />
                  )
                })}
              </Button>
            </Flex.Item>
          )}
        </Flex>
        <Heatmap id='条目.管理收藏' />
        <Heatmap right={56} transparent id='条目.显示收藏管理' />
      </Touchable>
      <View style={_.mt.md}>
        <Text size={statusSize} type='sub'>
          {$.status.map((item, index) => (
            <Text
              key={item.status}
              size={statusSize}
              type='sub'
              onPress={() => $.toRating(navigation, '收藏', item.status)}
            >
              {!!index && ' / '}
              {item.text}
            </Text>
          ))}
        </Text>
        <Heatmap
          id='条目.跳转'
          data={{
            from: '收藏'
          }}
        />
      </View>
    </View>
  )
}

Box.contextTypes = {
  $: PropTypes.object,
  navigation: PropTypes.object
}

export default observer(Box)

const memoStyles = _.memoStyles(_ => ({
  container: {
    minHeight: 120
  },
  sectionTitle: {
    height: 28
  },
  iconErase: {
    marginRight: -_.sm
  },
  btn: {
    marginTop: _.md,
    backgroundColor: _.colorPlain,
    borderRadius: _.radiusSm,
    ..._.shadow
  },
  left: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  },
  right: {
    borderLeftWidth: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0
  }
}))
