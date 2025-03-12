const fs = require('fs')
const axios = require('axios')
const { getSqlConfig } = require('../getConfig')
const config = getSqlConfig()

const requestPayload = []

async function callApi() {
    if (!config.enableAutoRegister) {
        return
    }
    console.log('启用了调用接口自动注册监控规则，正在自动注册监控规则')

    const { payLoadCommonConfig = {} } = config
    const { processApiUrl, apiMethod = 'post', authorization = '', cookie = '' } = payLoadCommonConfig
    const instance = axios.create({
        headers: {
            Cookie: cookie,
            Authorization: authorization
        }
    })

    try {
        const response = await instance[apiMethod](processApiUrl(payLoadCommonConfig), requestPayload)
        console.log(`接口调用结果:`, response.data)
    } catch (error) {
        console.error('接口调用出错:', error)
    }
}

function createSqlHandler() {
    let text = ''

    const { list, payLoadCommonConfig = {} } = config
    const { defaultPayload } = payLoadCommonConfig
    list.forEach(item => {
        const { molecular, denominator } = item
        text += `-----------${molecular}/${denominator}---------\n`
        const { thresholdList = [] } = item
        thresholdList.forEach(thresholdItem => {
            const { replacePayload } = thresholdItem
            const processTemplateText = item.processTemplateText || config.processTemplateText
            const prom_ql = processTemplateText(config, {
                ...item,
                ...thresholdItem
            })
            requestPayload.push({
                ...defaultPayload,
                ...replacePayload,
                prom_ql
            })
            text += prom_ql
            text += '\n'
        })
        text += '\n'
    })
    return text
}

function createRule() {
    const textContent = createSqlHandler()
    const outputFilePath = 'rule.txt'
    fs.writeFileSync(outputFilePath, textContent, 'utf8')
    console.log(`文本已生成: ${outputFilePath}`)

    // 调用接口注册规则
    callApi()
}

module.exports = {
    createRule
}
