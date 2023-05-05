// 获取地址参数
import { useLocation } from 'react-router-dom';
import qs from 'query-string';

export function useQuery<T = any>(): T {
  const { search } = useLocation();
  return (qs.parse(search) as unknown) as T;
}
