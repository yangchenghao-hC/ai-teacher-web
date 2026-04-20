/** 共享 Mock 数据 — 与小程序 utils/mock-data.js 完全一致 */

export const banners = [
  { id: 1, title: '新学期课程上线', desc: '2026春季教育学精品课程', color: '#4F7CFF' },
  { id: 2, title: 'AI互动课堂正式发布', desc: 'AI 多智能体互动课堂', color: '#7B68EE' },
  { id: 3, title: '教师资格证冲刺', desc: '笔试面试全面备考', color: '#FF6B6B' }
]

export const quickEntries = [
  { id: 'courses', name: '专题课堂', emoji: '📚', color: '#4F7CFF', url: '/courses' },
  { id: 'openmaic', name: 'AI互动课', emoji: '🤖', color: '#7B68EE', url: '/openmaic' },
  { id: 'ai', name: 'AI 助手', emoji: '💬', color: '#52C41A', url: '/ai-chat' },
  { id: 'history', name: '学习记录', emoji: '⏱️', color: '#FAAD14', url: '/profile' },
  { id: 'favorites', name: '收藏夹', emoji: '⭐', color: '#FF6B6B', url: '/profile' },
  { id: 'calendar', name: '学习日历', emoji: '📅', color: '#13C2C2', url: '/profile' },
  { id: 'news', name: '校园资讯', emoji: '📰', color: '#EB2F96', url: '/news' },
  { id: 'activity', name: '活动报名', emoji: '🎯', color: '#FA8C16', url: '/activities' }
]

export const learningStats = {
  todayMinutes: 45,
  completedCourses: 12,
  aiChatCount: 38,
  streakDays: 7
}

export const recommendCourses = [
  { id: '1', title: '教育心理学：学生认知发展理论', coverColor: '#4F7CFF', tags: ['大学', '教育学'], learnerCount: 3256, rating: 4.8, lessonCount: 24 },
  { id: '2', title: '小学数学教学方法与策略', coverColor: '#52C41A', tags: ['小学', '数学'], learnerCount: 2180, rating: 4.9, lessonCount: 18 },
  { id: '3', title: '课堂管理艺术与实践', coverColor: '#FF6B6B', tags: ['通识', '教育学'], learnerCount: 1890, rating: 4.7, lessonCount: 12 },
  { id: '4', title: '信息技术与学科融合教学', coverColor: '#7B68EE', tags: ['高中', '信息技术'], learnerCount: 1560, rating: 4.6, lessonCount: 16 },
  { id: '5', title: '学前教育：游戏化教学设计', coverColor: '#FA8C16', tags: ['学前', '教育学'], learnerCount: 1240, rating: 4.8, lessonCount: 20 }
]

export const recentStudies = [
  { id: '1', title: '教育心理学：学生认知发展理论', coverColor: '#4F7CFF', progress: 68, lastTime: '10分钟前', chapterName: '第三章 皮亚杰认知发展阶段' },
  { id: '2', title: '课堂管理艺术与实践', coverColor: '#FF6B6B', progress: 35, lastTime: '昨天', chapterName: '第二章 课堂纪律策略' },
  { id: '3', title: '小学数学教学方法与策略', coverColor: '#52C41A', progress: 90, lastTime: '3天前', chapterName: '第四章 数学思维培养' }
]

export const courseList = [
  ...recommendCourses,
  { id: '6', title: '初中英语阅读教学策略', coverColor: '#13C2C2', tags: ['初中', '英语'], learnerCount: 980, rating: 4.5, lessonCount: 14 },
  { id: '7', title: '高中物理实验教学设计', coverColor: '#EB2F96', tags: ['高中', '物理'], learnerCount: 760, rating: 4.7, lessonCount: 10 },
  { id: '8', title: '特殊教育基础理论与方法', coverColor: '#FA8C16', tags: ['通识', '特殊教育'], learnerCount: 520, rating: 4.9, lessonCount: 22 }
]

