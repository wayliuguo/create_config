const fs = require('fs')
const path = require('path')
const { getConfig } = require('../getConfig')

// 配置项
let config = {}

// 生成 JSON 配置项
function generateConfigItems(config, isInit) {
    return config.uniqueEventPosSuffixes.map(item => {
        const { eventPosSuffixes: suffix, desc, tags = [] } = item
        const res = {
            lsMetric: `${config.lsMetricPrefix}${suffix.toLowerCase()}`,
            eventPos: `${config.eventPosPrefix}${suffix}`,
            module: 'business_log',
            method: `${config.eventPosPrefix}${suffix}`,
            otherConfigInfo: '',
            distincts: ['uid'],
            tags
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

function getUniEventPosSuffixes() {
    config.uniqueEventPosSuffixes = []
    const seenEventPosSuffixes = new Set()
    config.eventPosSuffixes.forEach(item => {
        const { eventPosSuffixes } = item
        if (!seenEventPosSuffixes.has(eventPosSuffixes)) {
            // 如果当前的eventPosSuffixes值没出现过，添加到去重结果数组中
            config.uniqueEventPosSuffixes.push(item)
            // 同时将该值添加到Set中，标记为已出现过
            seenEventPosSuffixes.add(eventPosSuffixes)
        }
    })
}

// 主函数
function crateConfig() {
    config = getConfig()
    getUniEventPosSuffixes()
    generateHippoConfig()
    generateInitConfig()
    console.log('hippoConfig.json 用于配置hippo，可拷贝用于hippo配置')
    console.log('registerConfig.json 用于指标注册，可执行create_config register命令进行指标注册')
}

module.exports = {
    crateConfig
}
