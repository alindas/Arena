//为了可以后期去更好的维护自己的代码，这边建议可以吧异步的操作放到action中专门来处理
import { applyMiddleware, createAsyncThunk } from '@reduxjs/toolkit'

export const myApi = createAsyncThunk('student', async (): Promise<number> => {
  const res = await fetch('http://localhost').then(() => 200).catch(() => 404)
  return res
})
