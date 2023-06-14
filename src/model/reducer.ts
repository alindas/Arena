//在这个文件里你可以声明状态来为将来需要接收的状态做准备（状态在此文件中汇总）
import stu from './slice/stu' //引入之前写好的slice（读取状态）
import { combineReducers } from '@reduxjs/toolkit'


const reducers = {
//声明状态在此处
  stu
}

const rootReducer = combineReducers(reducers)

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
