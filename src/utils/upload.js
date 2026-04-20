/**
 * CloudBase Storage 图片上传工具
 */
import app, { login } from '../cloudbase'

/**
 * 上传图片到 CloudBase Storage
 * @param {File} file - 浏览器 File 对象
 * @returns {Promise<string>} fileID (cloud://xxx)
 */
export async function uploadImage(file) {
  await login()
  const ext = file.name.split('.').pop()
  const cloudPath = `covers/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
  const res = await app.uploadFile({ cloudPath, filePath: file })
  return res.fileID
}

/**
 * 获取单个文件的临时访问 URL
 */
export async function getFileUrl(fileID) {
  if (!fileID) return ''
  if (fileID.startsWith('http')) return fileID
  await login()
  const res = await app.getTempFileURL({ fileList: [fileID] })
  return res.fileList?.[0]?.tempFileURL || ''
}

/**
 * 批量获取文件临时访问 URL
 * @returns {Promise<Record<string, string>>} { fileID: url }
 */
export async function batchGetFileUrls(fileIDs) {
  if (!fileIDs?.length) return {}
  await login()
  const res = await app.getTempFileURL({ fileList: fileIDs })
  const map = {}
  res.fileList?.forEach(f => { map[f.fileID] = f.tempFileURL || '' })
  return map
}

/**
 * 给课程列表批量加载封面 URL，写入 _coverUrl 字段
 */
export async function loadCoverUrls(items) {
  const fileIDs = items
    .filter(c => c.coverImage && c.coverImage.startsWith('cloud://'))
    .map(c => c.coverImage)
  if (fileIDs.length === 0) return items
  const urls = await batchGetFileUrls(fileIDs)
  return items.map(c => ({
    ...c,
    _coverUrl: c.coverImage ? (urls[c.coverImage] || '') : ''
  }))
}
