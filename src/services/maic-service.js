/**
 * MAIC Service — Web 端调用共享云函数
 * 课堂 CRUD + AI 生成 + 智能体对话
 */
import { callFunction } from '../cloudbase'

/* ==================== 课堂 CRUD (maic-room) ==================== */

/** 创建课堂记录 */
export async function createRoom(topic, options = {}) {
  try {
    return await callFunction('maic-room', {
      action: 'create',
      topic,
      language: options.language || '中文',
      duration: options.duration || 30,
      difficulty: options.difficulty || '入门',
      scenes: options.scenes || [],
      agents: options.agents || [],
      status: options.status || 'generating'
    })
  } catch (error) {
    console.error('Error creating room:', error.message)
    throw error
  }
}

/** 获取我的课堂列表 */
export async function listRooms(limit = 20, skip = 0) {
  try {
    return await callFunction('maic-room', { action: 'list', limit, skip })
  } catch (error) {
    console.error('Error listing rooms:', error.message)
    throw error
  }
}

/** 获取单个课堂详情 */
export async function getRoom(id) {
  try {
    return await callFunction('maic-room', { action: 'get', id })
  } catch (error) {
    console.error('Error getting room details:', error.message)
    throw error
  }
}

/** 更新课堂 */
export async function updateRoom(id, data) {
  try {
    return await callFunction('maic-room', { action: 'update', id, ...data })
  } catch (error) {
    console.error('Error updating room:', error.message)
    throw error
  }
}

/** 删除课堂 */
export async function deleteRoom(id) {
  try {
    return await callFunction('maic-room', { action: 'delete', id })
  } catch (error) {
    console.error('Error deleting room:', error.message)
    throw error
  }
}

/* ==================== AI 生成 (maic-chat) ==================== */

/** 生成课堂场景大纲 */
export async function generateScenes(topic, difficulty = '入门', duration = 30) {
  return callFunction('maic-chat', {
    action: 'generate_scenes',
    topic, difficulty, duration
  })
}

/** 为单个场景生成详细内容 */
export async function generateSceneContent(scene, topic, difficulty = '入门') {
  return callFunction('maic-chat', {
    action: 'generate_content',
    scene, topic, difficulty
  })
}

/** 根据主题生成历史名人角色 */
export async function generateAgents(topic, difficulty = '入门') {
  return callFunction('maic-chat', {
    action: 'generate_agents',
    topic, difficulty
  })
}

/** 完整课堂生成流程（大纲 + 角色 + 逐场景内容） */
export async function generateFullClassroom(topic, options = {}, onProgress) {
  const difficulty = options.difficulty || '入门'
  const duration = options.duration || 30

  // 1. 创建房间
  if (onProgress) onProgress({ stage: 'creating', percent: 3 })
  const room = await createRoom(topic, { ...options, status: 'generating' })

  // 2. 生成场景大纲
  if (onProgress) onProgress({ stage: 'scenes', percent: 10 })
  const scenesRes = await generateScenes(topic, difficulty, duration)
  let scenes = scenesRes.scenes || []
  if (scenes.length === 0) {
    throw new Error('AI 生成场景失败（返回空内容），请检查云函数 maic-chat 是否超时或 AI 密钥是否有效')
  }

  // 3. 并行：生成角色 + 批量生成场景内容（最多3并发）
  if (onProgress) onProgress({ stage: 'agents', percent: 20, scenes })
  let agents = DEFAULT_AGENTS

  // 角色生成 Promise
  const agentsPromise = generateAgents(topic, difficulty).then(async agentsRes => {
    console.log('[generateFullClassroom] agentsRes:', JSON.stringify(agentsRes).slice(0, 500))
    if (agentsRes.agents?.length >= 3) {
      agents = agentsRes.agents
      // 角色生成完毕，立即通知 UI 刷新角色显示
      if (onProgress) onProgress({ agents })
      // 并行生成角色头像
      try {
        await Promise.allSettled(agents.map(async (agent) => {
          const prompt = `高质量人物肖像头像，${agent.name}，${agent.persona ? agent.persona.slice(0, 80) : ''}，简洁干净背景，适合圆形头像裁切，专业插画风格`
          const url = await generateIllustration(prompt, { width: 256, height: 256 })
          if (url) agent.avatarUrl = url
        }))
        if (onProgress) onProgress({ agents })
      } catch (e) {
        console.warn('[generateFullClassroom] 头像生成异常:', e)
      }
    } else {
      console.warn('[generateFullClassroom] AI 返回角色数量不足 (<3)，使用默认角色。')
    }
  }).catch(err => {
    console.warn('[generateFullClassroom] 生成角色失败，使用默认角色:', err)
  })

  // 场景内容并行生成（限制3并发，避免云函数过载）
  const CONCURRENCY = 3
  let contentDone = 0
  async function generateContentBatch() {
    for (let start = 0; start < scenes.length; start += CONCURRENCY) {
      const batch = scenes.slice(start, start + CONCURRENCY).map((_, j) => {
        const i = start + j
        return generateSceneContent(scenes[i], topic, difficulty).then(res => {
          scenes[i] = { ...scenes[i], ...res.content }
        }).catch(err => {
          console.warn(`场景 ${i} 生成失败，使用兜底内容:`, err)
          if (scenes[i].type === 'slide') {
            scenes[i].narration = `接下来我们学习"${scenes[i].title}"。`
            scenes[i].notes = ['认真听讲']
          }
        }).finally(() => {
          contentDone++
          const pct = 25 + Math.round((contentDone / scenes.length) * 55)
          if (onProgress) onProgress({ stage: 'content', sceneIndex: contentDone - 1, total: scenes.length, percent: pct, agents })
        })
      })
      await Promise.all(batch)
    }
  }

  // 角色 + 内容同时开始
  await Promise.all([agentsPromise, generateContentBatch()])

  // 4. 为 slide 场景生成配图（并行，不阻塞）
  if (onProgress) onProgress({ stage: 'illustrations', percent: 82 })
  const slideIndices = scenes.map((s, i) => s.type === 'slide' ? i : -1).filter(i => i >= 0)
  // 仅为首页和每隔2页生成配图，控制成本
  const illustrationIndices = slideIndices.filter((_, idx) => idx === 0 || idx % 2 === 0)
  try {
    const illustrationResults = await Promise.allSettled(
      illustrationIndices.map(async (i) => {
        const prompt = buildIllustrationPrompt(scenes[i], topic)
        const url = await generateIllustration(prompt)
        if (url) scenes[i].illustrationUrl = url
      })
    )
    console.log('[generateFullClassroom] 配图结果:', illustrationResults.map(r => r.status))
  } catch (err) {
    console.warn('[generateFullClassroom] 配图阶段异常:', err)
  }

  // 5. 保存到数据库
  if (onProgress) onProgress({ stage: 'saving', percent: 95 })
  await updateRoom(room.id, { scenes, agents, status: 'ready' })

  if (onProgress) onProgress({ stage: 'done', percent: 100 })
  return { id: room.id, scenes, agents }
}

