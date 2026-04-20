/**
 * Admin API 工具 — Web 端管理后台数据操作
 * 注意：CloudBase JS-SDK v4 的写操作出错时不会 throw，
 * 而是 resolve 一个 { code, message } 对象，必须手动检查。
 */
import { db, login } from '../cloudbase'

const _ = db.command

/** 检查 SDK 响应，如果有 code 就抛异常 */
function checkRes(res, action) {
  if (res && res.code) {
    throw new Error(`[${action}] ${res.code}: ${res.message || '未知错误'}`)
  }
  return res
}

/**
 * 查询列表
 */
export async function adminList(collection, { where, orderBy, limit = 100 } = {}) {
  await login()
  let q = db.collection(collection)
  if (where) q = q.where(where)
  if (orderBy) q = q.orderBy(orderBy.field, orderBy.order || 'desc')
  q = q.limit(limit)
  const res = await q.get()
  checkRes(res, 'list')
  return res.data || []
}

/**
 * 查询单条
 */
export async function adminGet(collection, docId) {
  await login()
  const res = await db.collection(collection).doc(docId).get()
  checkRes(res, 'get')
  return res.data
}

/**
 * 新增
 */
export async function adminCreate(collection, data) {
  await login()
  const now = new Date().toISOString()
  const res = await db.collection(collection).add({
    ...data,
    createdAt: now,
    updatedAt: now,
  })
  checkRes(res, 'create')
  return { ok: true, _id: res.id }
}

/**
 * 更新
 */
export async function adminUpdate(collection, docId, data) {
  await login()
  const now = new Date().toISOString()
  const updateData = { ...data, updatedAt: now }
  delete updateData._id
  const res = await db.collection(collection).doc(docId).update(updateData)
  checkRes(res, 'update')
  return { ok: true }
}

/**
 * 删除
 */
export async function adminDelete(collection, docId) {
  await login()
  const res = await db.collection(collection).doc(docId).remove()
  checkRes(res, 'delete')
  return { ok: true }
}

/**
 * 批量删除
 */
export async function adminBatchDelete(collection, docIds) {
  await login()
  let success = 0
  for (const id of docIds) {
    const res = await db.collection(collection).doc(id).remove()
    checkRes(res, 'batchDelete')
    success++
  }
  return { ok: true, deleted: success }
}

/**
 * 获取集合记录数
 */
export async function adminCount(collection) {
  await login()
  const res = await db.collection(collection).count()
  checkRes(res, 'count')
  return res.total || 0
}

/* ===== 课程目录常量 ===== */
export const COURSE_CATALOG = [
  {
    key: 'resource',
    name: '师范生教育资源库',
    icon: '📚',
    type: 'hierarchical',
    levels: ['学段', '学科', '年级/册次'],
  },
  {
    key: 'skill',
    name: '师范生教学技能专区',
    icon: '🎓',
    type: 'flat',
    subcategories: ['优秀教案范例库', '名师课堂实录', '说课稿模板库'],
  },
  {
    key: 'exam',
    name: '考试与备考专区',
    icon: '📝',
    type: 'flat',
    subcategories: ['教师资格证', '教师招聘考试'],
  },
]

export const STAGES = ['学前', '小学', '初中', '高中', '中职', '高职', '大学']
export const SUBJECTS = ['语文', '数学', '英语', '物理', '化学', '生物', '政治', '历史', '地理', '信息技术', '音乐', '美术', '体育', '科学', '道德与法治', '综合实践', '教育学', '心理学']
