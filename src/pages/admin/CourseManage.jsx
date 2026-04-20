import { useState, useEffect, useCallback } from 'react'
import { adminList, adminCreate, adminUpdate, adminDelete, adminBatchDelete, COURSE_CATALOG, STAGES, SUBJECTS } from '../../utils/admin-api'
import { uploadImage, batchGetFileUrls } from '../../utils/upload'

const EMPTY = {
  title: '', catalog: 'resource', category: '', subject: '', grade: '',
  coverColor: '#4F7CFF', coverImage: '', tags: [], rating: 4.5, learnerCount: 0,
  description: '', instructor: '',
  chapters: [],
}
const PAGE_SIZE = 10

export default function CourseManage() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCatalog, setFilterCatalog] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [coverPreview, setCoverPreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [selected, setSelected] = useState(new Set())
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminList('courses', { limit: 200 })
      const fileIDs = data.filter(c => c.coverImage && c.coverImage.startsWith('cloud://')).map(c => c.coverImage)
      if (fileIDs.length > 0) {
        const urls = await batchGetFileUrls(fileIDs)
        data.forEach(c => { if (c.coverImage && urls[c.coverImage]) c._coverUrl = urls[c.coverImage] })
      }
      setList(data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => { setPage(1) }, [search, filterCatalog])

  const filtered = list.filter(c => {
    if (filterCatalog && c.catalog !== filterCatalog) return false
    if (search && !c.title?.includes(search)) return false
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

  const getCatalogConf = (key) => COURSE_CATALOG.find(c => c.key === key)

  function getCategoryOptions(catalogKey) {
    const conf = getCatalogConf(catalogKey)
    if (!conf) return []
    if (conf.type === 'hierarchical') return STAGES
    return conf.subcategories || []
  }

  function getCatalogLabel(c) {
    const conf = getCatalogConf(c.catalog)
    if (!conf) return c.catalog || '-'
    let path = conf.name
    if (c.category) path += ' > ' + c.category
    if (c.subject) path += ' > ' + c.subject
    if (c.grade) path += ' > ' + c.grade
    return path
  }

  function openCreate() {
    setForm({ ...EMPTY }); setTagInput(''); setCoverPreview(''); setModal('create')
  }

  function openEdit(record) {
    setForm({
      title: record.title || '', catalog: record.catalog || 'resource',
      category: record.category || '', subject: record.subject || '',
      grade: record.grade || '', coverColor: record.coverColor || '#4F7CFF',
      coverImage: record.coverImage || '', tags: record.tags || [],
      rating: record.rating || 4.5, learnerCount: record.learnerCount || 0,
      description: record.description || '', instructor: record.instructor || '',
      chapters: (record.chapters || []).map(ch => ({
        title: ch.title || '',
        lessons: (ch.lessons || []).map(ls => ({
          title: ls.title || '', videoUrl: ls.videoUrl || '', duration: ls.duration || 0
        }))
      })),
    })
    setTagInput(''); setCoverPreview(record._coverUrl || ''); setModal(record)
  }

  function handleCatalogChange(val) {
    setForm(f => ({ ...f, catalog: val, category: '', subject: '', grade: '' }))
  }

  function addTag() {
    const t = tagInput.trim()
    if (t && !form.tags.includes(t)) setForm(f => ({ ...f, tags: [...f.tags, t] }))
    setTagInput('')
  }
  function removeTag(t) { setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) })) }

  async function handleSave() {
    if (!form.title.trim()) return alert('请输入课程标题')
    if (!form.catalog) return alert('请选择课程目录')
    setSaving(true)
    try {
      const data = { ...form }
      data.lessonCount = (data.chapters || []).reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0)
      if (modal === 'create') { await adminCreate('courses', data) }
      else { await adminUpdate('courses', modal._id, data) }
      setModal(null); load()
    } catch (e) { alert('保存失败: ' + (e.message || e)) }
    setSaving(false)
  }

  async function handleDelete(record) {
    if (!window.confirm(`确认删除「${record.title}」？`)) return
    try { await adminDelete('courses', record._id); load() }
    catch (e) { alert('删除失败: ' + (e.message || e)) }
  }

  async function handleBatchDelete() {
    if (selected.size === 0) return
    if (!window.confirm(`确认删除选中的 ${selected.size} 门课程？`)) return
    try { await adminBatchDelete('courses', [...selected]); setSelected(new Set()); load() }
    catch (e) { alert('批量删除失败: ' + (e.message || e)) }
  }

  const curCatalogConf = getCatalogConf(form.catalog)
  const isResource = form.catalog === 'resource'

  function addChapter() {
    setForm(f => ({ ...f, chapters: [...f.chapters, { title: '', lessons: [{ title: '', videoUrl: '', duration: 0 }] }] }))
  }
  function removeChapter(ci) {
    setForm(f => ({ ...f, chapters: f.chapters.filter((_, i) => i !== ci) }))
  }
  function updateChapterTitle(ci, val) {
    setForm(f => { const chs = [...f.chapters]; chs[ci] = { ...chs[ci], title: val }; return { ...f, chapters: chs } })
  }
  function addLesson(ci) {
    setForm(f => { const chs = [...f.chapters]; chs[ci] = { ...chs[ci], lessons: [...chs[ci].lessons, { title: '', videoUrl: '', duration: 0 }] }; return { ...f, chapters: chs } })
  }
  function removeLesson(ci, li) {
    setForm(f => { const chs = [...f.chapters]; chs[ci] = { ...chs[ci], lessons: chs[ci].lessons.filter((_, i) => i !== li) }; return { ...f, chapters: chs } })
  }
  function updateLesson(ci, li, key, val) {
    setForm(f => { const chs = [...f.chapters]; const ls = [...chs[ci].lessons]; ls[li] = { ...ls[li], [key]: val }; chs[ci] = { ...chs[ci], lessons: ls }; return { ...f, chapters: chs } })
  }
  const totalLessons = form.chapters.reduce((s, ch) => s + (ch.lessons?.length || 0), 0)

  return (
    <>
      <div className="admin-stats">
        {COURSE_CATALOG.map(cat => {
          const count = list.filter(c => c.catalog === cat.key).length
          return (
            <div className="stat-card" key={cat.key} style={{ cursor: 'pointer' }}
              onClick={() => setFilterCatalog(filterCatalog === cat.key ? '' : cat.key)}>
              <div className="stat-icon" style={{
                background: filterCatalog === cat.key ? 'var(--primary)' : 'var(--primary-bg)',
                color: filterCatalog === cat.key ? '#fff' : 'var(--primary)'
              }}>{cat.icon}</div>
              <div>
                <div className="stat-value">{count}</div>
                <div className="stat-label">{cat.name}</div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-toolbar">
          <div className="toolbar-left">
            <div className="admin-search">
              <span>🔍</span>
              <input placeholder="搜索课程…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {filterCatalog && (
              <button className="btn btn-ghost btn-sm" onClick={() => setFilterCatalog('')}>清除筛选 ✕</button>
            )}
            {selected.size > 0 && (
              <button className="btn btn-danger btn-sm" onClick={handleBatchDelete}>
                🗑 批量删除（{selected.size}）
              </button>
            )}
          </div>
          <button className="btn btn-primary" onClick={openCreate}>＋ 新增课程</button>
        </div>

        {loading ? (
          <div className="table-empty">加载中…</div>
        ) : filtered.length === 0 ? (
          <div className="table-empty">暂无课程数据</div>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}><input type="checkbox" checked={allChecked} onChange={toggleSelectAll} /></th>
                  <th style={{ width: 50 }}>#</th>
                  <th>封面</th><th>课程标题</th><th>分类路径</th><th>课时</th><th>章节</th><th>学习人数</th><th>操作</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((c, idx) => (
                  <tr key={c._id} className={selected.has(c._id) ? 'row-selected' : ''}>
                    <td><input type="checkbox" checked={selected.has(c._id)} onChange={() => toggleSelect(c._id)} /></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                    <td>
                      {c._coverUrl ? (
                        <img src={c._coverUrl} alt="" style={{ width: 56, height: 36, objectFit: 'cover', borderRadius: 4 }} />
                      ) : (
                        <span className="cell-color" style={{ background: c.coverColor || '#4F7CFF' }} />
                      )}
                    </td>
                    <td style={{ fontWeight: 600 }}>{c.title}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{getCatalogLabel(c)}</td>
                    <td>{c.lessonCount ?? '-'}</td>
                    <td>{(c.chapters || []).length} 章</td>
                    <td>{c.learnerCount ?? 0}</td>
                    <td>
                      <div className="cell-actions">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)}>编辑</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c)}>删除</button>
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
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ width: 720, maxHeight: '90vh', overflow: 'auto' }}>
            <div className="modal-header">
              <h2>{modal === 'create' ? '新增课程' : '编辑课程'}</h2>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">课程标题 *</label>
                <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">所属目录 *</label>
                <select className="form-select" value={form.catalog} onChange={e => handleCatalogChange(e.target.value)}>
                  {COURSE_CATALOG.map(cat => <option key={cat.key} value={cat.key}>{cat.icon} {cat.name}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">{isResource ? 'L1 学段' : '子分类'} *</label>
                  <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option value="">— 请选择 —</option>
                    {getCategoryOptions(form.catalog).map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                {isResource && (
                  <div className="form-group">
                    <label className="form-label">L2 学科</label>
                    <select className="form-select" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                      <option value="">— 请选择 —</option>
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                )}
              </div>
              {isResource && (
                <div className="form-group">
                  <label className="form-label">L3 年级/册次</label>
                  <input className="form-input" placeholder="如：三年级上册" value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">封面图片</label>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  {coverPreview ? (
                    <img src={coverPreview} alt="" style={{ width: 128, height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }} />
                  ) : (
                    <div style={{ width: 128, height: 80, borderRadius: 6, background: `linear-gradient(135deg, ${form.coverColor}, ${form.coverColor}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24 }}>📖</div>
                  )}
                  <div>
                    <input type="file" accept="image/*" disabled={uploading} onChange={async (e) => {
                      const file = e.target.files?.[0]; if (!file) return
                      setCoverPreview(URL.createObjectURL(file)); setUploading(true)
                      try { const fileID = await uploadImage(file); setForm(f => ({ ...f, coverImage: fileID })) }
                      catch (err) { alert('图片上传失败: ' + (err.message || err)); setCoverPreview('') }
                      setUploading(false)
                    }} />
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>
                      {uploading ? '上传中…' : '支持 JPG / PNG，建议 16:9 比例'}
                    </p>
                    {form.coverImage && (
                      <button className="btn btn-ghost btn-sm" type="button" style={{ marginTop: 4, fontSize: 12 }}
                        onClick={() => { setForm(f => ({ ...f, coverImage: '' })); setCoverPreview('') }}>清除封面</button>
                    )}
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">备用封面颜色</label>
                  <div className="form-color-wrap">
                    <input type="color" value={form.coverColor} onChange={e => setForm({ ...form, coverColor: e.target.value })} />
                    <input className="form-input" style={{ width: 100 }} value={form.coverColor} onChange={e => setForm({ ...form, coverColor: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">评分</label>
                  <input className="form-input" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label className="form-label">授课教师</label>
                  <input className="form-input" value={form.instructor} onChange={e => setForm({ ...form, instructor: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">标签</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input className="form-input" style={{ flex: 1 }} placeholder="输入标签后回车"
                    value={tagInput} onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }} />
                  <button className="btn btn-ghost" onClick={addTag} type="button">添加</button>
                </div>
                {form.tags.length > 0 && (
                  <div className="form-tags">
                    {form.tags.map(t => (
                      <span className="tag" key={t}>{t}<span className="tag-x" onClick={() => removeTag(t)}>×</span></span>
                    ))}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">课程简介</label>
                <textarea className="form-textarea" rows={3} value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>📚 章节与课时（共 {form.chapters.length} 章，{totalLessons} 课时）</span>
                  <button className="btn btn-ghost btn-sm" type="button" onClick={addChapter}>＋ 添加章节</button>
                </label>
                {form.chapters.length === 0 && (
                  <div style={{ padding: '16px 0', color: 'var(--text-muted)', fontSize: 13, textAlign: 'center' }}>
                    暂无章节，点击上方按钮添加
                  </div>
                )}
                {form.chapters.map((ch, ci) => (
                  <div key={ci} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 12, marginBottom: 12, background: 'var(--bg-card)' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--primary)', whiteSpace: 'nowrap' }}>第 {ci + 1} 章</span>
                      <input className="form-input" placeholder="章节标题" value={ch.title}
                        onChange={e => updateChapterTitle(ci, e.target.value)} style={{ flex: 1 }} />
                      <button className="btn btn-danger btn-sm" type="button" onClick={() => removeChapter(ci)} title="删除此章节">✕</button>
                    </div>
                    {ch.lessons.map((ls, li) => (
                      <div key={li} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6, paddingLeft: 16 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{ci + 1}.{li + 1}</span>
                        <input className="form-input" placeholder="课时标题" value={ls.title}
                          onChange={e => updateLesson(ci, li, 'title', e.target.value)} style={{ flex: 2 }} />
                        <input className="form-input" placeholder="视频地址 URL" value={ls.videoUrl}
                          onChange={e => updateLesson(ci, li, 'videoUrl', e.target.value)} style={{ flex: 2 }} />
                        <input className="form-input" type="number" min="0" placeholder="分钟" value={ls.duration || ''}
                          onChange={e => updateLesson(ci, li, 'duration', Number(e.target.value))} style={{ width: 64 }} />
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)', padding: '2px 6px' }}
                          type="button" onClick={() => removeLesson(ci, li)}>✕</button>
                      </div>
                    ))}
                    <button className="btn btn-ghost btn-sm" type="button" onClick={() => addLesson(ci)}
                      style={{ marginLeft: 16, marginTop: 4, fontSize: 12 }}>＋ 添加课时</button>
                  </div>
                ))}
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