import { Column } from './types';

export const INITIAL_DATA: Column[] = [
  {
    id: 'col-1',
    title: '待办',
    accentColor: 'bg-gray-700',
    iconType: 'todo',
    tasks: [
      {
        id: 't-1',
        title: '背诵50个新单词',
        hasRedDot: true,
        tags: [
          { label: '词汇', color: 'purple' },
          { label: '背诵', color: 'pink' },
        ],
        date: '11-27 09:55',
        statusBadge: { text: '待办', type: 'todo' },
      },
      {
        id: 't-2',
        title: '练习新技能',
        hasRedDot: true,
        imageUrl: 'https://picsum.photos/400/200?random=1', // Placeholder for code image
        tags: [
          { label: '练习', color: 'blue' }
        ],
        date: '11-27 09:55',
        statusBadge: { text: '待办', type: 'todo' },
      },
    ],
  },
  {
    id: 'col-2',
    title: '进行中',
    accentColor: 'bg-orange-500',
    iconType: 'progress',
    tasks: [
      {
        id: 't-3',
        title: '设计项目架构',
        hasRedDot: true,
        imageUrl: 'https://picsum.photos/400/300?random=2', // Placeholder for chart
        tags: [
          { label: '设计', color: 'purple' },
          { label: '架构', color: 'cyan' },
        ],
        date: '11-27 09:55',
        statusBadge: { text: '完成', type: 'done' }, // Screenshot shows a green badge here surprisingly, or maybe I misread. Copying visual style.
      },
    ],
  },
  {
    id: 'col-3',
    title: '完成',
    accentColor: 'bg-green-500',
    iconType: 'done',
    tasks: [
      {
        id: 't-4',
        title: '听播客30分钟',
        hasRedDot: true,
        tags: [
          { label: '听力', color: 'blue' },
          { label: '播客', color: 'pink' },
        ],
        date: '11-27 09:55',
        statusBadge: { text: '完成', type: 'done' },
      },
      {
        id: 't-5',
        title: '编写单元测试',
        hasRedDot: true,
        tags: [
            { label: '测试', color: 'purple' },
            { label: '质量', color: 'pink' }
        ],
        date: '11-27 09:55',
        statusBadge: { text: '待办', type: 'todo' },
      }
    ],
  },
  {
    id: 'col-4',
    title: '日常管理',
    accentColor: 'bg-gray-500',
    iconType: 'manage',
    tasks: [
      {
        id: 't-6',
        title: '整理学习笔记',
        hasRedDot: true,
        tags: [
          { label: '整理', color: 'cyan' },
          { label: '笔记', color: 'pink' },
        ],
        date: '11-27 09:55',
        statusBadge: { text: '待办', type: 'todo' },
      },
      {
        id: 't-7',
        title: '运动锻炼',
        hasRedDot: true,
        tags: [
          { label: '运动', color: 'orange' },
          { label: '健康', color: 'green' },
        ],
        date: '11-27 09:55',
        statusBadge: { text: '待办', type: 'todo' },
      },
    ],
  },
];
