/**
 * auto-seed.js v5 — massive data edition
 * Bumped SEED_FLAG to v5 to trigger re-seeding with large datasets.
 */
import { db, login } from '../cloudbase'

const SEED_FLAG = 'tkbs_seed_done_v5'

const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123',
  displayName: '超级管理员',
  role: 'superadmin',
  enabled: true,
}

/* ===== Banner 种子数据 (12 条) ===== */
const SEED_BANNERS = [
  { title: '认知心理学精品课程上线', desc: '北京师范大学彭华茂教授主讲，15集完整课程', color: '#4F7CFF', sort: 1, enabled: true, link: 'https://www.bilibili.com/video/BV1VkSxBWEC9/' },
  { title: '2026年教师资格证备考攻略', desc: '笔试+面试全流程指导，助你一次通过', color: '#EB2F96', sort: 2, enabled: true, link: '' },
  { title: '新学期师范生教育资源库更新', desc: '覆盖学前至大学全学段，50+精品课程', color: '#52C41A', sort: 3, enabled: true, link: '' },
  { title: '名师课堂实录系列', desc: '观摩名师授课，提升教学技能', color: '#FA8C16', sort: 4, enabled: true, link: '' },
  { title: '暑期支教志愿者招募中', desc: '贵州、云南、甘肃三地支教项目', color: '#13C2C2', sort: 5, enabled: true, link: '' },
  { title: '第三届师范生教学技能大赛', desc: '报名截止5月10日，特等奖3000元', color: '#7B68EE', sort: 6, enabled: true, link: '' },
  { title: '心理学系列公开课', desc: '普通心理学、发展心理学、教育心理学', color: '#FF6B6B', sort: 7, enabled: true, link: '' },
  { title: 'AI赋能教育创新专题', desc: '探索人工智能在教学中的应用', color: '#722ED1', sort: 8, enabled: true, link: '' },
  { title: '说课稿模板库开放下载', desc: '涵盖各学科各学段优秀说课稿200+', color: '#1890FF', sort: 9, enabled: true, link: '' },
  { title: '教育学考研冲刺班', desc: '311教育学综合+333教育综合', color: '#F5222D', sort: 10, enabled: true, link: '' },
  { title: '新版课程标准解读', desc: '2022版义务教育课程标准深度解读', color: '#FAAD14', sort: 11, enabled: true, link: '' },
  { title: '图书馆24小时自习室开放', desc: '考试季图书馆延长开放时间', color: '#36CFC9', sort: 12, enabled: true, link: '' },
]

/* ===== 课程种子数据 (35 条) ===== */
const BV = 'https://www.bilibili.com/video/BV1VkSxBWEC9'

