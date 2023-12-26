export default [
  {path: '/chart', name: '智能分析图表', icon: 'pieChart',
    hideChildrenInMenu: false,
    routes: [
      {path: '/chart/add', name: '分析图表(同步)', component: './Chart/AddChart'},
      {path: '/chart/add_async', name: '分析图表(异步)', component: './Chart/AddChartAsync'},
      {path: '/chart/info/:id', component: './Chart/MyChartInfo', name: '查看图表', hideInMenu: true, },
    ]},
  {path: '/my_result', name: '智能分析结果', icon: 'barChart',
    hideChildrenInMenu: false,
    routes: [
      {path: '/my_result/my_chart',name: '我的图表', component: './My/MyChart'},
    ]},
  {
    path: '/ai_question',
    name: 'AI 助手',
    icon: 'MessageOutlined',
    routes: [
      { path: '/ai_question/assistant', name: 'AI 提问', icon: 'smile', component: './AiChatAssistant/AddChat' },
      { path: '/ai_question/history', name: 'AI 解答', icon: 'smile', component: './AiChatAssistant/AiChatManage' },
      { path: '/ai_question/aiIntelligent', name: '讯飞 AI', icon: 'smile', component: './AiChatAssistant/AddXunFeiAiChat' },
      { path: '/ai_question/xunfei_history', name: '讯飞 解答', icon: 'smile', component: './AiChatAssistant/XunFeiAiChatManage' },
    ],
  },
  { path: '/add_image', name: '图片分析', icon: 'barChart', component: './Image' },
  {
    path: '/person',
    icon: 'UserOutlined',
    name: "个人中心",
    routes: [
      { path: '/person/user_info', name: '个人信息', component: './User/UserInfo/' }
    ],
  },
  {
    path: '/user',
    layout: false,
    name: '登录注册',
    routes: [
      {
        path: '/user', routes: [
          {name: '登录', path: '/user/login', component: './User/Login'},
          {name: '注册', path: '/user/register', component: './User/Register'},
        ]
      },
      {component: './404'},
    ],
  },
  {
    path: '/admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', name: '管理页面', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', name: '管理页面2', component: './Admin' },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
  { path: '/welcome', icon: 'smile', component: './Welcome' },
];
