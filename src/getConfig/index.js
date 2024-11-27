const fs = require('fs')
const path = require('path')

// 向上探查最近文件目录
function findNearestFile(fileName, startDir = process.cwd()) {
    let currentDir = startDir

    // 如果还不是根目录，则向上探查文件
    while (currentDir !== path.parse(currentDir).root) {
        // 拼接当前目标文件路径
        const filePath = path.join(currentDir, fileName)

        // 如果已经找到，则返回
        if (fs.existsSync(filePath)) {
            return filePath
        }

        // 移动到上一级目录
        currentDir = path.dirname(currentDir)
    }

    // 检查根目录
    const rootFilePath = path.join(currentDir, fileName)
    if (fs.existsSync(rootFilePath)) {
        return rootFilePath
    }

    return null // 如果没有找到文件，返回 null
}

// 获取配置文件
function getConfig() {
    const configPath = findNearestFile('createcfg.js')
    return require(configPath)
}

function getRegisterConfig() {
    const configPath = findNearestFile('registercfg.js')
    return require(configPath)
}

function getSqlConfig() {
    const configPath = findNearestFile('rule.js')
    return require(configPath)
}

module.exports = {
    getConfig,
    getRegisterConfig,
    getSqlConfig
}
