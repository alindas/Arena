import React, { useState } from 'react'
import axios from 'axios'
import './index.css'
import { encrypt } from './md5'

export default function Pawd() {
  const [info, setInfo] = useState('123')
  const [share, setShare] = useState('')

  function onShare() {
    if (info !== '') {
      // 交由后端进行加密
      axios.get('http://localhost:8848/test/send')
      .then(res => {
        if (/^2/.test(res?.status+'')) {
          const {key, value} = res?.data;
          const encryVal = encrypt(info, value)
          setShare(location.origin + '/#/password?token=' + key + '#' + encryVal);
        } else {
          throw new Error(res?.data);
        }
      })
      .catch(err => console.error(err))
    }
  }

  function onSelect() {
    document.querySelector('input')!.select();
  }

  return (
    <div>
      {
        share === '' ?
        <div>
          <h3>输入需要传输的信息</h3>
          <textarea className="password-area" value={info} onChange={e => setInfo(e.target.value)}></textarea>
          <button className="share-btn" onClick={onShare}>分享</button>
        </div> :
        <div>
        <h3>分享链接</h3>
        <input className="share-area" value={share} readOnly />
        <button className="copy-btn" onClick={onSelect}>复制</button>
      </div>
      }
    </div>
  )
}
