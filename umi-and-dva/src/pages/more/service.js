import request from '@/utils/request';

export async function getPersonData(params) {
  return request('/api/getPersonData', {
    data: params,
    method: 'post'
  })
}