export const aiScenes = [
  { id: 'plan', name: '教案设计', icon: '📝', desc: '帮你设计完整教案' },
  { id: 'manage', name: '课堂管理', icon: '🏫', desc: '课堂管理技巧' },
  { id: 'analysis', name: '学情分析', icon: '📊', desc: '分析学生学情' },
  { id: 'reflect', name: '教学反思', icon: '💭', desc: '反思教学过程' },
  { id: 'interview', name: '面试模拟', icon: '🎤', desc: '模拟资格证面试' },
  { id: 'free', name: '自由对话', icon: '💡', desc: '自由提问任何问题' }
]

export const campusNews = [
  {
    id: 'n1', title: '2026年春季学期教学工作会议顺利召开',
    category: '校园新闻', time: '2026-04-15', color: '#4F7CFF',
    summary: '学校召开2026年春季学期教学工作会议，部署本学期教学重点任务，推进教育教学改革。',
    content: '4月15日上午，学校在行政楼报告厅召开2026年春季学期教学工作会议。校长、各学院院长及教务处相关负责人出席会议。\n\n会议回顾了上学期教学工作取得的成绩，并对本学期教学重点工作进行了部署。会议强调，要持续深化课程思政建设，推进人工智能与教育教学的深度融合，加强师范生实践教学能力培养。\n\n会议还就期中教学检查、课程建设评估、教学成果申报等工作进行了具体安排。'
  },
  {
    id: 'n2', title: '关于2026年上半年教师资格考试报名的通知',
    category: '教务通知', time: '2026-04-14', color: '#EB2F96',
    summary: '2026年上半年中小学教师资格考试（笔试）报名即将开始，请同学们及时关注。',
    content: '各位同学：\n\n根据教育部考试中心通知，2026年上半年中小学教师资格考试（笔试）将于5月举行。\n\n一、报名时间：4月20日-4月25日\n二、考试时间：5月18日\n三、报名方式：登录中小学教师资格考试网进行网上报名\n四、收费标准：每科70元\n\n请各位同学提前做好准备，按时完成报名。如有疑问，请联系教务处。'
  },
  {
    id: 'n3', title: '人工智能赋能教育创新前沿讲座',
    category: '学术讲座', time: '2026-04-13', color: '#52C41A',
    summary: '教育学院邀请知名学者开展"人工智能赋能教育创新"系列讲座，欢迎参加。',
    content: '讲座主题：人工智能赋能教育创新——从理论到实践\n\n主讲人：张教授（北京师范大学教育技术学院）\n\n时间：4月20日（周日）14:30-16:30\n地点：教育学院学术报告厅 A301\n\n欢迎全校师生参加！'
  },
  {
    id: 'n4', title: '教育技术协会招新啦！',
    category: '社团活动', time: '2026-04-12', color: '#FA8C16',
    summary: '教育技术协会2026年春季招新开始，期待热爱教育科技的你加入。',
    content: '🎉 教育技术协会2026春季招新\n\n我们是一个专注于教育与科技融合的学生社团。\n\n招新要求：教育学院各年级本科生、研究生均可报名\n报名截止：4月30日'
  },
  {
    id: 'n5', title: '学校图书馆延长开放时间通知',
    category: '校园新闻', time: '2026-04-11', color: '#4F7CFF',
    summary: '为满足同学们的学习需求，图书馆自本周起延长开放时间至晚间23:00。',
    content: '周一至周五：7:00-23:00\n周六、周日：8:00-22:00\n自习室24小时开放'
  },
  {
    id: 'n6', title: '关于选报暑期教育实习基地的通知',
    category: '教务通知', time: '2026-04-10', color: '#EB2F96',
    summary: '2026年暑期教育实习基地选报工作即将启动，请大三同学关注。',
    content: '实习时间：7月1日-8月15日（共6周）\n选报时间：4月20日-4月30日\n选报方式：教务系统-实践教学-实习报名'
  },
  {
    id: 'n7', title: '第三届师范生教学技能大赛报名启动',
    category: '学术讲座', time: '2026-04-09', color: '#52C41A',
    summary: '第三届校级师范生教学技能大赛开始报名，设特等奖奖金3000元。',
    content: '比赛内容：教学设计 + 模拟授课 + 即兴答辩\n报名截止：5月10日\n特等奖：奖金3000元 + 证书'
  },
  {
    id: 'n8', title: '校园马拉松趣味跑活动来啦',
    category: '社团活动', time: '2026-04-08', color: '#FA8C16',
    summary: '体育部联合校学生会举办春季校园马拉松趣味跑，5公里欢乐开跑！',
    content: '🏃 2026春季校园马拉松趣味跑\n\n活动时间：4月26日 8:00\n路线距离：5公里\n报名费：免费\n名额：500人'
  }
]