const SEED_COURSES = [
  // === 1. 认知心理学（Bilibili BV1VkSxBWEC9, 15集） ===
  { title: '认知心理学', coverColor: '#4F7CFF', tags: ['大学', '心理学', 'B站精品'], learnerCount: 8920, rating: 4.9, catalog: 'resource', category: '大学', subject: '心理学', grade: '', instructor: '彭华茂（北京师范大学）', description: '北京师范大学彭华茂教授主讲的认知心理学课程，系统讲解知觉、注意、记忆、语言、思维、问题解决与决策等核心主题。B站已收录完整15集视频。', chapters: [
    { title: '第一章 认知心理学导论', lessons: [
      { title: '1.1 认知心理学的历史与发展', videoUrl: BV + '?p=1', duration: 43 },
      { title: '1.2 认知心理学的研究方法', videoUrl: BV + '?p=2', duration: 40 },
      { title: '1.3 认知神经科学基础', videoUrl: BV + '?p=3', duration: 42 },
    ]},
    { title: '第二章 知觉与注意', lessons: [
      { title: '2.1 知觉与模式识别', videoUrl: BV + '?p=4', duration: 39 },
      { title: '2.2 注意的理论模型', videoUrl: BV + '?p=5', duration: 40 },
      { title: '2.3 注意的分配与控制', videoUrl: BV + '?p=6', duration: 39 },
    ]},
    { title: '第三章 记忆', lessons: [
      { title: '3.1 记忆的编码与存储', videoUrl: BV + '?p=7', duration: 42 },
      { title: '3.2 记忆的提取与遗忘', videoUrl: BV + '?p=8', duration: 40 },
      { title: '3.3 工作记忆与长时记忆', videoUrl: BV + '?p=9', duration: 40 },
    ]},
    { title: '第四章 语言与思维', lessons: [
      { title: '4.1 语言理解与产生', videoUrl: BV + '?p=10', duration: 40 },
      { title: '4.2 概念与分类', videoUrl: BV + '?p=11', duration: 42 },
      { title: '4.3 推理与判断', videoUrl: BV + '?p=12', duration: 40 },
    ]},
    { title: '第五章 问题解决与决策', lessons: [
      { title: '5.1 问题解决策略', videoUrl: BV + '?p=13', duration: 40 },
      { title: '5.2 决策与启发式', videoUrl: BV + '?p=14', duration: 40 },
      { title: '5.3 创造性思维', videoUrl: BV + '?p=15', duration: 40 },
    ]},
  ]},

  // === 2-10: 原有课程(保留) ===
  { title: '教育心理学：学生认知发展理论', coverColor: '#4F7CFF', tags: ['大学', '教育学'], learnerCount: 3256, rating: 4.8, catalog: 'resource', category: '大学', subject: '教育学', grade: '', instructor: '王明教授', description: '系统讲解皮亚杰、维果茨基等核心理论，帮助师范生理解学生认知发展规律。', chapters: [
    { title: '第一章 认知发展概述', lessons: [{ title: '1.1 什么是认知发展', videoUrl: '', duration: 25 }, { title: '1.2 认知发展的研究方法', videoUrl: '', duration: 30 }] },
    { title: '第二章 皮亚杰认知发展理论', lessons: [{ title: '2.1 感知运动阶段', videoUrl: '', duration: 28 }, { title: '2.2 前运算阶段', videoUrl: '', duration: 32 }, { title: '2.3 具体运算阶段', videoUrl: '', duration: 26 }] },
    { title: '第三章 维果茨基社会文化理论', lessons: [{ title: '3.1 最近发展区', videoUrl: '', duration: 35 }, { title: '3.2 支架式教学', videoUrl: '', duration: 30 }] },
  ]},
  { title: '小学数学教学方法与策略', coverColor: '#52C41A', tags: ['小学', '数学'], learnerCount: 2180, rating: 4.9, catalog: 'resource', category: '小学', subject: '数学', grade: '', instructor: '李芳老师', description: '面向小学数学教师的方法论课程。', chapters: [
    { title: '第一章 小学数学教学原则', lessons: [{ title: '1.1 直观性原则', videoUrl: '', duration: 20 }, { title: '1.2 活动性原则', videoUrl: '', duration: 22 }] },
    { title: '第二章 情境创设与问题解决', lessons: [{ title: '2.1 生活情境导入', videoUrl: '', duration: 28 }, { title: '2.2 问题链设计', videoUrl: '', duration: 25 }] },
  ]},
  { title: '课堂管理艺术与实践', coverColor: '#FF6B6B', tags: ['通识', '教育学'], learnerCount: 1890, rating: 4.7, catalog: 'resource', category: '大学', subject: '教育学', grade: '', instructor: '张伟教授', description: '帮助新手教师掌握课堂纪律管理、学生激励等实用技能。', chapters: [
    { title: '第一章 课堂管理基础', lessons: [{ title: '1.1 课堂管理的定义与意义', videoUrl: '', duration: 20 }, { title: '1.2 课堂规则的建立', videoUrl: '', duration: 25 }] },
    { title: '第二章 课堂纪律策略', lessons: [{ title: '2.1 预防策略', videoUrl: '', duration: 30 }, { title: '2.2 干预策略', videoUrl: '', duration: 28 }] },
  ]},
  { title: '信息技术与学科融合教学', coverColor: '#7B68EE', tags: ['高中', '信息技术'], learnerCount: 1560, rating: 4.6, catalog: 'resource', category: '高中', subject: '信息技术', grade: '', instructor: '陈晨老师', description: '探索如何将信息技术深度融入学科教学。', chapters: [
    { title: '第一章 信息技术融合概述', lessons: [{ title: '1.1 教育信息化趋势', videoUrl: '', duration: 22 }, { title: '1.2 TPACK框架解读', videoUrl: '', duration: 28 }] },
    { title: '第二章 多媒体教学设计', lessons: [{ title: '2.1 PPT高级技巧', videoUrl: '', duration: 25 }, { title: '2.2 微课制作入门', videoUrl: '', duration: 35 }] },
  ]},
  { title: '学前教育：游戏化教学设计', coverColor: '#FA8C16', tags: ['学前', '教育学'], learnerCount: 1240, rating: 4.8, catalog: 'resource', category: '学前', subject: '教育学', grade: '', instructor: '赵丽老师', description: '以游戏为核心，设计适合3-6岁幼儿的教学活动方案。', chapters: [
    { title: '第一章 游戏与学前教育', lessons: [{ title: '1.1 游戏的教育价值', videoUrl: '', duration: 18 }, { title: '1.2 游戏分类与选择', videoUrl: '', duration: 22 }] },
    { title: '第二章 游戏化课程设计', lessons: [{ title: '2.1 语言领域游戏', videoUrl: '', duration: 26 }, { title: '2.2 科学领域游戏', videoUrl: '', duration: 28 }] },
  ]},
  { title: '初中英语阅读教学策略', coverColor: '#13C2C2', tags: ['初中', '英语'], learnerCount: 980, rating: 4.5, catalog: 'resource', category: '初中', subject: '英语', grade: '', instructor: '刘红老师', description: '提升初中生英语阅读能力的系统方法。', chapters: [
    { title: '第一章 阅读教学基础', lessons: [{ title: '1.1 阅读教学目标设定', videoUrl: '', duration: 20 }, { title: '1.2 阅读前活动设计', videoUrl: '', duration: 24 }] },
    { title: '第二章 阅读策略训练', lessons: [{ title: '2.1 略读与扫读技巧', videoUrl: '', duration: 26 }, { title: '2.2 推断与总结能力', videoUrl: '', duration: 30 }] },
  ]},
  { title: '优秀教案范例精讲：小学语文', coverColor: '#4F7CFF', tags: ['教案', '小学'], learnerCount: 2100, rating: 4.8, catalog: 'skill', category: '优秀教案范例库', instructor: '马琳老师', description: '精选20篇小学语文优秀教案，逐篇解析教学设计思路。', chapters: [
    { title: '第一章 低年级教案范例', lessons: [{ title: '1.1《小蝌蚪找妈妈》教案', videoUrl: '', duration: 25 }, { title: '1.2《曹冲称象》教案', videoUrl: '', duration: 22 }] },
    { title: '第二章 高年级教案范例', lessons: [{ title: '2.1《草船借箭》教案', videoUrl: '', duration: 30 }, { title: '2.2《少年闰土》教案', videoUrl: '', duration: 28 }] },
  ]},
  { title: '名师课堂实录：初中数学', coverColor: '#52C41A', tags: ['实录', '初中'], learnerCount: 1800, rating: 4.9, catalog: 'skill', category: '名师课堂实录', instructor: '名师团队', description: '记录多位名师的真实课堂。', chapters: [
    { title: '第一章 代数专题', lessons: [{ title: '1.1 一元一次方程（张老师）', videoUrl: '', duration: 45 }, { title: '1.2 二次函数（王老师）', videoUrl: '', duration: 42 }] },
    { title: '第二章 几何专题', lessons: [{ title: '2.1 全等三角形（李老师）', videoUrl: '', duration: 40 }, { title: '2.2 圆的性质（赵老师）', videoUrl: '', duration: 38 }] },
  ]},
  { title: '教师资格证笔试全真模拟', coverColor: '#FF6B6B', tags: ['教资', '笔试'], learnerCount: 5600, rating: 4.9, catalog: 'exam', category: '教师资格证', instructor: '备考团队', description: '覆盖科目一综合素质、科目二教育知识与能力。', chapters: [
    { title: '第一章 综合素质', lessons: [{ title: '1.1 教育法律法规', videoUrl: '', duration: 35 }, { title: '1.2 教师职业道德', videoUrl: '', duration: 30 }, { title: '1.3 文化素养', videoUrl: '', duration: 28 }] },
    { title: '第二章 教育知识与能力', lessons: [{ title: '2.1 教育学基础', videoUrl: '', duration: 40 }, { title: '2.2 心理学基础', videoUrl: '', duration: 38 }] },
  ]},
  { title: '教师招聘考试核心考点', coverColor: '#EB2F96', tags: ['教招', '备考'], learnerCount: 3200, rating: 4.8, catalog: 'exam', category: '教师招聘考试', instructor: '备考团队', description: '系统梳理教师招聘考试高频考点。', chapters: [
    { title: '第一章 教育学考点', lessons: [{ title: '1.1 教育目的与制度', videoUrl: '', duration: 30 }, { title: '1.2 课程与教学', videoUrl: '', duration: 35 }] },
    { title: '第二章 心理学考点', lessons: [{ title: '2.1 认知过程', videoUrl: '', duration: 32 }, { title: '2.2 学习理论', videoUrl: '', duration: 28 }] },
  ]},

  // === 11-35: 新增课程 ===
  { title: '普通心理学（北师大精品）', coverColor: '#1890FF', tags: ['大学', '心理学'], learnerCount: 7540, rating: 4.9, catalog: 'resource', category: '大学', subject: '心理学', grade: '', instructor: '陈宝国教授', description: '北京师范大学陈宝国教授主讲，心理学入门经典课程。', chapters: [
    { title: '第一章 心理学概述', lessons: [{ title: '1.1 心理学的对象与方法', videoUrl: '', duration: 40 }, { title: '1.2 心理学的历史', videoUrl: '', duration: 38 }] },
    { title: '第二章 感觉与知觉', lessons: [{ title: '2.1 感觉的一般规律', videoUrl: '', duration: 35 }, { title: '2.2 知觉的特性', videoUrl: '', duration: 42 }] },
  ]},
  { title: '发展心理学', coverColor: '#722ED1', tags: ['大学', '心理学'], learnerCount: 4320, rating: 4.8, catalog: 'resource', category: '大学', subject: '心理学', grade: '', instructor: '李文道教授', description: '系统讲解从婴儿期到老年期的心理发展规律。', chapters: [
    { title: '第一章 发展心理学导论', lessons: [{ title: '1.1 发展心理学研究方法', videoUrl: '', duration: 35 }, { title: '1.2 遗传与环境', videoUrl: '', duration: 30 }] },
    { title: '第二章 婴幼儿心理发展', lessons: [{ title: '2.1 感知觉发展', videoUrl: '', duration: 32 }, { title: '2.2 依恋的形成', videoUrl: '', duration: 28 }] },
  ]},
  { title: '心理统计学', coverColor: '#13C2C2', tags: ['大学', '心理学'], learnerCount: 3680, rating: 4.7, catalog: 'resource', category: '大学', subject: '心理学', grade: '', instructor: '刘红云教授', description: '心理学研究必备的统计学知识。', chapters: [
    { title: '第一章 描述统计', lessons: [{ title: '1.1 集中趋势', videoUrl: '', duration: 30 }, { title: '1.2 离散趋势', videoUrl: '', duration: 28 }] },
    { title: '第二章 推断统计', lessons: [{ title: '2.1 假设检验', videoUrl: '', duration: 35 }, { title: '2.2 方差分析', videoUrl: '', duration: 40 }] },
  ]},
  { title: '心理测量学', coverColor: '#FAAD14', tags: ['大学', '心理学'], learnerCount: 2890, rating: 4.6, catalog: 'resource', category: '大学', subject: '心理学', grade: '', instructor: '张继明教授', description: '心理测量的理论与实践。', chapters: [
    { title: '第一章 测量基本理论', lessons: [{ title: '1.1 信度', videoUrl: '', duration: 30 }, { title: '1.2 效度', videoUrl: '', duration: 32 }] },
    { title: '第二章 常用心理测验', lessons: [{ title: '2.1 智力测验', videoUrl: '', duration: 35 }, { title: '2.2 人格测验', videoUrl: '', duration: 30 }] },
  ]},
  { title: '人格心理学', coverColor: '#F5222D', tags: ['大学', '心理学'], learnerCount: 3120, rating: 4.7, catalog: 'resource', category: '大学', subject: '心理学', grade: '', instructor: '王登峰教授', description: '北京大学王登峰教授主讲，探索人格的本质。', chapters: [
    { title: '第一章 人格理论', lessons: [{ title: '1.1 精神分析理论', videoUrl: '', duration: 38 }, { title: '1.2 人本主义理论', videoUrl: '', duration: 35 }] },
    { title: '第二章 人格评估', lessons: [{ title: '2.1 投射测验', videoUrl: '', duration: 30 }, { title: '2.2 大五人格', videoUrl: '', duration: 32 }] },
  ]},
  { title: '高中语文古诗文教学设计', coverColor: '#2F54EB', tags: ['高中', '语文'], learnerCount: 1670, rating: 4.6, catalog: 'resource', category: '高中', subject: '语文', grade: '', instructor: '周敏老师', description: '高中语文古诗文鉴赏与教学设计方法。', chapters: [
    { title: '第一章 诗歌教学', lessons: [{ title: '1.1 唐诗教学设计', videoUrl: '', duration: 35 }, { title: '1.2 宋词教学设计', videoUrl: '', duration: 30 }] },
    { title: '第二章 文言文教学', lessons: [{ title: '2.1 先秦散文教学', videoUrl: '', duration: 32 }, { title: '2.2 史传文学教学', videoUrl: '', duration: 28 }] },
  ]},
  { title: '小学英语趣味教学法', coverColor: '#36CFC9', tags: ['小学', '英语'], learnerCount: 1450, rating: 4.7, catalog: 'resource', category: '小学', subject: '英语', grade: '', instructor: '杨丹老师', description: '通过歌曲、游戏、绘本等方式激发小学生英语学习兴趣。', chapters: [
    { title: '第一章 歌曲教学法', lessons: [{ title: '1.1 英文儿歌教学', videoUrl: '', duration: 20 }, { title: '1.2 Chant节奏训练', videoUrl: '', duration: 18 }] },
    { title: '第二章 绘本教学法', lessons: [{ title: '2.1 绘本选择与分级', videoUrl: '', duration: 22 }, { title: '2.2 绘本课堂活动设计', videoUrl: '', duration: 25 }] },
  ]},
  { title: '初中物理实验教学指导', coverColor: '#FA541C', tags: ['初中', '物理'], learnerCount: 1320, rating: 4.5, catalog: 'resource', category: '初中', subject: '物理', grade: '', instructor: '孙强老师', description: '初中物理实验的规范操作与教学指导。', chapters: [
    { title: '第一章 力学实验', lessons: [{ title: '1.1 弹簧测力计使用', videoUrl: '', duration: 20 }, { title: '1.2 摩擦力探究', videoUrl: '', duration: 25 }] },
    { title: '第二章 电学实验', lessons: [{ title: '2.1 串并联电路', videoUrl: '', duration: 28 }, { title: '2.2 欧姆定律验证', videoUrl: '', duration: 30 }] },
  ]},
  { title: '高中化学反应原理精讲', coverColor: '#EB2F96', tags: ['高中', '化学'], learnerCount: 1580, rating: 4.6, catalog: 'resource', category: '高中', subject: '化学', grade: '', instructor: '郑峰老师', description: '深入讲解化学反应速率、化学平衡、电化学等核心内容。', chapters: [
    { title: '第一章 化学反应速率', lessons: [{ title: '1.1 影响因素', videoUrl: '', duration: 30 }, { title: '1.2 速率方程', videoUrl: '', duration: 28 }] },
    { title: '第二章 化学平衡', lessons: [{ title: '2.1 平衡常数', videoUrl: '', duration: 32 }, { title: '2.2 Le Chatelier原理', videoUrl: '', duration: 35 }] },
  ]},
  { title: '初中历史思维导图教学', coverColor: '#FADB14', tags: ['初中', '历史'], learnerCount: 890, rating: 4.4, catalog: 'resource', category: '初中', subject: '历史', grade: '', instructor: '吴磊老师', description: '运用思维导图梳理初中历史知识体系。', chapters: [
    { title: '第一章 中国古代史', lessons: [{ title: '1.1 秦汉统一', videoUrl: '', duration: 25 }, { title: '1.2 唐宋变革', videoUrl: '', duration: 30 }] },
    { title: '第二章 中国近现代史', lessons: [{ title: '2.1 鸦片战争到辛亥革命', videoUrl: '', duration: 28 }, { title: '2.2 新民主主义革命', videoUrl: '', duration: 32 }] },
  ]},
  { title: '小学科学探究式教学', coverColor: '#52C41A', tags: ['小学', '科学'], learnerCount: 760, rating: 4.5, catalog: 'resource', category: '小学', subject: '科学', grade: '', instructor: '钱伟老师', description: '引导小学生通过观察、实验、推理进行科学探究。', chapters: [
    { title: '第一章 探究式教学概述', lessons: [{ title: '1.1 探究学习的特征', videoUrl: '', duration: 20 }, { title: '1.2 探究活动设计', videoUrl: '', duration: 22 }] },
    { title: '第二章 典型探究案例', lessons: [{ title: '2.1 植物生长实验', videoUrl: '', duration: 25 }, { title: '2.2 简单电路探究', videoUrl: '', duration: 28 }] },
  ]},
  { title: '高中政治时政热点分析', coverColor: '#1890FF', tags: ['高中', '政治'], learnerCount: 1120, rating: 4.5, catalog: 'resource', category: '高中', subject: '政治', grade: '', instructor: '赵刚老师', description: '结合时政热点解读高中政治教材核心知识。', chapters: [
    { title: '第一章 经济生活', lessons: [{ title: '1.1 供给侧结构性改革', videoUrl: '', duration: 30 }, { title: '1.2 新发展理念', videoUrl: '', duration: 28 }] },
    { title: '第二章 政治生活', lessons: [{ title: '2.1 全过程人民民主', videoUrl: '', duration: 26 }, { title: '2.2 基层治理', videoUrl: '', duration: 25 }] },
  ]},
  { title: '中职电子商务基础', coverColor: '#FA8C16', tags: ['中职', '信息技术'], learnerCount: 650, rating: 4.3, catalog: 'resource', category: '中职', subject: '信息技术', grade: '', instructor: '林萍老师', description: '中等职业学校电子商务专业基础课程。', chapters: [
    { title: '第一章 电商概述', lessons: [{ title: '1.1 电商发展历程', videoUrl: '', duration: 25 }, { title: '1.2 电商模式分类', videoUrl: '', duration: 20 }] },
    { title: '第二章 网店运营', lessons: [{ title: '2.1 商品上架', videoUrl: '', duration: 30 }, { title: '2.2 营销推广', videoUrl: '', duration: 28 }] },
  ]},
  { title: '高职学前教育实训指导', coverColor: '#722ED1', tags: ['高职', '教育学'], learnerCount: 580, rating: 4.4, catalog: 'resource', category: '高职', subject: '教育学', grade: '', instructor: '沈梅老师', description: '高职学前教育专业的实训课程指导。', chapters: [
    { title: '第一章 幼儿园见习', lessons: [{ title: '1.1 观察记录方法', videoUrl: '', duration: 22 }, { title: '1.2 环境创设参与', videoUrl: '', duration: 25 }] },
    { title: '第二章 教学实习', lessons: [{ title: '2.1 活动方案设计', videoUrl: '', duration: 28 }, { title: '2.2 课堂组织技巧', videoUrl: '', duration: 30 }] },
  ]},
  { title: '说课稿撰写技巧精讲', coverColor: '#13C2C2', tags: ['说课', '技能'], learnerCount: 2450, rating: 4.7, catalog: 'skill', category: '说课稿模板库', instructor: '周婷老师', description: '从说教材到说板书，全面掌握说课稿撰写方法。', chapters: [
    { title: '第一章 说课稿结构', lessons: [{ title: '1.1 说教材与说学情', videoUrl: '', duration: 25 }, { title: '1.2 说教法与说学法', videoUrl: '', duration: 28 }] },
    { title: '第二章 说课稿范例', lessons: [{ title: '2.1 小学语文说课稿', videoUrl: '', duration: 30 }, { title: '2.2 初中数学说课稿', videoUrl: '', duration: 32 }] },
  ]},
  { title: '教案设计：初中英语', coverColor: '#F5222D', tags: ['教案', '初中'], learnerCount: 1680, rating: 4.6, catalog: 'skill', category: '优秀教案范例库', instructor: '许敏老师', description: '精选初中英语优秀教案，涵盖听说读写各技能。', chapters: [
    { title: '第一章 听说课教案', lessons: [{ title: '1.1 情景对话课', videoUrl: '', duration: 28 }, { title: '1.2 听力训练课', videoUrl: '', duration: 25 }] },
    { title: '第二章 读写课教案', lessons: [{ title: '2.1 阅读理解课', videoUrl: '', duration: 30 }, { title: '2.2 写作指导课', videoUrl: '', duration: 32 }] },
  ]},
  { title: '名师课堂实录：高中语文', coverColor: '#722ED1', tags: ['实录', '高中'], learnerCount: 1950, rating: 4.8, catalog: 'skill', category: '名师课堂实录', instructor: '名师团队', description: '高中语文名师课堂实录，展示不同课型的教学艺术。', chapters: [
    { title: '第一章 古诗词课堂', lessons: [{ title: '1.1《念奴娇·赤壁怀古》', videoUrl: '', duration: 45 }, { title: '1.2《声声慢》', videoUrl: '', duration: 40 }] },
    { title: '第二章 现代文课堂', lessons: [{ title: '2.1《荷塘月色》', videoUrl: '', duration: 42 }, { title: '2.2《记念刘和珍君》', videoUrl: '', duration: 38 }] },
  ]},
  { title: '教师资格证面试通关攻略', coverColor: '#FAAD14', tags: ['教资', '面试'], learnerCount: 4800, rating: 4.9, catalog: 'exam', category: '教师资格证', instructor: '备考团队', description: '结构化面试 + 试讲 + 答辩全流程指导。', chapters: [
    { title: '第一章 结构化面试', lessons: [{ title: '1.1 常见题型分析', videoUrl: '', duration: 30 }, { title: '1.2 答题模板与技巧', videoUrl: '', duration: 28 }] },
    { title: '第二章 试讲技巧', lessons: [{ title: '2.1 备课20分钟策略', videoUrl: '', duration: 35 }, { title: '2.2 试讲10分钟要点', videoUrl: '', duration: 32 }] },
  ]},
  { title: '教招考试：教育学真题精析', coverColor: '#2F54EB', tags: ['教招', '真题'], learnerCount: 2780, rating: 4.7, catalog: 'exam', category: '教师招聘考试', instructor: '备考团队', description: '历年教师招聘考试教育学真题解析。', chapters: [
    { title: '第一章 选择题精析', lessons: [{ title: '1.1 教育学原理类', videoUrl: '', duration: 30 }, { title: '1.2 课程教学类', videoUrl: '', duration: 28 }] },
    { title: '第二章 主观题精析', lessons: [{ title: '2.1 简答题模板', videoUrl: '', duration: 32 }, { title: '2.2 论述题技巧', videoUrl: '', duration: 35 }] },
  ]},
  { title: '小学道德与法治教学设计', coverColor: '#36CFC9', tags: ['小学', '道德与法治'], learnerCount: 720, rating: 4.4, catalog: 'resource', category: '小学', subject: '道德与法治', grade: '', instructor: '韩静老师', description: '小学道德与法治课程教学设计与案例分析。', chapters: [
    { title: '第一章 低年级教学', lessons: [{ title: '1.1 自我认识主题', videoUrl: '', duration: 20 }, { title: '1.2 家庭生活主题', videoUrl: '', duration: 22 }] },
    { title: '第二章 高年级教学', lessons: [{ title: '2.1 法治意识培养', videoUrl: '', duration: 25 }, { title: '2.2 社会参与主题', videoUrl: '', duration: 28 }] },
  ]},
  { title: '初中地理图表教学法', coverColor: '#FA541C', tags: ['初中', '地理'], learnerCount: 860, rating: 4.5, catalog: 'resource', category: '初中', subject: '地理', grade: '', instructor: '冯刚老师', description: '利用地图、图表等工具提升初中地理教学效果。', chapters: [
    { title: '第一章 地图教学', lessons: [{ title: '1.1 等高线地形图', videoUrl: '', duration: 25 }, { title: '1.2 气候分布图', videoUrl: '', duration: 28 }] },
    { title: '第二章 图表分析', lessons: [{ title: '2.1 人口统计图', videoUrl: '', duration: 22 }, { title: '2.2 经济数据图', videoUrl: '', duration: 25 }] },
  ]},
  { title: '高中生物实验设计与探究', coverColor: '#52C41A', tags: ['高中', '生物'], learnerCount: 1280, rating: 4.6, catalog: 'resource', category: '高中', subject: '生物', grade: '', instructor: '黄磊老师', description: '高中生物实验的设计原理与探究方法。', chapters: [
    { title: '第一章 实验设计原理', lessons: [{ title: '1.1 对照实验设计', videoUrl: '', duration: 28 }, { title: '1.2 变量控制', videoUrl: '', duration: 25 }] },
    { title: '第二章 经典实验', lessons: [{ title: '2.1 光合作用探究', videoUrl: '', duration: 30 }, { title: '2.2 酶的特性实验', videoUrl: '', duration: 32 }] },
  ]},
  { title: '小学音乐律动教学', coverColor: '#EB2F96', tags: ['小学', '音乐'], learnerCount: 640, rating: 4.3, catalog: 'resource', category: '小学', subject: '音乐', grade: '', instructor: '丁雨老师', description: '通过律动、节奏游戏等方式开展小学音乐教学。', chapters: [
    { title: '第一章 节奏训练', lessons: [{ title: '1.1 身体打击乐', videoUrl: '', duration: 18 }, { title: '1.2 节奏模仿', videoUrl: '', duration: 20 }] },
    { title: '第二章 歌唱教学', lessons: [{ title: '2.1 音准训练', videoUrl: '', duration: 22 }, { title: '2.2 合唱入门', videoUrl: '', duration: 25 }] },
  ]},
  { title: '初中美术鉴赏与创作', coverColor: '#7B68EE', tags: ['初中', '美术'], learnerCount: 580, rating: 4.4, catalog: 'resource', category: '初中', subject: '美术', grade: '', instructor: '曹阳老师', description: '初中美术鉴赏课与创作课的教学指导。', chapters: [
    { title: '第一章 美术鉴赏', lessons: [{ title: '1.1 中国画鉴赏', videoUrl: '', duration: 25 }, { title: '1.2 西方绘画鉴赏', videoUrl: '', duration: 28 }] },
    { title: '第二章 创作实践', lessons: [{ title: '2.1 素描基础', videoUrl: '', duration: 30 }, { title: '2.2 色彩表现', videoUrl: '', duration: 32 }] },
  ]},
]

