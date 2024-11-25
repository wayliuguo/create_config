const fs = require('fs')
const axios = require('axios')
const { getRegisterConfig } = require('../getConfig')

// 公共配置对象，包含配置文件路径、请求负载的公共配置以及插件函数列表等信息
let commonConfig = {}

// 读取配置文件的函数，读取指定路径的配置文件并解析为JavaScript对象返回
function readConfigFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8')
        return JSON.parse(data)
    } catch (error) {
        console.error('读取配置文件出错:', error)
        throw error
    }
}

// 调用接口的函数，根据配置生成请求负载并发起接口调用，处理接口调用结果
async function callApi(config) {
    const { apiUrl, cookie, authorization } = commonConfig
    const instance = axios.create({
        headers: {
            Cookie: cookie,
            Authorization: authorization
        }
    })

    const payloadItems = config.map(item => {
        return commonConfig.plugins.reduce((acc, plugin) => {
            const result = plugin(item)
            return {
                ...acc,
                ...result
            }
        }, {})
    })

    try {
        for (const payloadItem of payloadItems) {
            console.log('接口调用参数:', payloadItem)
            const response = await instance.post(apiUrl, payloadItem)
            console.log(`接口调用结果（${payloadItem.metric}）:`, response.data)
        }
    } catch (error) {
        console.error('接口调用出错:', error)
    }
}

// 主函数，读取配置文件并调用接口调用函数
function register() {
    commonConfig = getRegisterConfig()
    const configFilePath = commonConfig.configFilePath
    const config = readConfigFile(configFilePath)
    callApi(config)
}

module.exports = {
    register
}
