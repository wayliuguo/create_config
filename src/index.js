#!/usr/bin/env node

// 文档链接：https://github.com/tj/commander.js/blob/master/Readme_zh-CN.md
const { program } = require('commander')

// 定义 init 命令
program
    .command('init')
    .description('初始化配置文件')
    .action(() => {
        const { generateTemplate, generateRegisterTemplate } = require('./generateTemplate')
        generateTemplate()
        generateRegisterTemplate()
    })

program
    .command('create')
    .description('生成配置文件')
    .action(() => {
        const { crateConfig } = require('./createConfig')
        crateConfig()
    })

program
    .command('register')
    .description('注册指标')
    .action(() => {
        const { register } = require('./register')
        register()
    })

// 解析命令行参数
program.parse(process.argv)
