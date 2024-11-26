#!/usr/bin/env node

// 文档链接：https://github.com/tj/commander.js/blob/master/Readme_zh-CN.md
const { program } = require('commander')

// 定义 init 命令
program
    .command('init')
    .description('初始化配置文件')
    .action(async () => {
        const { generateTemplate, generateRegisterTemplate, generateSqlTemplate } = require('./generateTemplate')
        generateTemplate()
        generateRegisterTemplate()
        generateSqlTemplate()
        console.log('-----------------')
        console.log('可执行命令：create_config create 生成指标配置文件')
        console.log('-----------------')
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

program
    .command('sql')
    .description('生成sql')
    .action(() => {
        const { createSql } = require('./createSql')
        createSql()
    })

// 解析命令行参数
program.parse(process.argv)
