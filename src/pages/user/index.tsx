import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtForm, AtInput, AtMessage } from 'taro-ui'

export default function User() {
  const [name, setName] = useState('')

  function onSubmit() {
    Taro.atMessage({
      'message': 'submit',
      'type': 'success',
    })
  }

  function onReset() {
    Taro.atMessage({
      'message': 'reset',
      'type': 'info',
    })
  }

  return (
    <View >
      <AtMessage />
      <AtForm
        onSubmit={onSubmit}
        onReset={onReset}
      >
        <AtInput
          name='value'
          title='文本'
          type='text'
          placeholder='单行文本'
          value={name}
          onChange={v => setName(v+'')}
        />
        <AtButton formType='submit' type='primary'>提交</AtButton>
        <AtButton formType='reset'>重置</AtButton>
      </AtForm>
    </View>
  )
}
