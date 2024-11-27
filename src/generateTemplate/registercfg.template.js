const commonConfig = {
    configFilePath: 'registerConfig.json', // 这里填写你的配置文件实际路径
    apiUrl: 'https://eye.oa.fenqile.com/api/n9e/metric-manage',
    payloadConfig: {
        app: 'lexin_big_front_kafka_consumer', // app-固定
        business_line: '现金', // 业务线
        data_type: 0,
        enable: true // 是否启用
    },
    authorization: '',
    cookie: ''
}

// 生成请求负载（payload）的函数，根据配置和公共配置合并生成具体的请求负载内容
function generatePayload(config) {
    const { payloadConfig } = commonConfig
    return {
        ...payloadConfig,
        metric: config.lsMetric,
        desc: config.desc
    }
}

module.exports = {
    ...commonConfig,
    plugins: [generatePayload]
}
