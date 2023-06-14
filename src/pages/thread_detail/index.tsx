import Taro from '@tarojs/taro'
import React, { useState } from 'react'
import { View, RichText, Image } from '@tarojs/components'
import { Thread } from '../../components/thread'
import { GlobalState } from '../../utils'

import './index.css'

function prettyHTML (str) {
  const lines = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']

  lines.forEach(line => {
    const regex = new RegExp(`<${line}`, 'gi')

    str = str.replace(regex, `<${line} class="line"`)
  })

  return str.replace(/<img/gi, '<img class="img"')
}

function ThreadDetail() {
  const [loading, setLoading] = useState(true)
  const [replies, setReplies] = useState([])
  const [content, setContent] = useState('')
  const [thread, setThread] = useState(GlobalState.thread)


  const replieEl = replies.map((reply, index) => {
    return (
      <View className='reply' key={reply.id}>
        <Image src={reply.member.avatar_large} className='avatar' />
        <View className='main'>
          <View className='author'>
            {reply.member.username}
          </View>
          <View className='time'>
            {time}
          </View>
          <RichText nodes={reply.content} className='content' />
          <View className='floor'>
            {index + 1} 楼
          </View>
        </View>
      </View>
    )
  })

  const contentEl = loading
    ? '加载中'
    : (
      <View>
        <View className='main-content'>
        <RichText nodes={content} />
        </View>
        <View className='replies'>
          {replieEl}
        </View>
      </View>
    )

  return (
    <View className='detail'>
      <Thread
        node={thread.node}
        title={thread.title}
        last_modified={thread.last_modified}
        replies={thread.replies}
        tid={thread.id}
        member={thread.member}
        not_navi={true}
      />
      {contentEl}
    </View>
  )
}

export default ThreadDetail
