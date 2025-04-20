import type { GamePreset } from '../types';

// 游戏预设数据
export const gamePresets: GamePreset[] = [
  {
    id: 'snake',
    name: '贪吃蛇',
    description: '经典的贪吃蛇游戏，使用方向键控制蛇移动，吃到食物后蛇身变长。',
    prompt: '创建一个经典的贪吃蛇游戏，使用HTML5 Canvas实现。游戏应该包含以下功能：\n1. 蛇可以使用{controlType}控制移动\n2. 随机生成食物，蛇吃到食物后身体变长{growLength}\n3. 碰到墙壁或自己的身体游戏结束\n4. 显示当前得分\n5. 游戏结束后可以重新开始\n6. 有简洁美观的UI设计',
    icon: '🐍',
    configOptions: [
      {
        id: 'controlType',
        label: '控制方式',
        type: 'select',
        defaultValue: '方向键或WASD',
        options: [
          { value: '方向键或WASD', label: '方向键或WASD' },
          { value: '仅方向键', label: '仅方向键' },
          { value: '仅WASD', label: '仅WASD' }
        ]
      },
      {
        id: 'growLength',
        label: '每次增长长度',
        type: 'number',
        defaultValue: 1,
        placeholder: '输入每次吃到食物增长的长度'
      }
    ]
  },
  {
    id: '2048',
    name: '2048',
    description: '数字合成游戏，通过方向键移动数字方块，相同数字合并，目标是得到2048。',
    prompt: '创建一个2048游戏，使用HTML、CSS和JavaScript实现。游戏应该包含以下功能：\n1. {gridSize}的游戏网格\n2. 使用方向键控制所有方块的移动\n3. 相同数字的方块碰撞后合并为它们的和\n4. 每次移动后在空白位置随机生成一个{newTileValue}\n5. 显示当前得分\n6. 当达到2048或无法移动时游戏结束\n7. 游戏结束后可以重新开始\n8. 有简洁美观的UI设计',
    icon: '🎮',
    configOptions: [
      {
        id: 'gridSize',
        label: '游戏网格大小',
        type: 'select',
        defaultValue: '4x4',
        options: [
          { value: '3x3', label: '3x3' },
          { value: '4x4', label: '4x4' },
          { value: '5x5', label: '5x5' }
        ]
      },
      {
        id: 'newTileValue',
        label: '新方块数值',
        type: 'select',
        defaultValue: '2或4',
        options: [
          { value: '2或4', label: '2或4' },
          { value: '仅2', label: '仅2' }
        ]
      }
    ]
  },
  {
    id: 'tetris',
    name: '俄罗斯方块',
    description: '经典的俄罗斯方块游戏，控制不同形状的方块下落并填满一行消除得分。',
    prompt: '创建一个经典的俄罗斯方块游戏，使用HTML5 Canvas实现。游戏应该包含以下功能：\n1. 随机生成不同形状的方块\n2. 使用{controlType}控制方块移动和旋转\n3. 方块可以左右移动和加速下落\n4. 当一行填满时，该行消除并得分{scorePerLine}\n5. 显示当前得分和下一个方块\n6. 当方块堆到顶部时游戏结束\n7. 游戏结束后可以重新开始\n8. 有简洁美观的UI设计',
    icon: '🧱',
    configOptions: [
      {
        id: 'controlType',
        label: '控制方式',
        type: 'select',
        defaultValue: '方向键',
        options: [
          { value: '方向键', label: '方向键' },
          { value: 'WASD', label: 'WASD' },
          { value: '方向键和WASD', label: '方向键和WASD' }
        ]
      },
      {
        id: 'scorePerLine',
        label: '每行得分',
        type: 'number',
        defaultValue: 100,
        placeholder: '输入每消除一行的得分'
      }
    ]
  },
  {
    id: 'flappy-bird',
    name: 'Flappy Bird',
    description: '控制小鸟飞行，躲避管道障碍物，尽可能飞得更远。',
    prompt: '创建一个Flappy Bird游戏，使用HTML5 Canvas实现。游戏应该包含以下功能：\n1. {controlType}使小鸟向上飞行\n2. 随机生成不同高度的管道障碍物\n3. 小鸟需要穿过管道之间的缝隙\n4. 碰到管道或地面游戏结束\n5. 显示当前得分（通过的管道数）\n6. 游戏结束后可以重新开始\n7. 有简洁美观的UI设计\n8. 小鸟的飞行速度{flySpeed}\n9. 可以选择游戏难度，{difficultyLevels}\n10. 失败可以重试\n',
    icon: '🐦',
    configOptions: [
      {
        id: 'controlType',
        label: '控制方式',
        type: 'select',
        defaultValue: '点击屏幕或按空格键',
        options: [
          { value: '点击屏幕或按空格键', label: '点击屏幕或按空格键' },
          { value: '仅点击屏幕', label: '仅点击屏幕' },
          { value: '仅按空格键', label: '仅按空格键' }
        ]
      },
      {
        id: 'flySpeed',
        label: '飞行速度',
        type: 'select',
        defaultValue: '很慢，简单难度越简单越好',
        options: [
          { value: '很慢，简单难度越简单越好', label: '很慢（简单）' },
          { value: '适中', label: '适中（中等）' },
          { value: '较快', label: '较快（困难）' }
        ]
      },
      {
        id: 'difficultyLevels',
        label: '难度级别',
        type: 'select',
        defaultValue: '简单、中等或困难',
        options: [
          { value: '简单、中等或困难', label: '全部难度' },
          { value: '仅简单', label: '仅简单' },
          { value: '仅简单和中等', label: '简单和中等' }
        ]
      }
    ]
  },
  {
    id: 'custom',
    name: '自定义游戏',
    description: '创建您自己定义的游戏，可以自由设置游戏类型和规则。',
    prompt: '请根据以下描述创建一个HTML5游戏：',
    icon: '🎯'
  }
];