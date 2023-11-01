// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** aiRecommend POST /api/xf/ai_intelligent */
export async function aiRecommendUsingPOST(
  body: API.AiIntelligentChatRequest,
  options?: { [key: string]: any },
) {
  return request<API.RString_>('/api/xf/ai_intelligent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除对话 POST /api/xf/delete */
export async function deleteAiIntelligentUsingPOST(
  body: API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/xf/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取我的对话 POST /api/xf/my/list/page */
export async function listMyAiInformationByPageUsingPOST(
  body: API.AiIntelligentQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageAiIntelligent_>('/api/xf/my/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
