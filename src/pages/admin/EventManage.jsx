import { useState, useEffect, useCallback } from 'react'
import { adminList, adminCreate, adminUpdate, adminDelete, adminBatchDelete } from '../../utils/admin-api'

const CATEGORIES = ['讲座', '比赛', '志愿者', '社团招新']
const EMPTY = {
  title: '', category: '讲座', time: '', location: '', organizer: '',
  quota: 100, enrolled: 0, color: '#4F7CFF', summary: '', content: '', deadline: '',
}
const PAGE_SIZE = 10

export default function EventManage() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [selected, setSelected] = useState(new Set())
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminList('events', { orderBy: { field: 'createdAt', order: 'desc' } })
      setList(data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => { setPage(1) }, [search, filterCat])

  const filtered = list.filter(ev => {
    if (filterCat && ev.category !== filterCat) return false
    if (search && !ev.title?.includes(search)) return false
    return true
  })
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
      const n = new Set(s); ids.forEach(id => allOn ? n.delete(id) : n.add(id)); return n
    })
  }

  function openCreate() { setForm({ ...EMPTY }); setModal('create') }
  function openEdit(record) {
    setForm({
      title: record.title || '', category: record.category || '讲座',
      time: record.time || '', location: record.location || '',
      organizer: record.organizer || '', quota: record.quota ?? 100,
      enrolled: record.enrolled ?? 0, color: record.color || '#4F7CFF',
      summary: record.summary || '', content: record.content || '',
      deadline: record.deadline || '',
    })
    setModal(record)
  }

  async function handleSave() {
    if (!form.title.trim()) return alert('请输入活动标题')
    setSaving(true)
    try {
      if (modal === 'create') { await adminCreate('events', form) }
      else { await adminUpdate('events', modal._id, form) }
      setModal(null); load()
    } catch (e) { alert('保存失败: ' + (e.message || e)) }
    setSaving(false)
  }

  async function handleDelete(record) {
    if (!window.confirm(`确认删除「${record.title}」？`)) return
    try { await adminDelete('events', record._id); load() }
    catch (e) { alert('删除失败: ' + (e.message || e)) }
  }

  async function handleBatchDelete() {
    if (selected.size === 0) return
    if (!window.confirm(`确认删除选中的 ${selected.size} 项？`)) return
    try { await adminBatchDelete('events', [...selected]); setSelected(new Set()); load() }
    catch (e) { alert('批量删除失败: ' + (e.message || e)) }
  }

  return (
    <>
      <div className="admin-table-wrap">
        <div className="admin-table-toolbar">
          <div className="toolbar-left">
            <div className="admin-search">
              <span>🔍</span>
              <input placeholder="搜索活动…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="form-select" style={{ width: 120, height: 34, fontSize: 13 }}
              value={filterCat} onChange={e => setFilterCat(e.target.value)}>
              <option value="">全部类型</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {selected.size > 0 && (
              <button className="btn btn-danger btn-sm" onClick={handleBatchDelete}>
                🗑 批量删除（{selected.size}）
              </button>
            )}
          </div>
          <button className="btn btn-primary" onClick={openCreate}>＋ 新增活动</button>
        </div>

        {loading ? (
          <div className="table-empty">加载中…</div>
        ) : filtered.length === 0 ? (
          <div className="table-empty">暂无活动数据</div>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}><input type="checkbox" checked={allChecked} onChange={toggleSelectAll} /></th>
                  <th style={{ width: 50 }}>#</th>
                  <th>颜色</th><th>活动标题</th><th>类型</th><th>时间</th><th>报名进度</th><th>截止</th><th>操作</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((ev, idx) => {
                  const pct = ev.quota > 0 ? Math.round((ev.enrolled / ev.quota) * 100) : 0
                  return (
                    <tr key={ev._id} className={selected.has(ev._id) ? 'row-selected' : ''}>
                      <td><input type="checkbox" checked={selected.has(ev._id)} onChange={() => toggleSelect(ev._id)} /></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                      <td><span className="cell-color" style={{ background: ev.color }} /></td>
                      <td style={{ fontWeight: 600 }}>{ev.title}</td>
                      <td><span className="cell-tag">{ev.category}</span></td>
                      <td style={{ fontSize: 12 }}>{ev.time}</td>
                      <td>
                        <div className="cell-progress">
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${Math.min(pct, 100)}%` }} />
                          </div>
                          <span className="progress-text">{ev.enrolled}/{ev.quota}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ev.deadline}</td>
                      <td>
                        <div className="cell-actions">
                          <button className="btn btn-ghost btn-sm" onClick={() => openEdit(ev)}>编辑</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(ev)}>删除</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
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
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ width: 580 }}>
            <div className="modal-header">
              <h2>{modal === 'create' ? '新增活动' : '编辑活动'}</h2>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">活动标题 *</label>
                <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">活动类型</label>
                  <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">颜色</label>
                  <div className="form-color-wrap">
                    <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} />
                    <input className="form-input" style={{ width: 100 }} value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">时间</label>
                  <input className="form-input" placeholder="如：4月20日 14:30" value={form.time}
                    onChange={e => setForm({ ...form, time: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">报名截止</label>
                  <input className="form-input" placeholder="如：4月19日 18:00" value={form.deadline}
                    onChange={e => setForm({ ...form, deadline: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">地点</label>
                  <input className="form-input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">主办方</label>
                  <input className="form-input" value={form.organizer} onChange={e => setForm({ ...form, organizer: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">名额上限</label>
                  <input className="form-input" type="number" min="0" value={form.quota}
                    onChange={e => setForm({ ...form, quota: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label className="form-label">已报名人数</label>
                  <input className="form-input" type="number" min="0" value={form.enrolled}
                    onChange={e => setForm({ ...form, enrolled: Number(e.target.value) })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">简介</label>
                <input className="form-input" value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">详细内容</label>
                <textarea className="form-textarea" rows={4} value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })} />
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