/* ===== 资讯种子数据 (30 条) ===== */
const SEED_NEWS = [
  { title: '2026年春季学期教学工作会议顺利召开', category: '校园新闻', time: '2026-04-15', color: '#4F7CFF', summary: '学校召开2026年春季学期教学工作会议，部署本学期教学重点任务。', content: '4月15日上午，学校在行政楼报告厅召开2026年春季学期教学工作会议。' },
  { title: '关于2026年上半年教师资格考试报名的通知', category: '教务通知', time: '2026-04-14', color: '#EB2F96', summary: '2026年上半年中小学教师资格考试（笔试）报名即将开始。', content: '报名时间：4月20日-4月25日。考试时间：5月18日。' },
  { title: '人工智能赋能教育创新前沿讲座', category: '学术讲座', time: '2026-04-13', color: '#52C41A', summary: '教育学院邀请知名学者开展AI赋能教育创新系列讲座。', content: '主讲人：张教授（北京师范大学）。时间：4月20日 14:30-16:30。' },
  { title: '教育技术协会招新啦！', category: '社团活动', time: '2026-04-12', color: '#FA8C16', summary: '教育技术协会2026年春季招新开始。', content: '招新要求：各年级本科生、研究生均可。报名截止：4月30日。' },
  { title: '学校图书馆延长开放时间通知', category: '校园新闻', time: '2026-04-11', color: '#4F7CFF', summary: '图书馆自本周起延长开放时间至晚间23:00。', content: '周一至周五：7:00-23:00。周六日：8:00-22:00。自习室24小时。' },
  { title: '第三届师范生教学技能大赛报名启动', category: '学术讲座', time: '2026-04-09', color: '#52C41A', summary: '设特等奖奖金3000元。', content: '比赛内容：教学设计 + 模拟授课 + 即兴答辩。报名截止：5月10日。' },
  { title: '教育学院2026年硕士研究生复试安排', category: '教务通知', time: '2026-04-08', color: '#EB2F96', summary: '复试将于4月12-13日进行，请考生准时到场。', content: '复试地点：教育学院A栋3楼。' },
  { title: '关于举办校园心理健康周活动的通知', category: '校园新闻', time: '2026-04-07', color: '#7B68EE', summary: '4月14日-18日开展系列心理健康活动。', content: '活动内容：心理讲座、团体辅导、心理电影展映。' },
  { title: '国际教育技术学术研讨会征稿启事', category: '学术讲座', time: '2026-04-06', color: '#52C41A', summary: '第五届国际教育技术学术研讨会征稿。', content: '投稿截止：6月30日。会议时间：10月15-17日。' },
  { title: '学生社团联合会换届选举公告', category: '社团活动', time: '2026-04-05', color: '#FA8C16', summary: '2026-2027学年学生社团联合会主席团换届。', content: '报名时间：4月5日-4月15日。竞选时间：4月20日。' },
  { title: '2026年春季运动会将于5月举行', category: '校园新闻', time: '2026-04-04', color: '#4F7CFF', summary: '第二十届校运会定于5月10-11日举行。', content: '设径赛、田赛、趣味赛三大类。报名截止4月25日。' },
  { title: '关于办理2026届毕业生学历认证的通知', category: '教务通知', time: '2026-04-03', color: '#EB2F96', summary: '请2026届毕业生及时办理学历认证。', content: '办理时间：4月8日-5月15日。地点：教务处105室。' },
  { title: '教育政策与法规最新解读讲座', category: '学术讲座', time: '2026-04-02', color: '#52C41A', summary: '解读2026年最新教育政策。', content: '主题：双减政策深化与教师角色转变。主讲：李教授。' },
  { title: '青年志愿者协会植树节活动回顾', category: '社团活动', time: '2026-04-01', color: '#FA8C16', summary: '120名志愿者参与植树活动。', content: '共种植树苗200棵，覆盖校园东区绿化带。' },
  { title: '校园一卡通升级为数字校园卡', category: '校园新闻', time: '2026-03-30', color: '#4F7CFF', summary: '4月1日起全面推行数字校园卡。', content: '支持手机NFC和二维码。旧卡可到信息中心换领。' },
  { title: '关于调整2026年暑期校历的通知', category: '教务通知', time: '2026-03-28', color: '#EB2F96', summary: '暑假时间调整为7月5日-8月31日。', content: '期末考试周：6月23日-7月4日。' },
  { title: '脑科学与教育学前沿论坛', category: '学术讲座', time: '2026-03-26', color: '#52C41A', summary: '探讨脑科学研究对教学设计的启示。', content: '报名链接已发布至学院官网。限100人。' },
  { title: '摄影社新生作品展征集', category: '社团活动', time: '2026-03-25', color: '#FA8C16', summary: '以"春日校园"为主题的摄影展征集。', content: '截止日期：4月10日。优秀作品将在图书馆展出。' },
  { title: '食堂新增健康轻食窗口', category: '校园新闻', time: '2026-03-23', color: '#4F7CFF', summary: '二食堂新增轻食窗口，提供沙拉、低脂餐。', content: '营业时间：11:00-13:00，17:00-19:00。' },
  { title: '关于2026年国家奖学金评选的通知', category: '教务通知', time: '2026-03-22', color: '#EB2F96', summary: '2025-2026学年国家奖学金评选工作开始。', content: '申报截止：4月15日。名额：全院12人。' },
  { title: '信息素养与数字公民讲座', category: '学术讲座', time: '2026-03-20', color: '#52C41A', summary: '培养数字时代的信息素养。', content: '内容：信息检索、学术诚信、数字安全。' },
  { title: '话剧社年度大戏《师说》即将上演', category: '社团活动', time: '2026-03-18', color: '#FA8C16', summary: '原创教育主题话剧公演。', content: '演出时间：3月28日19:00。地点：大学生活动中心。免费入场。' },
  { title: '校医院流感疫苗接种通知', category: '校园新闻', time: '2026-03-15', color: '#4F7CFF', summary: '春季流感疫苗免费接种。', content: '时间：3月18日-22日。地点：校医院二楼。' },
  { title: '关于开展教学质量中期检查的通知', category: '教务通知', time: '2026-03-13', color: '#EB2F96', summary: '4月进行中期教学质量检查。', content: '检查内容：课堂教学、实践环节、学生反馈。' },
  { title: '教育人工智能实验室开放日', category: '学术讲座', time: '2026-03-11', color: '#52C41A', summary: 'AI教育实验室首次向全校开放。', content: '可体验：智能批改、虚拟课堂、自适应学习系统。' },
  { title: '环保社举办旧书交换活动', category: '社团活动', time: '2026-03-10', color: '#FA8C16', summary: '以书换书，绿色阅读。', content: '时间：3月15日。地点：图书馆前广场。' },
  { title: '新版培养方案公示', category: '教务通知', time: '2026-03-08', color: '#EB2F96', summary: '2026级本科生培养方案修订完成。', content: '增设AI教育、STEM教育等新方向。公示期至3月20日。' },
  { title: '省级教学成果奖申报启动', category: '校园新闻', time: '2026-03-06', color: '#4F7CFF', summary: '教育学院3项成果拟申报省级教学成果一等奖。', content: '申报截止：4月30日。' },
  { title: '特殊教育专题讲座', category: '学术讲座', time: '2026-03-04', color: '#52C41A', summary: '融合教育背景下的特殊教育实践。', content: '专家：某特教中心资深教师。时间：3月10日14:00。' },
  { title: '乒乓球社春季积分赛开始报名', category: '社团活动', time: '2026-03-02', color: '#FA8C16', summary: '不限年级，团体赛+个人赛。', content: '报名截止：3月12日。比赛时间：3月20日-22日。' },
]