/* ==================== 智能体对话 (maic-chat) ==================== */

/** 获取 Director 决定的下一个发言者 */
export async function getNextSpeaker(agents, conversationSummary, agentResponses, turnCount, maxTurns, discussionContext) {
  return callFunction('maic-chat', {
    action: 'director',
    agents, conversationSummary, agentResponses,
    turnCount, maxTurns, discussionContext
  })
}

/** 生成智能体回复 */
export async function getAgentReply(agent, conversationMessages, context, peerResponses) {
  return callFunction('maic-chat', {
    action: 'agent_reply',
    agent, conversationMessages, context, peerResponses
  })
}

/** 通用 AI 对话 */
export async function simpleChat(messages, sceneName, temperature) {
  return callFunction('maic-chat', {
    action: 'simple_chat',
    messages, sceneName, temperature
  })
}

/* ==================== AI 生图 (hunyuan-image) ==================== */

/** 为课堂内容生成配图 */
export async function generateIllustration(prompt, options = {}) {
  try {
    const res = await callFunction('hunyuan-image', {
      prompt: prompt.substring(0, 500),
      width: options.width || 512,
      height: options.height || 384,
      style: options.style || 'auto'
    })
    if (res.error) {
      console.warn('[generateIllustration] 生图失败:', res.error)
      return null
    }
    return res.url || null
  } catch (err) {
    console.warn('[generateIllustration] 调用失败:', err)
    return null
  }
}

/** 根据场景信息构造配图 prompt */
export function buildIllustrationPrompt(scene, topic) {
  const title = scene.title || ''
  const subtitle = scene.subtitle || ''
  return `清新扁平教育插画，主题：${topic}，内容：${title}${subtitle ? '，' + subtitle : ''}，简洁现代设计风格，柔和色彩，无文字，适合PPT配图`
}

/* ==================== 默认智能体 ==================== */

export const DEFAULT_AGENTS = [
  {
    id: 'teacher_li', name: '李老师', role: 'teacher',
    persona: '你是李老师，一位经验丰富、亲和力强的大学教师。你善于用通俗易懂的语言解释复杂概念，喜欢用生活中的例子来帮助学生理解。',
    avatar: '👨‍🏫', color: '#4F7CFF', priority: 10
  },
  {
    id: 'assistant_bot', name: '小助教', role: 'assistant',
    persona: '你是AI助教，负责辅助教学。你擅长将复杂内容拆解成简单易懂的小步骤，也会提醒重点内容和考试要点。',
    avatar: '🤖', color: '#52C41A', priority: 5
  },
  {
    id: 'student_ming', name: '小明', role: 'student',
    persona: '你是小明，一个活泼好问的学生。你总是有很多问题，喜欢打破砂锅问到底。回复要简短、口语化。',
    avatar: '👦', color: '#FAAD14', priority: 3
  },
  {
    id: 'student_hong', name: '小红', role: 'student',
    persona: '你是小红，一个认真思考型的学生。你善于总结和归纳，经常能提出独特的见解。回复要简短、有深度。',
    avatar: '👧', color: '#EB2F96', priority: 2
  }
]
