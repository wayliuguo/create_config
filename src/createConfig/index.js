const fs = require('fs')
const path = require('path')
const { getConfig } = require('../getConfig')

// 配置项
let config = {}

// 生成 JSON 配置项
function generateConfigItems(config, isInit) {
    return config.eventPosSuffixes.map(item => {
        const { eventPosSuffixes: suffix, desc } = item
        const res = {
            lsMetric: `${config.lsMetricPrefix}${suffix.toLowerCase()}`,
            eventPos: `${config.eventPosPrefix}${suffix}`,
            module: 'business_log',
            method: `${config.eventPosPrefix}${suffix}`,
            otherConfigInfo: '',
            distincts: ['uid']
        }
        if (isInit) {
            res.desc = `${config.descPrefix}${desc}`
        }
        return res
    })
}

// 保存 JSON 文件
function saveJsonFile(fileName, data) {
    const filePath = path.join(process.cwd(), fileName)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
    console.log(`JSON file saved to: ${filePath}`)
}

// 生成hippo配置文件
function generateHippoConfig() {
    const configItems = generateConfigItems(config)
    saveJsonFile(config.hippoConfigName, configItems)
}

// 生成初始化配置文件
function generateInitConfig() {
    const configItems = generateConfigItems(config, true)
    saveJsonFile(config.registerConfigName, configItems)
}

// 主函数
function crateConfig() {
    config = getConfig()
    generateHippoConfig()
    generateInitConfig()
}

module.exports = {
    crateConfig
}