/* ===== 活动种子数据 (25 条) ===== */
const SEED_EVENTS = [
  { title: '人工智能赋能教育创新讲座', category: '讲座', time: '4月20日 14:30', location: '教育学院 A301', organizer: '教育学院', quota: 200, enrolled: 156, color: '#4F7CFF', summary: '北京师范大学张教授主讲。', content: '讲座主题：人工智能赋能教育创新。', deadline: '4月19日 18:00' },
  { title: '第三届师范生教学技能大赛', category: '比赛', time: '5月20日 全天', location: '教学楼 B 区', organizer: '教务处', quota: 100, enrolled: 67, color: '#EB2F96', summary: '特等奖奖金3000元！', content: '教学设计(30%) + 模拟授课(50%) + 即兴答辩(20%)。', deadline: '5月10日 23:59' },
  { title: '乡村教育支教志愿者招募', category: '志愿者', time: '7月1日-7月15日', location: '贵州省黔东南州', organizer: '校团委', quota: 30, enrolled: 22, color: '#52C41A', summary: '暑期支教志愿服务。', content: '往返交通报销 + 食宿 + 证书 + 学分。', deadline: '5月30日 18:00' },
  { title: '教育技术协会2026春季招新', category: '社团招新', time: '4月12日-4月30日', location: '线上报名', organizer: '教育技术协会', quota: 50, enrolled: 35, color: '#FA8C16', summary: '探索AI教育前沿。', content: '技术分享 + 竞赛 + 企业参访。', deadline: '4月30日 23:59' },
  { title: '校园马拉松趣味跑', category: '比赛', time: '4月26日 08:00', location: '校体育场', organizer: '体育部', quota: 500, enrolled: 389, color: '#7B68EE', summary: '5公里趣味跑，完赛奖牌！', content: '彩虹跑道 + 趣味打卡 + 完赛奖牌。', deadline: '4月24日 18:00' },
  { title: '心理健康知识讲座', category: '讲座', time: '4月28日 19:00', location: '学生活动中心', organizer: '心理咨询中心', quota: 300, enrolled: 98, color: '#13C2C2', summary: '学习压力管理和情绪调节。', content: '大学生压力管理 + 放松技巧体验。', deadline: '4月27日 18:00' },
  { title: '教育政策论坛', category: '讲座', time: '5月5日 14:00', location: '学术报告厅', organizer: '教育学院', quota: 150, enrolled: 112, color: '#1890FF', summary: '双减政策深化与教师发展。', content: '政策解读 + 圆桌讨论。', deadline: '5月4日 18:00' },
  { title: '粉笔字书写大赛', category: '比赛', time: '5月8日 14:00', location: '教学楼C201', organizer: '教务处', quota: 80, enrolled: 45, color: '#FF6B6B', summary: '师范生基本功比赛。', content: '硬笔 + 粉笔，评委现场打分。', deadline: '5月5日 23:59' },
  { title: '云南山区支教志愿者招募', category: '志愿者', time: '7月15日-7月30日', location: '云南省丽江市', organizer: '志愿服务中心', quota: 25, enrolled: 18, color: '#52C41A', summary: '为山区儿童带去知识和欢乐。', content: '食宿全包 + 志愿时长认证。', deadline: '6月15日 18:00' },
  { title: '读书社2026春季招新', category: '社团招新', time: '4月15日-4月28日', location: '图书馆门口', organizer: '读书社', quota: 40, enrolled: 28, color: '#FAAD14', summary: '以书会友，共读经典。', content: '每月一次读书分享会。', deadline: '4月28日 23:59' },
  { title: '脑科学与学习讲座', category: '讲座', time: '5月12日 15:00', location: '教育学院 B201', organizer: '脑科学研究所', quota: 120, enrolled: 95, color: '#722ED1', summary: '脑科学视角下的高效学习策略。', content: '记忆的神经机制 + 学习策略优化。', deadline: '5月11日 18:00' },
  { title: '教育创新创业大赛', category: '比赛', time: '5月25日 全天', location: '创客空间', organizer: '创新创业学院', quota: 60, enrolled: 38, color: '#FA541C', summary: '教育科技类项目路演。', content: '项目展示 + 专家点评 + 投资人对接。', deadline: '5月15日 23:59' },
  { title: '甘肃定西暑期支教', category: '志愿者', time: '8月1日-8月15日', location: '甘肃省定西市', organizer: '校团委', quota: 20, enrolled: 15, color: '#52C41A', summary: '第五期暑期支教项目。', content: '语文+数学+英语+美术四科支教。', deadline: '6月30日 18:00' },
  { title: '辩论社新学期招新', category: '社团招新', time: '4月10日-4月25日', location: '线上+线下', organizer: '辩论社', quota: 30, enrolled: 22, color: '#F5222D', summary: '唇枪舌剑，思辨人生。', content: '新生培训 + 校际交流赛。', deadline: '4月25日 23:59' },
  { title: '特殊教育专题研讨会', category: '讲座', time: '5月18日 09:00', location: '行政楼报告厅', organizer: '特殊教育系', quota: 100, enrolled: 67, color: '#13C2C2', summary: '融合教育的实践与反思。', content: '主题报告 + 案例分享 + 工作坊。', deadline: '5月16日 18:00' },
  { title: '数学建模竞赛校内选拔', category: '比赛', time: '5月30日 09:00', location: '计算中心', organizer: '数学学院', quota: 90, enrolled: 56, color: '#2F54EB', summary: '选拔参加全国赛选手。', content: '3人一队，72小时完成建模论文。', deadline: '5月20日 23:59' },
  { title: '社区义教志愿者招募', category: '志愿者', time: '每周六 14:00-16:00', location: '校外社区中心', organizer: '志愿服务中心', quota: 15, enrolled: 12, color: '#52C41A', summary: '为社区儿童辅导功课。', content: '可获志愿时长认证，持续至学期末。', deadline: '长期有效' },
  { title: '话剧社2026招新', category: '社团招新', time: '4月8日-4月22日', location: '大学生活动中心', organizer: '话剧社', quota: 35, enrolled: 30, color: '#EB2F96', summary: '演绎精彩人生。', content: '社团排演 + 学期汇演 + 校外演出。', deadline: '4月22日 23:59' },
  { title: '课堂观察方法论讲座', category: '讲座', time: '6月2日 14:00', location: '教育学院 A201', organizer: '教育学院', quota: 80, enrolled: 34, color: '#4F7CFF', summary: '系统学习课堂观察技术。', content: '量化观察 + 质性分析 + 实操演练。', deadline: '6月1日 18:00' },
  { title: '英语演讲比赛', category: '比赛', time: '6月8日 14:00', location: '外语楼报告厅', organizer: '外语学院', quota: 50, enrolled: 32, color: '#36CFC9', summary: 'Education in the AI Era.', content: '3分钟主题演讲 + 2分钟即兴问答。', deadline: '5月30日 23:59' },
  { title: '助老志愿服务', category: '志愿者', time: '每周日 09:00-11:00', location: '阳光敬老院', organizer: '青年志愿者协会', quota: 10, enrolled: 8, color: '#52C41A', summary: '陪伴老人，传递温暖。', content: '健康讲座 + 文艺表演 + 聊天陪伴。', deadline: '长期有效' },
  { title: '摄影社2026招新', category: '社团招新', time: '4月5日-4月20日', location: '线上报名', organizer: '摄影社', quota: 25, enrolled: 19, color: '#FAAD14', summary: '用镜头记录世界。', content: '摄影教学 + 外拍活动 + 年度影展。', deadline: '4月20日 23:59' },
  { title: '教育技术前沿论坛', category: '讲座', time: '6月15日 09:00', location: '学术报告厅', organizer: '教育技术系', quota: 200, enrolled: 145, color: '#722ED1', summary: 'VR/AR/元宇宙在教育中的应用。', content: '主题演讲 + 技术体验 + 圆桌对话。', deadline: '6月13日 18:00' },
  { title: '教学微视频制作大赛', category: '比赛', time: '6月20日 全天', location: '多媒体中心', organizer: '教务处', quota: 60, enrolled: 28, color: '#FA8C16', summary: '5分钟微课展示教学创意。', content: '视频制作 + 现场答辩。', deadline: '6月10日 23:59' },
  { title: '环保社暑期河流调查招募', category: '志愿者', time: '7月10日-7月20日', location: '长江中游段', organizer: '环保社', quota: 15, enrolled: 9, color: '#52C41A', summary: '水质检测与生态调查。', content: '抽样检测 + 数据记录 + 研究报告。', deadline: '6月20日 18:00' },
]

