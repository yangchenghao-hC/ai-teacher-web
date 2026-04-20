import { useState, useEffect, useCallback } from 'react'
import { adminList, adminCreate, adminUpdate, adminDelete } from '../../utils/admin-api'
import { getAdminAuth } from '../../utils/auth'

const ROLES = [
  { key: 'superadmin', label: '超级管理员' },
  { key: 'admin', label: '管理员' },
  { key: 'editor', label: '编辑' },
]

const EMPTY = { username: '', password: '', displayName: '', role: 'admin', enabled: true }

export default function AccountManage() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)              // null | 'create' | record
  const [form, setForm] = useState({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const me = getAdminAuth()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminList('admins', { limit: 200 })
      setList(data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  function openCreate() { setForm({ ...EMPTY }); setModal('create') }

  function openEdit(r) {
    setForm({
      username: r.username || '',
      password: '',                // 编辑时密码留空表示不修改
      displayName: r.displayName || '',
      role: r.role || 'admin',
      enabled: r.enabled !== false,
    })
    setModal(r)
  }

  async function handleSave() {
    if (!form.username.trim()) return alert('请输入用户名')
    if (modal === 'create' && !form.password) return alert('请输入密码')
    setSaving(true)
    try {
      const data = { ...form }
      if (!data.password) delete data.password   // 编辑时不传空密码
      if (modal === 'create') {
        await adminCreate('admins', data)
      } else {
        await adminUpdate('admins', modal._id, data)
      }
      setModal(null)
      load()
    } catch (e) { alert('保存失败: ' + (e.message || e)) }
    setSaving(false)
  }

  async function handleDelete(r) {
    if (r._id === me?._id) return alert('不能删除当前登录的账号')
    if (!window.confirm(`确认删除账号「${r.username}」？`)) return
    try { await adminDelete('admins', r._id); load() }
    catch (e) { alert('删除失败: ' + (e.message || e)) }
  }

  return (
    <>
      <div className="admin-table-wrap">
        <div className="admin-table-toolbar">
          <div className="toolbar-left">
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>共 {list.length} 个管理员账号</span>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>＋ 新增账号</button>
        </div>

        {loading ? (
          <div className="table-empty">加载中…</div>
        ) : list.length === 0 ? (
          <div className="table-empty">暂无账号</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>用户名</th>
                <th>显示名称</th>
                <th>角色</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {list.map(r => (
                <tr key={r._id}>
                  <td style={{ fontWeight: 600 }}>
                    {r.username}
                    {r._id === me?._id && <span style={{ fontSize: 11, color: 'var(--primary)', marginLeft: 6 }}>(当前)</span>}
                  </td>
                  <td>{r.displayName || '-'}</td>
                  <td>{ROLES.find(ro => ro.key === r.role)?.label || r.role}</td>
                  <td>
                    <span style={{
                      display: 'inline-block', padding: '2px 10px', borderRadius: 8, fontSize: 12,
                      background: r.enabled !== false ? '#f0fdf4' : '#fef2f2',
                      color: r.enabled !== false ? '#16a34a' : '#dc2626'
                    }}>
                      {r.enabled !== false ? '启用' : '禁用'}
                    </span>
                  </td>
                  <td>
                    <div className="cell-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(r)}>编辑</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r)} disabled={r._id === me?._id}>删除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 表单弹窗 */}
      {modal !== null && (
        <div className="modal-mask" onClick={() => setModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ width: 440 }}>
            <div className="modal-header">
              <h2>{modal === 'create' ? '新增账号' : '编辑账号'}</h2>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">用户名 *</label>
                <input className="form-input" value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  disabled={modal !== 'create'} />
              </div>
              <div className="form-group">
                <label className="form-label">{modal === 'create' ? '密码 *' : '密码（留空不修改）'}</label>
                <input className="form-input" type="password" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder={modal === 'create' ? '' : '留空则不修改'} />
              </div>
              <div className="form-group">
                <label className="form-label">显示名称</label>
                <input className="form-input" value={form.displayName}
                  onChange={e => setForm({ ...form, displayName: e.target.value })}
                  placeholder="如：张老师" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">角色</label>
                  <select className="form-select" value={form.role}
                    onChange={e => setForm({ ...form, role: e.target.value })}>
                    {ROLES.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">状态</label>
                  <select className="form-select" value={form.enabled ? 'true' : 'false'}
                    onChange={e => setForm({ ...form, enabled: e.target.value === 'true' })}>
                    <option value="true">启用</option>
                    <option value="false">禁用</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>取消</button>
              <button className="btn btn-primary" disabled={saving} onClick={handleSave}>
                {saving ? '保存中…' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
