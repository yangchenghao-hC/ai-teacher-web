import cloudbase from '@cloudbase/js-sdk'

const app = cloudbase.init({
  env: 'cloud1-7gku4v6nd4264b1d'
})

// 匿名登录
const auth = app.auth({ persistence: 'local' })

export async function login() {
  const state = await auth.getLoginState()
  if (!state) {
    await auth.signInAnonymously()
  }
}

export const db = app.database()

/**
 * 调用云函数（统一封装，自动登录）
 * 错误时附带云函数名称，便于前端定位问题
 */
export async function callFunction(name, data = {}) {
  try {
    await login()
  } catch (loginErr) {
    const err = new Error(`[登录失败] 无法完成匿名登录：${loginErr.message}`)
    err.fnName = 'login'
    console.error(err.message)
    throw err
  }
  try {
    const res = await app.callFunction({ name, data })
    const result = res.result || res
    if (result && result.error) {
      const err = new Error(`[云函数错误] ${name}: ${result.error}`)
      err.fnName = name
      err.fnError = result.error
      throw err
    }
    return result
  } catch (error) {
    if (!error.fnName) {
      error.fnName = name
      error.message = `[云函数调用失败] ${name}: ${error.message}`
    }
    console.error(error.message)
    throw error
  }
}

export default app
