const fs = require('fs')
const { getSqlConfig } = require('../getConfig')

// 公共配置对象，包含配置文件路径、请求负载的公共配置以及插件函数列表等信息
let commonConfig = {}

function generateSql(config) {
    const { lsMetricPrefix, list } = config
    let text = ''
    list.forEach(item => {
        const metricMolecular = `${lsMetricPrefix}${item.molecular.toLowerCase()}${item.molecularSuffix?.toLowerCase()}`
        const metricDenominator = `${lsMetricPrefix}${item.denominator.toLowerCase()}${item.denominatorSuffix?.toLowerCase()}`

        text += `(sum(sum_over_time(${metricMolecular}{}[30m] offset 1d)) / sum(sum_over_time(${metricDenominator}{}[30m] offset 1d))) - (sum(sum_over_time(${metricMolecular}{}[30m])) / sum(sum_over_time(${metricDenominator}{}[30m]))) >= sum(sum_over_time(${metricMolecular}{}[30m] offset 1d)) / sum(sum_over_time(${metricDenominator}{}[30m] offset 1d)) * 0.2 and sum(sum_over_time(${metricDenominator}{}[30m])) > ${item.minimumAbsoluteValue}\n`
        text += `(sum(sum_over_time(${metricMolecular}{}[30m] offset 1d)) / sum(sum_over_time(${metricDenominator}{}[30m] offset 1d))) - (sum(sum_over_time(${metricMolecular}{}[30m])) / sum(sum_over_time(${metricDenominator}{}[30m]))) >= sum(sum_over_time(${metricMolecular}{}[30m] offset 1d)) / sum(sum_over_time(${metricDenominator}{}[30m] offset 1d)) * 0.5 and sum(sum_over_time(${metricDenominator}{}[30m])) > ${item.minimumAbsoluteValue}\n`
        text += `(sum(sum_over_time(${metricMolecular}{}[30m] offset 1d)) / sum(sum_over_time(${metricDenominator}{}[30m] offset 1d))) - (sum(sum_over_time(${metricMolecular}{}[30m])) / sum(sum_over_time(${metricDenominator}{}[30m]))) >= sum(sum_over_time(${metricMolecular}{}[30m] offset 1d)) / sum(sum_over_time(${metricDenominator}{}[30m] offset 1d)) * 0.8 and sum(sum_over_time(${metricDenominator}{}[30m])) > ${item.minimumAbsoluteValue}\n`
        text += `sum(sum_over_time(${metricDenominator}{}[30m])) > ${item.minimumAbsoluteValue}\n`
    })
    return text
}

// 主函数
function createSql() {
    commonConfig = getSqlConfig()
    const textContent = generateSql(commonConfig)
    const outputFilePath = 'sql.txt'
    fs.writeFileSync(outputFilePath, textContent, 'utf8')
    console.log(`文本文件已生成: ${outputFilePath}`)
}

module.exports = {
    createSql
}