/* ===== 工具函数 ===== */
async function safeCount(col) {
  try { const res = await db.collection(col).count(); if (res.code) return 0; return res.total ?? 0 } catch { return 0 }
}
async function safeGet(col, limit = 200) {
  try { const res = await db.collection(col).limit(limit).get(); if (res.code) return []; return res.data || [] } catch { return [] }
}
async function safeRemove(col, docId) {
  try { const res = await db.collection(col).doc(docId).remove(); return !res.code } catch { return false }
}
async function safeAdd(col, data) {
  const res = await db.collection(col).add(data)
  if (res && res.code) { console.warn(`[auto-seed] 写入 ${col} 失败:`, res.code, res.message); return false }
  return true
}

export async function ensureSeedData() {
  if (localStorage.getItem(SEED_FLAG)) return
  try {
    await login()

    // 检测坏数据
    const probeData = await safeGet('courses', 5)
    const hasBadData = probeData.length > 0 && probeData.some(d => !d.title)
    if (hasBadData) {
      console.log('[auto-seed] 检测到坏数据，全量清理…')
      for (const col of ['banners', 'courses', 'news', 'events']) {
        const all = await safeGet(col)
        for (const doc of all) await safeRemove(col, doc._id)
      }
    }

    const [bCount, cCount, nCount, eCount] = await Promise.all([
      safeCount('banners'), safeCount('courses'), safeCount('news'), safeCount('events'),
    ])

    if (cCount > 0 || nCount > 0 || eCount > 0 || bCount > 0) {
      const recheck = await safeGet('courses', 1)
      if (recheck.length > 0 && recheck[0].title) {
        await ensureAdmin()
        localStorage.setItem(SEED_FLAG, '1')
        return
      }
    }

    console.log('[auto-seed] 写入大量示例数据…')
    const now = new Date().toISOString()

    for (const b of SEED_BANNERS) {
      await safeAdd('banners', { ...b, createdAt: now, updatedAt: now })
    }
    for (const c of SEED_COURSES) {
      const lessonCount = c.chapters.reduce((s, ch) => s + ch.lessons.length, 0)
      await safeAdd('courses', { ...c, lessonCount, coverImage: '', enabled: true, createdAt: now, updatedAt: now })
    }
    for (const n of SEED_NEWS) {
      await safeAdd('news', { ...n, enabled: true, createdAt: now, updatedAt: now })
    }
    for (const e of SEED_EVENTS) {
      await safeAdd('events', { ...e, enabled: true, createdAt: now, updatedAt: now })
    }

    await ensureAdmin()
    localStorage.setItem(SEED_FLAG, '1')
    console.log('[auto-seed] ✅ 大量示例数据写入完成（banners:' + SEED_BANNERS.length + ', courses:' + SEED_COURSES.length + ', news:' + SEED_NEWS.length + ', events:' + SEED_EVENTS.length + '）')
  } catch (err) {
    console.warn('[auto-seed] 自动播种失败:', err.message || err)
  }
}

async function ensureAdmin() {
  try {
    const existing = await safeGet('admins', 1)
    if (existing.length > 0) return
    const now = new Date().toISOString()
    await safeAdd('admins', { ...DEFAULT_ADMIN, createdAt: now, updatedAt: now })
    console.log('[auto-seed] ✅ 默认管理员账号已创建 (admin / admin123)')
  } catch (e) {
    console.warn('[auto-seed] 管理员账号创建失败:', e.message || e)
  }
}