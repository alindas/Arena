import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './index.css'
import { decrypt, encrypt } from './md5'
import { useQuery } from './useQuery'

export default function Pawd() {
  const token = useQuery().token;
  const [info, setInfo] = useState('123')
  const [share, setShare] = useState('')
  const [look, setLook] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 是否为校验状态
    if (typeof token !== 'undefined' && token !== '') {
      setLook('');
      setLoading(false);


    } else {
      setLoading(false);
    }
  }, [])

  function onShare() {
    if (info !== '') {
      // 交由后端进行加密
      axios.get('http://localhost:8848/test/send')
      .then(res => {
        if (/^2/.test(res?.status+'')) {
          const {key, value} = res?.data;
          const encryVal = encodeURIComponent(encrypt(info, value));
          setShare(location.origin + '/#/password?token=' + key + '==' + encryVal);
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

  function onLook() {
    const origin = token.split('==');
    axios.get('http://localhost:8848/test/validate?token='+origin[0])
    .then(res => {
      // console.log(res)
      // let message = decrypt(decodeURIComponent(origin[1]??''), res?.data.value)
      // console.log(message)
      setLook(decrypt(origin[1]??'', res?.data.value));
    })
    .catch(() => {
      setLook('已过期或失效');
    })
  }

  return loading ? <div>加载中..</div> : typeof look !== 'undefined' ? (
    <div>
      <h3>以下信息不会被泄露</h3>
      <div className="share-content">{look}</div>
      <button className="copy-btn" onClick={onLook}>查看</button>
    </div>
    ) : (
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
