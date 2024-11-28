// 默认接口payload，可以复制请求的payload，然后根据自己的需求修改
const defaultPayload = {
    name: '规则标题', // 规则标题（必填），可在thresholdList的name中指定
    note: 'hippo配置key：kafka_record_config_xfjr', // 规则备注 （必填）
    severity: 3, // 告警级别（必填）
    rule_type: 1, // 告警类型（必填）
    prom_source_id: 0,
    cluster: '$all', // 生效集群（必填）
    businessLineId: '5', // 规则所属业务线ID（必填）
    businessLine: '现金', //规则所属产品线（必填）
    conditionMode: 'high', // 告警规则（必填）
    // 会根据配置重新生成
    prom_ql:
        '(sum(sum_over_time(fql_xj_cash_index_order_confirm_click_uid{}[30m] offset 1d)) / sum(sum_over_time(fql_xj_cash_index_page_btn_show_uid{}[30m] offset 1d))) - (sum(sum_over_time(fql_xj_cash_index_order_confirm_click_uid{}[30m])) / sum(sum_over_time(fql_xj_cash_index_page_btn_show_uid{}[30m]))) >= sum(sum_over_time(fql_xj_cash_index_order_confirm_click_uid{}[30m] offset 1d)) / sum(sum_over_time(fql_xj_cash_index_page_btn_show_uid{}[30m] offset 1d)) * 0.2 and sum(sum_over_time(fql_xj_cash_index_page_btn_show_uid{}[30m])) > 1100',
    multi_enable: 0,
    enable_recover_value: false,
    recover_trigger_value: 0,
    prom_eval_interval: 60,
    prom_for_duration: 60,
    enable_status: false,
    enable_days_of_week: ['1', '2', '3', '4', '5', '6', '0'],
    enable_stime: '00:00',
    enable_etime: '23:59',
    enable_in_bg: 0,
    notify_channels: ['wecom'], // 通知媒介（必填）
    notify_recovered: 1,
    recover_duration: 0,
    notify_repeat_step: 5,
    notify_max_number: 2,
    callbacks: [null],
    notify_close: 0,
    notify_groups: ['242'],
    notify_owner: 1,
    notify_app_owner: 1,
    notify_manager: 0,
    notify_host_app_owner: 0,
    disabled: 0,
    notify_order: ['2', '3', '4', '5', '6']
}

const config = {
    // 是否需要启用自动调用接口自动注册监控规则，如果为false则只生成配置文件不调用接口
    enableAutoRegister: false,

    // 以下是请求接口的配置项
    payLoadCommonConfig: {
        // 请求接口的配置项，这里会取下方的groupId和categoryId的值作为完整的接口
        apiUrl: 'https://eye.oa.fenqile.com/api/n9e/busi-group/${groupId}/category/${categoryId}/alert-rules',
        groupId: '', // 业务组ID(必填), 可以用206进行测试
        categoryId: '', // 分类ID(必填)，可以用1152进行测试
        apiMethod: 'post', // 请求方法（必填）
        // 接口链接处理函数，用于处理接口链接，这里会取上方的groupId和categoryId的值作为完整的接口
        processApiUrl: function (payLoadCommonConfig) {
            return payLoadCommonConfig.apiUrl
                .replace('${groupId}', payLoadCommonConfig.groupId)
                .replace('${categoryId}', payLoadCommonConfig.categoryId)
        },
        authorization: '', // 授权信息（必填）
        cookie: '', // cookie信息（必填）
        defaultPayload
    },

    // 以下公共配置文件（必填）
    // 雷神事件命名前缀，用于生成事件名称，会拼接上下方分子分母小写，如：fql_xj_cash_index_enter_scene_logic
    lsMetricPrefix: 'fql_xj_cash_index_',
    // sql模板, 用于生成sql语句
    sqlTemplate:
        '(sum(sum_over_time(${metricMolecular}{}[30m] offset 1d)) / sum(sum_over_time(${metricDenominator}{}[30m] offset 1d))) - (sum(sum_over_time(${metricMolecular}{}[30m])) / sum(sum_over_time(${metricDenominator}{}[30m]))) >= sum(sum_over_time(${metricMolecular}{}[30m] offset 1d)) / sum(sum_over_time(${metricDenominator}{}[30m] offset 1d)) * ${threshold} and sum(sum_over_time(${metricDenominator}{}[30m])) > ${minimumAbsoluteValue}',

    processTemplateText: function (config, item) {
        let text = ''

        // 模板变量处理函数，用于处理模板变量，这里可以根据实际需求进行修改

        // metricMolecular: `${lsMetricPrefix}${item.molecular.toLowerCase()}${item.molecularSuffix?.toLowerCase()}`
        // metricMolecular 的取值如上，会拼接上雷神事件命名前缀、分子小写、分子后缀小写，如：fql_xj_cash_index_enter_scene_logic_uid
        // metricDenominator: `${lsMetricPrefix}${item.denominator.toLowerCase()}${item.denominatorSuffix?.toLowerCase()}`
        // metricMolecular 的取值如上，会拼接上雷神事件命名前缀、分子小写、分子后缀小写，如：fql_xj_cash_index_page_expose_uid
        // threshold: item.threshold
        // minimumAbsoluteValue: item.minimumAbsoluteValue
        const metricMolecular = `${
            config.lsMetricPrefix
        }${item.molecular.toLowerCase()}${item.molecularSuffix?.toLowerCase()}`
        const metricDenominator = `${
            config.lsMetricPrefix
        }${item.denominator.toLowerCase()}${item.denominatorSuffix?.toLowerCase()}`
        const threshold = item.threshold
        const minimumAbsoluteValue = item.minimumAbsoluteValue

        text = config.sqlTemplate
            .replace(/\${metricMolecular}/g, metricMolecular)
            .replace(/\${metricDenominator}/g, metricDenominator)
            .replace(/\${threshold}/g, threshold.toString())
            .replace(/\${minimumAbsoluteValue}/g, minimumAbsoluteValue.toString())
        return text
    },
    list: [
        {
            molecular: 'ENTER_SCENE_LOGIC', // 分子
            molecularSuffix: '',
            denominator: 'PAGE_EXPOSE', //分母
            denominatorSuffix: '',
            minimumAbsoluteValue: 10000, // 最小绝对值
            thresholdList: [
                {
                    threshold: 0.2, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 2, // 告警级别
                        name: '借钱-借钱首页-用户正常停留率-30min内同比下降20%' // 规则标题
                    }
                },
                {
                    threshold: 0.5, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 1, // 告警级别
                        name: '借钱-借钱首页-用户正常停留率-30min内同比下降50%' // 规则标题
                    }
                }
            ]
        },
        {
            molecular: 'ORDER_CONFIRM_CLICK', // 分子
            molecularSuffix: '_UID', // 分子后缀（配置uv的时候才需要，需额外注册改指标，fql_xj_cash_index_order_confirm_click_uid）
            denominator: 'PAGE_BTN_SHOW', //分母
            denominatorSuffix: '_UID', // 分母后缀 （配置uv的时候才需要，需额外注册改指标，fql_xj_cash_index_page_btn_show_uid）
            minimumAbsoluteValue: 10000, // 最小绝对值
            thresholdList: [
                {
                    threshold: 0.2, // 阈值
                    replacePayload: {
                        severity: 2, // 告警级别
                        name: '借钱-借钱首页-用户填写下单率uv-30min内同比下降20%' // 规则标题
                    }
                }
            ]
        }
    ]
}

module.exports = config