export const activities = [
  {
    id: 'a1', title: '人工智能赋能教育创新讲座',
    category: '讲座', time: '4月20日 14:30', location: '教育学院 A301',
    organizer: '教育学院', quota: 200, enrolled: 156, color: '#4F7CFF',
    summary: '北京师范大学张教授主讲，探讨 AI 在教育中的创新应用。',
    content: '讲座主题：人工智能赋能教育创新——从理论到实践\n\n主讲人：张教授\n时间：4月20日 14:30-16:30\n地点：A301',
    deadline: '4月19日 18:00'
  },
  {
    id: 'a2', title: '第三届师范生教学技能大赛',
    category: '比赛', time: '5月20日 全天', location: '教学楼 B 区',
    organizer: '教务处', quota: 100, enrolled: 67, color: '#EB2F96',
    summary: '校级教学技能比赛，特等奖奖金3000元！',
    content: '比赛内容：教学设计(30%) + 模拟授课(50%) + 即兴答辩(20%)',
    deadline: '5月10日 23:59'
  },
  {
    id: 'a3', title: '乡村教育支教志愿者招募',
    category: '志愿者', time: '7月1日-7月15日', location: '贵州省黔东南州',
    organizer: '校团委', quota: 30, enrolled: 22, color: '#52C41A',
    summary: '暑期乡村支教志愿服务，为偏远地区的孩子带去知识和温暖。',
    content: '往返交通费全额报销 + 提供食宿 + 志愿服务证书 + 社会实践学分',
    deadline: '5月30日 18:00'
  },
  {
    id: 'a4', title: '教育技术协会2026春季招新',
    category: '社团招新', time: '4月12日-4月30日', location: '线上报名',
    organizer: '教育技术协会', quota: 50, enrolled: 35, color: '#FA8C16',
    summary: '探索 AI 教育前沿，参加技术分享，开发教育类应用。',
    content: '每周技术分享会 + 教育科技竞赛 + 企业参访',
    deadline: '4月30日 23:59'
  },
  {
    id: 'a5', title: '校园马拉松趣味跑',
    category: '比赛', time: '4月26日 08:00', location: '校体育场',
    organizer: '体育部 & 校学生会', quota: 500, enrolled: 389, color: '#7B68EE',
    summary: '5公里趣味跑，完赛奖牌 + 纪念T恤！',
    content: '彩虹跑道 + 趣味打卡点 + 完赛奖牌 + 纪念T恤',
    deadline: '4月24日 18:00'
  },
  {
    id: 'a6', title: '心理健康知识讲座',
    category: '讲座', time: '4月28日 19:00', location: '学生活动中心',
    organizer: '心理咨询中心', quota: 300, enrolled: 98, color: '#13C2C2',
    summary: '关注心理健康，学习压力管理和情绪调节技巧。',
    content: '大学生压力管理与心理调适 + 实用放松技巧体验',
    deadline: '4月27日 18:00'
  }
]

export const userInfo = {
  nickName: '师范小王',
  avatarUrl: '',
  school: '华中师范大学',
  major: '教育技术学',
  grade: '大三',
  totalStudyMinutes: 12680,
  completedCourses: 12,
  certificates: 3,
  aiChatCount: 38
}

export const newsCategories = ['全部', '校园新闻', '教务通知', '学术讲座', '社团活动']
export const activityCategories = ['全部', '讲座', '比赛', '志愿者', '社团招新']

export const GRADE_LEVELS = ['全部', '学前', '小学', '初中', '高中', '中职', '高职', '大学']
export const SORT_OPTIONS = [
  { key: 'hot', label: '最热' },
  { key: 'newest', label: '最新' },
  { key: 'rating', label: '好评' }
]
