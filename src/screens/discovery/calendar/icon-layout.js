/*
 * @Author: czy0729
 * @Date: 2020-04-10 18:18:26
 * @Last Modified by: czy0729
 * @Last Modified time: 2020-12-18 00:19:43
 */
import React from 'react'
import { Heatmap } from '@components'
import { IconTouchable } from '@screens/_'
import { _ } from '@stores'
import { observer } from '@utils/decorators'

function IconLayout({ $ }) {
  return (
    <IconTouchable
      name={$.isList ? 'order' : 'list'}
      size={$.isList ? 18 : 20}
      color={_.colorTitle}
      onPress={$.switchLayout}
    >
      <Heatmap right={30} id='每日放送.切换布局' />
    </IconTouchable>
  )
}

export default observer(IconLayout)
