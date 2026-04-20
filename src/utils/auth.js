/**
 * 管理员认证工具（开发阶段：明文密码 + localStorage 会话）
 */
import { db, login } from '../cloudbase'

const AUTH_KEY = 'tkbs_admin_auth'

/** 读取当前登录的管理员信息 */
export function getAdminAuth() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY))
  } catch { return null }
}

/** 清除登录状态 */
export function clearAdminAuth() {
  localStorage.removeItem(AUTH_KEY)
}

/** 管理员登录：校验用户名密码，成功后写入 localStorage */
export async function adminLogin(username, password) {
  await login()

  // 检查 admins 集合是否有数据，集合不存在时 count 会报错，视为空
  let needCreate = false
  try {
    const countRes = await db.collection('admins').count()
    if (countRes.code || (countRes.total ?? 0) === 0) {
      needCreate = true
    }
  } catch {
    needCreate = true
  }

  // 集合为空或不存在 → 先用 add 创建集合 + 默认管理员
  if (needCreate) {
    console.log('[auth] admins 集合为空/不存在，创建默认管理员…')
    const now = new Date().toISOString()
    try {
      await db.collection('admins').add({
        username: 'admin',
        password: 'admin123',
        displayName: '超级管理员',
        role: 'superadmin',
        enabled: true,
        createdAt: now,
        updatedAt: now,
      })
      console.log('[auth] ✅ 默认管理员已创建')
    } catch (e) {
      console.error('[auth] 创建管理员失败:', e)
      throw new Error('admins 集合不存在且无法自动创建，请在 CloudBase 控制台手动创建 admins 集合后重试')
    }
  }

  // 查询管理员
  const allRes = await db.collection('admins').limit(50).get()
  if (allRes.code) {
    throw new Error(`数据库访问失败: ${allRes.code} - ${allRes.message}`)
  }

  const allData = allRes.data || []
  const record = allData.find(r => r.username === username)

  if (!record) {
    throw new Error('用户名不存在')
  }
  if (record.password !== password) {
    throw new Error('密码错误')
  }
  if (record.enabled === false) {
    throw new Error('该账号已被禁用')
  }

  const authData = {
    _id: record._id,
    username: record.username,
    displayName: record.displayName || record.username,
    role: record.role,
  }
  localStorage.setItem(AUTH_KEY, JSON.stringify(authData))
  return authData
}
