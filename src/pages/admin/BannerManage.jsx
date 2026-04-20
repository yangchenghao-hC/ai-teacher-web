import { useState, useEffect, useCallback } from 'react'
import { adminList, adminCreate, adminUpdate, adminDelete, adminBatchDelete } from '../../utils/admin-api'

const EMPTY = { title: '', desc: '', color: '#4F7CFF', sort: 1, enabled: true, link: '' }
const PAGE_SIZE = 10

export default function BannerManage() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [selected, setSelected] = useState(new Set())
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminList('banners', { orderBy: { field: 'sort', order: 'asc' } })
      setList(data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => { setPage(1) }, [search])

  const filtered = list.filter(b =>
    !search || b.title?.includes(search) || b.desc?.includes(search)
  )
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const allChecked = paged.length > 0 && paged.every(r => selected.has(r._id))

  function toggleSelect(id) {
    setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  function toggleSelectAll() {
    const ids = paged.map(r => r._id)
    setSelected(s => {
      const allOn = ids.length > 0 && ids.every(id => s.has(id))
      const n = new Set(s)
      ids.forEach(id => allOn ? n.delete(id) : n.add(id))
      return n
    })
  }

  function openCreate() { setForm({ ...EMPTY }); setModal('create') }
  function openEdit(record) {
    setForm({
      title: record.title || '', desc: record.desc || '',
      color: record.color || '#4F7CFF', sort: record.sort ?? 1,
      enabled: record.enabled !== false, link: record.link || ''
    })
    setModal(record)
  }

  async function handleSave() {
    if (!form.title.trim()) return alert('请输入标题')
    setSaving(true)
    try {
      if (modal === 'create') { await adminCreate('banners', form) }
      else { await adminUpdate('banners', modal._id, form) }
      setModal(null); load()
    } catch (e) { alert('保存失败: ' + (e.message || e)) }
    setSaving(false)
  }

  async function handleDelete(record) {
    if (!window.confirm(`确认删除「${record.title}」？`)) return
    try { await adminDelete('banners', record._id); load() }
    catch (e) { alert('删除失败: ' + (e.message || e)) }
  }

  async function handleBatchDelete() {
    if (selected.size === 0) return
    if (!window.confirm(`确认删除选中的 ${selected.size} 项？`)) return
    try { await adminBatchDelete('banners', [...selected]); setSelected(new Set()); load() }
    catch (e) { alert('批量删除失败: ' + (e.message || e)) }
  }

  async function toggleEnabled(record) {
    try { await adminUpdate('banners', record._id, { enabled: !record.enabled }); load() }
    catch (e) { console.error(e) }
  }

  return (
    <>
      <div className="admin-table-wrap">
        <div className="admin-table-toolbar">
          <div className="toolbar-left">
            <div className="admin-search">
              <span>🔍</span>
              <input placeholder="搜索 Banner…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {selected.size > 0 && (
              <button className="btn btn-danger btn-sm" onClick={handleBatchDelete}>
                🗑 批量删除（{selected.size}）
              </button>
            )}
          </div>
          <button className="btn btn-primary" onClick={openCreate}>＋ 新增 Banner</button>
        </div>

        {loading ? (
          <div className="table-empty">加载中…</div>
        ) : filtered.length === 0 ? (
          <div className="table-empty">暂无数据</div>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}><input type="checkbox" checked={allChecked} onChange={toggleSelectAll} /></th>
                  <th style={{ width: 50 }}>#</th>
                  <th>颜色</th><th>标题</th><th>描述</th><th>链接</th><th>排序</th><th>状态</th><th>操作</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((b, idx) => (
                  <tr key={b._id} className={selected.has(b._id) ? 'row-selected' : ''}>
                    <td><input type="checkbox" checked={selected.has(b._id)} onChange={() => toggleSelect(b._id)} /></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                    <td><span className="cell-color" style={{ background: b.color }} /></td>
                    <td style={{ fontWeight: 600 }}>{b.title}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{b.desc}</td>
                    <td style={{ maxWidth: 180, wordBreak: 'break-all', color: '#4F7CFF' }}>
                      {b.link ? <a href={b.link} target="_blank" rel="noopener noreferrer">{b.link}</a> : <span style={{ color: '#bbb' }}>—</span>}
                    </td>
                    <td>{b.sort}</td>
                    <td>
                      <span className={`cell-status ${b.enabled !== false ? 'on' : 'off'}`}
                        style={{ cursor: 'pointer' }} onClick={() => toggleEnabled(b)}>
                        {b.enabled !== false ? '启用' : '停用'}
                      </span>
                    </td>
                    <td>
                      <div className="cell-actions">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(b)}>编辑</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b)}>删除</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="pagination-bar">
                <span className="pagination-info">共 {filtered.length} 条，第 {page}/{totalPages} 页</span>
                <div className="pagination-btns">
                  <button className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>‹ 上一页</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                    .reduce((acc, p, i, arr) => { if (i > 0 && p - arr[i - 1] > 1) acc.push('...'); acc.push(p); return acc }, [])
                    .map((p, i) => p === '...'
                      ? <span key={'e' + i} className="pagination-ellipsis">…</span>
                      : <button key={p} className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPage(p)}>{p}</button>
                    )}
                  <button className="btn btn-ghost btn-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>下一页 ›</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {modal !== null && (
        <div className="modal-mask" onClick={() => setModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modal === 'create' ? '新增 Banner' : '编辑 Banner'}</h2>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">标题 *</label>
                <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">描述</label>
                <input className="form-input" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">链接（可选）</label>
                  <input className="form-input" placeholder="https://..." value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">颜色</label>
                  <div className="form-color-wrap">
                    <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} />
                    <input className="form-input" style={{ width: 100 }} value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">排序（越小越靠前）</label>
                  <input className="form-input" type="number" min="0" value={form.sort} onChange={e => setForm({ ...form, sort: Number(e.target.value) })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">启用状态</label>
                <div className="form-switch">
                  <input type="checkbox" checked={form.enabled} onChange={e => setForm({ ...form, enabled: e.target.checked })} />
                  <span style={{ fontSize: 13 }}>{form.enabled ? '启用' : '停用'}</span>
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