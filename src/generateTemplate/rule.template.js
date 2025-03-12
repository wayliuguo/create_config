// 默认接口payload，可以复制请求的payload，然后根据自己的需求修改
const defaultPayload = {
    name: '规则标题', // 规则标题（必填），可在thresholdList的name中指定
    note: 'hippo配置key：kafka_record_config_xfjr', // 规则备注 （必填）
    severity: 3, // 告警级别（必填）普通告警：3，  紧急告警：2， 致命告警：1
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
    prom_eval_interval: 300, // 执行频率（必填）
    prom_for_duration: 300, // 持续时长（必填）
    enable_status: false,
    enable_days_of_week: ['1', '2', '3', '4', '5', '6', '0'],
    enable_stime: '00:00',
    enable_etime: '23:59',
    enable_in_bg: 0,
    notify_channels: ['wecom'], // 通知媒介（必填）邮件：email，微信：wecom，电话：phone，短信：sms
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
        const threshold = item.threshold || ''
        const minimumAbsoluteValue = item.minimumAbsoluteValue || ''

        const sqlTemplate = item.sqlTemplate || config.sqlTemplate

        text = sqlTemplate
            .replace(/\${metricMolecular}/g, metricMolecular)
            .replace(/\${metricDenominator}/g, metricDenominator)
            .replace(/\${threshold}/g, threshold.toString())
            .replace(/\${minimumAbsoluteValue}/g, minimumAbsoluteValue.toString())
        return text
    },
    list: [
        // 页面停留率
        {
            molecular: 'ENTER_SCENE_LOGIC', // 分子
            molecularSuffix: '',
            denominator: 'PAGE_EXPOSE', //分母
            denominatorSuffix: '',
            minimumAbsoluteValue: 5720, // 最小绝对值
            thresholdList: [
                {
                    threshold: 0.2, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】1-1、借钱-借钱首页-用户正常停留率-30min内同比下降20%' // 规则标题
                    }
                },
                {
                    threshold: 0.5, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 2, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】1-1、借钱-借钱首页-用户正常停留率-30min内同比下降50%' // 规则标题
                    }
                },
                {
                    threshold: 0.8, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 1, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】1-1、借钱-借钱首页-用户正常停留率-30min内同比下降80%', // 规则标题
                        notify_channels: ['wecom', 'phone'], // 致命告警必须配置电话渠道
                        runbook_url: 'https://ledocs.oa.fenqile.com/doc/11d4e637e18bb37d0485f7263851542e' // 预案链接，致命告警必填
                    }
                },
                {
                    // 自定义sql模板
                    sqlTemplate: 'sum(sum_over_time(${metricDenominator}{}[30m])) < ${minimumAbsoluteValue}',
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】1-1、借钱-借钱首页-用户正常停留率-30min内访问量低于5720' // 规则标题
                    }
                }
            ]
        },
        // 页面正常打开率
        {
            molecular: 'CONFIRM_INIT_FINISHED', // 分子
            molecularSuffix: '',
            denominator: 'ENTER_SCENE_LOGIC', //分母
            denominatorSuffix: '',
            minimumAbsoluteValue: 2500, // 最小绝对值
            thresholdList: [
                {
                    threshold: 0.2, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】1-2、借钱-借钱首页-停留后正常打开率-30min内同比下降20%' // 规则标题
                    }
                },
                {
                    threshold: 0.5, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 2, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】1-2、借钱-借钱首页-停留后正常打开率-30min内同比下降50%' // 规则标题
                    }
                },
                {
                    threshold: 0.8, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 1, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】1-2、借钱-借钱首页-停留后正常打开率-30min内同比下降80%', // 规则标题
                        notify_channels: ['wecom', 'phone'], // 致命告警必须配置电话渠道
                        runbook_url: 'https://ledocs.oa.fenqile.com/doc/11d4e637e18bb37d0485f7263851542e' // 预案链接，致命告警必填
                    }
                },
                {
                    // 自定义sql模板
                    sqlTemplate: 'sum(sum_over_time(${metricDenominator}{}[30m])) < ${minimumAbsoluteValue}',
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】1-2、借钱-借钱首页-停留后正常打开率-30min内访问量低于2500' // 规则标题
                    }
                }
            ]
        },
        // 手动输入金额率
        {
            molecular: 'CONFIRM_AMOUNT_INPUT', // 分子
            molecularSuffix: '',
            denominator: 'CONFIRM_INIT_FINISHED', //分母
            denominatorSuffix: '',
            minimumAbsoluteValue: 2400, // 最小绝对值
            thresholdList: [
                {
                    threshold: 0.2, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】2-1、借钱-借钱首页-手动输入金额率-30min内同比下降20%' // 规则标题
                    }
                },
                {
                    threshold: 0.5, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 2, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】2-1、借钱-借钱首页-手动输入金额率-30min内同比下降50%' // 规则标题
                    }
                },
                {
                    threshold: 0.8, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 1, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】2-1、借钱-借钱首页-手动输入金额率-30min内同比下降80%', // 规则标题
                        notify_channels: ['wecom', 'phone'], // 致命告警必须配置电话渠道
                        runbook_url: 'https://ledocs.oa.fenqile.com/doc/11d4e637e18bb37d0485f7263851542e' // 预案链接，致命告警必填
                    }
                },
                {
                    // 自定义sql模板
                    sqlTemplate: 'sum(sum_over_time(${metricDenominator}{}[30m])) < ${minimumAbsoluteValue}',
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】2-1、借钱-借钱首页-手动输入金额率-30min内访问量低于2400' // 规则标题
                    }
                }
            ]
        },
        // 点击下单率
        {
            molecular: 'ORDER_CONFIRM_CLICK', // 分子
            molecularSuffix: '',
            denominator: 'PAGE_BTN_SHOW', //分母
            denominatorSuffix: '',
            minimumAbsoluteValue: 1380, // 最小绝对值
            thresholdList: [
                {
                    threshold: 0.2, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】2-2、借钱-借钱首页-点击下单率-30min内同比下降20%' // 规则标题
                    }
                },
                {
                    threshold: 0.5, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 2, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】2-2、借钱-借钱首页-点击下单率-30min内同比下降50%' // 规则标题
                    }
                },
                {
                    threshold: 0.8, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 1, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】2-2、借钱-借钱首页-点击下单率-30min内同比下降80%', // 规则标题
                        notify_channels: ['wecom', 'phone'], // 致命告警必须配置电话渠道
                        runbook_url: 'https://ledocs.oa.fenqile.com/doc/11d4e637e18bb37d0485f7263851542e' // 预案链接，致命告警必填
                    }
                },
                {
                    // 自定义sql模板
                    sqlTemplate: 'sum(sum_over_time(${metricDenominator}{}[30m])) < ${minimumAbsoluteValue}',
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】2-2、借钱-借钱首页-点击下单率-30min内访问量低于1380' // 规则标题
                    }
                }
            ]
        },
        // 可触发创单比率
        {
            molecular: 'CREATE_ORDER_START', // 分子
            molecularSuffix: '',
            denominator: 'ORDER_CONFIRM_CLICK', //分母
            denominatorSuffix: '',
            minimumAbsoluteValue: 1270, // 最小绝对值
            thresholdList: [
                {
                    threshold: 0.2, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】3-1、借钱-借钱首页-可触发创单比率-30min内同比下降20%' // 规则标题
                    }
                },
                {
                    threshold: 0.5, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        disabled: 1, // 禁用告警
                        severity: 2, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】3-1、借钱-借钱首页-可触发创单比率-30min内同比下降50%' // 规则标题
                    }
                },
                {
                    threshold: 0.8, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        disabled: 1, // 禁用告警
                        severity: 1, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】3-1、借钱-借钱首页-可触发创单比率-30min内同比下降80%', // 规则标题
                        notify_channels: ['wecom', 'phone'], // 致命告警必须配置电话渠道
                        runbook_url: 'https://ledocs.oa.fenqile.com/doc/11d4e637e18bb37d0485f7263851542e' // 预案链接，致命告警必填
                    }
                },
                {
                    // 自定义sql模板
                    sqlTemplate: 'sum(sum_over_time(${metricDenominator}{}[30m])) < ${minimumAbsoluteValue}',
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】3-1、借钱-借钱首页-可触发创单比率-30min内访问量低于1270' // 规则标题
                    }
                }
            ]
        },
        // 创单成功率
        {
            molecular: 'ORDER_STATE_QUERY_RESULT_SUCCESS', // 分子
            molecularSuffix: '',
            denominator: 'CREATE_ORDER_START', //分母
            denominatorSuffix: '',
            minimumAbsoluteValue: 1060, // 最小绝对值
            thresholdList: [
                {
                    threshold: 0.2, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】3-2、借钱-借钱首页-创单成功率-30min内同比下降20%' // 规则标题
                    }
                },
                {
                    threshold: 0.5, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        disabled: 1, // 禁用告警
                        severity: 2, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】3-2、借钱-借钱首页-创单成功率-30min内同比下降50%' // 规则标题
                    }
                },
                {
                    disabled: 1, // 禁用告警
                    threshold: 0.8, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 1, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】3-2、借钱-借钱首页-创单成功率-30min内同比下降80%', // 规则标题
                        notify_channels: ['wecom', 'phone'], // 致命告警必须配置电话渠道
                        runbook_url: 'https://ledocs.oa.fenqile.com/doc/11d4e637e18bb37d0485f7263851542e' // 预案链接，致命告警必填
                    }
                },
                {
                    // 自定义sql模板
                    sqlTemplate: 'sum(sum_over_time(${metricDenominator}{}[30m])) < ${minimumAbsoluteValue}',
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】3-2、借钱-借钱首页-创单成功率-30min内访问量低于1060' // 规则标题
                    }
                }
            ]
        },
        // 订单信息反查成功率
        {
            molecular: 'GET_PAGE_INFO_SUCCESS', // 分子
            molecularSuffix: '',
            denominator: 'GET_PAGE_INFO_START', //分母
            denominatorSuffix: '',
            minimumAbsoluteValue: 380, // 最小绝对值
            thresholdList: [
                {
                    threshold: 0.2, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】3-3、借钱-借钱首页-订单信息反查成功率-30min内同比下降20%' // 规则标题
                    }
                },
                {
                    threshold: 0.5, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        disabled: 1, // 禁用告警
                        severity: 2, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】3-3、借钱-借钱首页-订单信息反查成功率-30min内同比下降50%' // 规则标题
                    }
                },
                {
                    disabled: 1, // 禁用告警
                    threshold: 0.8, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 1, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】3-3、借钱-借钱首页-订单信息反查成功率-30min内同比下降80%', // 规则标题
                        notify_channels: ['wecom', 'phone'], // 致命告警必须配置电话渠道
                        runbook_url: 'https://ledocs.oa.fenqile.com/doc/11d4e637e18bb37d0485f7263851542e' // 预案链接，致命告警必填
                    }
                },
                {
                    // 自定义sql模板
                    sqlTemplate: 'sum(sum_over_time(${metricDenominator}{}[30m])) < ${minimumAbsoluteValue}',
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】3-3、借钱-借钱首页-订单信息反查成功率-30min内访问量低于380' // 规则标题
                    }
                }
            ]
        },
        // 补充资料环节通过率
        {
            molecular: 'PASS_MATERIAL', // 分子
            molecularSuffix: '',
            denominator: 'PRE_MATCH', //分母
            denominatorSuffix: '',
            minimumAbsoluteValue: 1030, // 最小绝对值
            thresholdList: [
                {
                    threshold: 0.2, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】4-1、借钱-借钱首页-补充资料环节通过率-30min内同比下降20%' // 规则标题
                    }
                },
                {
                    threshold: 0.5, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        disabled: 1, // 禁用告警
                        severity: 2, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】4-1、借钱-借钱首页-补充资料环节通过率-30min内同比下降50%' // 规则标题
                    }
                },
                {
                    threshold: 0.8, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        disabled: 1, // 禁用告警
                        severity: 1, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】4-1、借钱-借钱首页-补充资料环节通过率-30min内同比下降80%', // 规则标题
                        notify_channels: ['wecom', 'phone'], // 致命告警必须配置电话渠道
                        runbook_url: 'https://ledocs.oa.fenqile.com/doc/11d4e637e18bb37d0485f7263851542e' // 预案链接，致命告警必填
                    }
                },
                {
                    // 自定义sql模板
                    sqlTemplate: 'sum(sum_over_time(${metricDenominator}{}[30m])) < ${minimumAbsoluteValue}',
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】4-1、借钱-借钱首页-补充资料环节通过率-30min内访问量低于1030' // 规则标题
                    }
                }
            ]
        },
        // 阅读协议环节通过率
        {
            molecular: 'PASS_CONTRACT', // 分子
            molecularSuffix: '',
            denominator: 'PASS_MATERIAL', //分母
            denominatorSuffix: '',
            minimumAbsoluteValue: 1020, // 最小绝对值
            thresholdList: [
                {
                    threshold: 0.2, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】4-2、借钱-借钱首页-阅读协议环节通过率-30min内同比下降20%' // 规则标题
                    }
                },
                {
                    threshold: 0.5, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        disabled: 1, // 禁用告警
                        severity: 2, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】4-2、借钱-借钱首页-阅读协议环节通过率-30min内同比下降50%' // 规则标题
                    }
                },
                {
                    threshold: 0.8, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        disabled: 1, // 禁用告警
                        severity: 1, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】4-2、借钱-借钱首页-阅读协议环节通过率-30min内同比下降80%', // 规则标题
                        notify_channels: ['wecom', 'phone'], // 致命告警必须配置电话渠道
                        runbook_url: 'https://ledocs.oa.fenqile.com/doc/11d4e637e18bb37d0485f7263851542e' // 预案链接，致命告警必填
                    }
                },
                {
                    // 自定义sql模板
                    sqlTemplate: 'sum(sum_over_time(${metricDenominator}{}[30m])) < ${minimumAbsoluteValue}',
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】4-2、借钱-借钱首页-阅读协议环节通过率-30min内访问量低于1020' // 规则标题
                    }
                }
            ]
        },
        // 二审前金融策略环节通过率
        {
            molecular: 'IDENTITY_AUTH_START', // 分子
            molecularSuffix: '',
            denominator: 'PASS_CONTRACT', //分母
            denominatorSuffix: '',
            minimumAbsoluteValue: 1020, // 最小绝对值
            thresholdList: [
                {
                    threshold: 0.2, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】4-3、借钱-借钱首页-二审前金融策略环节通过率-30min内同比下降20%' // 规则标题
                    }
                },
                {
                    threshold: 0.5, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        disabled: 1, // 禁用告警
                        severity: 2, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】4-3、借钱-借钱首页-二审前金融策略环节通过率-30min内同比下降50%' // 规则标题
                    }
                },
                {
                    threshold: 0.8, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        disabled: 1, // 禁用告警
                        severity: 1, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】4-3、借钱-借钱首页-二审前金融策略环节通过率-30min内同比下降80%', // 规则标题
                        notify_channels: ['wecom', 'phone'], // 致命告警必须配置电话渠道
                        runbook_url: 'https://ledocs.oa.fenqile.com/doc/11d4e637e18bb37d0485f7263851542e' // 预案链接，致命告警必填
                    }
                },
                {
                    // 自定义sql模板
                    sqlTemplate: 'sum(sum_over_time(${metricDenominator}{}[30m])) < ${minimumAbsoluteValue}',
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】4-3、借钱-借钱首页-二审前金融策略环节通过率-30min内访问量低于1020' // 规则标题
                    }
                }
            ]
        },
        // 资料/交易鉴权环节通过率
        {
            molecular: 'IDENTITY_AUTH_END', // 分子
            molecularSuffix: '',
            denominator: 'IDENTITY_AUTH_START', //分母
            denominatorSuffix: '',
            minimumAbsoluteValue: 980, // 最小绝对值
            thresholdList: [
                {
                    threshold: 0.2, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】4-4、借钱-借钱首页-资料/交易鉴权环节通过率-30min内同比下降20%' // 规则标题
                    }
                },
                {
                    threshold: 0.5, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        disabled: 1, // 禁用告警
                        severity: 2, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】4-4、借钱-借钱首页-资料/交易鉴权环节通过率-30min内同比下降50%' // 规则标题
                    }
                },
                {
                    threshold: 0.8, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        disabled: 1, // 禁用告警
                        severity: 1, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】4-4、借钱-借钱首页-资料/交易鉴权环节通过率-30min内同比下降80%', // 规则标题
                        notify_channels: ['wecom', 'phone'], // 致命告警必须配置电话渠道
                        runbook_url: 'https://ledocs.oa.fenqile.com/doc/11d4e637e18bb37d0485f7263851542e' // 预案链接，致命告警必填
                    }
                },
                {
                    // 自定义sql模板
                    sqlTemplate: 'sum(sum_over_time(${metricDenominator}{}[30m])) < ${minimumAbsoluteValue}',
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】4-4、借钱-借钱首页-资料/交易鉴权环节通过率-30min内访问量低于980' // 规则标题
                    }
                }
            ]
        },
        // 创单后提交支付率
        {
            molecular: 'SUBMIT_ORDER', // 分子
            molecularSuffix: '',
            denominator: 'IDENTITY_AUTH_END', //分母
            denominatorSuffix: '',
            minimumAbsoluteValue: 830, // 最小绝对值
            thresholdList: [
                {
                    threshold: 0.2, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        disabled: 1, // 禁用告警
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】5-1、借钱-借钱首页-创单后提交支付率-30min内同比下降20%' // 规则标题
                    }
                },
                {
                    threshold: 0.5, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        disabled: 1, // 禁用告警
                        severity: 2, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】5-1、借钱-借钱首页-创单后提交支付率-30min内同比下降50%' // 规则标题
                    }
                },
                {
                    threshold: 0.8, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        disabled: 1, // 禁用告警
                        severity: 1, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】5-1、借钱-借钱首页-创单后提交支付率-30min内同比下降80%', // 规则标题
                        notify_channels: ['wecom', 'phone'], // 致命告警必须配置电话渠道
                        runbook_url: 'https://ledocs.oa.fenqile.com/doc/11d4e637e18bb37d0485f7263851542e' // 预案链接，致命告警必填
                    }
                },
                {
                    // 自定义sql模板
                    sqlTemplate: 'sum(sum_over_time(${metricDenominator}{}[30m])) < ${minimumAbsoluteValue}',
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        disabled: 1, // 禁用告警
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】5-1、借钱-借钱首页-创单后提交支付率-30min内访问量低于830' // 规则标题
                    }
                }
            ]
        },
        // 提交支付成功率
        {
            molecular: 'PAYMENT_STATE_QUERY_RESULT_SUCCESS', // 分子
            molecularSuffix: '',
            denominator: 'SUBMIT_ORDER', //分母
            denominatorSuffix: '',
            minimumAbsoluteValue: 820, // 最小绝对值
            thresholdList: [
                {
                    threshold: 0.2, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】5-2、借钱-借钱首页-提交支付成功率-30min内同比下降20%' // 规则标题
                    }
                },
                {
                    threshold: 0.5, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        disabled: 1, // 禁用告警
                        severity: 2, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】5-2、借钱-借钱首页-提交支付成功率-30min内同比下降50%' // 规则标题
                    }
                },
                {
                    threshold: 0.8, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        disabled: 1, // 禁用告警
                        severity: 1, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】5-2、借钱-借钱首页-提交支付成功率-30min内同比下降80%', // 规则标题
                        notify_channels: ['wecom', 'phone'], // 致命告警必须配置电话渠道
                        runbook_url: 'https://ledocs.oa.fenqile.com/doc/11d4e637e18bb37d0485f7263851542e' // 预案链接，致命告警必填
                    }
                },
                {
                    // 自定义sql模板
                    sqlTemplate: 'sum(sum_over_time(${metricDenominator}{}[30m])) < ${minimumAbsoluteValue}',
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】5-2、借钱-借钱首页-提交支付成功率-30min内访问量低于820' // 规则标题
                    }
                }
            ]
        },
        // 首页路由接口成功率
        {
            molecular: 'HOME_SUCCESS', // 分子
            molecularSuffix: '',
            denominator: 'HOME_START', //分母
            denominatorSuffix: '',
            minimumAbsoluteValue: 5620, // 最小绝对值
            thresholdList: [
                {
                    // 自定义sql模板
                    sqlTemplate: 'sum(sum_over_time(${metricDenominator}{}[30m])) < ${minimumAbsoluteValue}',
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】1-1、借钱-借钱首页-首页路由接口成功率-30min内访问量低于5620' // 规则标题
                    }
                }
            ]
        },
        // 子产品信息的接口成功率
        {
            molecular: 'ATTR_SUCCESS', // 分子
            molecularSuffix: '',
            denominator: 'ATTR_START', //分母
            denominatorSuffix: '',
            minimumAbsoluteValue: 2500, // 最小绝对值
            thresholdList: [
                {
                    // 自定义sql模板
                    threshold: 0.2, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】1-2、借钱-借钱首页-子产品信息的接口成功率-30min内同比下降20%' // 规则标题
                    }
                }
            ]
        },
        // 用户限额的接口成功率
        {
            molecular: 'ATTR_SUCCESS', // 分子
            molecularSuffix: '',
            denominator: 'ATTR_START', //分母
            denominatorSuffix: '',
            minimumAbsoluteValue: 2500, // 最小绝对值
            thresholdList: [
                {
                    threshold: 0.2, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】1-3、借钱-借钱首页-用户限额的接口成功率-30min内同比下降20%' // 规则标题
                    }
                }
            ]
        },
        // 基础费率的接口成功率
        {
            molecular: 'BASE_FEE_INFO', // 分子
            molecularSuffix: '',
            denominator: 'BASE_FEE_INFO_START', //分母
            denominatorSuffix: '',
            minimumAbsoluteValue: 2080, // 最小绝对值
            thresholdList: [
                {
                    threshold: 0.2, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】1-4、借钱-借钱首页-基础费率的接口成功率-30min内同比下降20%' // 规则标题
                    }
                }
            ]
        },
        // 键盘唤起成功率
        {
            molecular: 'SHOW_KEYBOARD_POPUP_SUCCESS', // 分子
            molecularSuffix: '',
            denominator: 'SHOW_KEYBOARD_POPUP', //分母
            denominatorSuffix: '',
            minimumAbsoluteValue: 2440, // 最小绝对值
            thresholdList: [
                {
                    threshold: 0.2, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】2-1、借钱-借钱首页-键盘唤起成功率-30min内同比下降20%' // 规则标题
                    }
                }
            ]
        },
        // 创建订单的接口成功率
        {
            molecular: 'CREATE_ORDER_RETCODE_SUCCESS', // 分子
            molecularSuffix: '',
            denominator: 'CREATE_ORDER_START', //分母
            denominatorSuffix: '',
            minimumAbsoluteValue: 1060, // 最小绝对值
            thresholdList: [
                {
                    threshold: 0.2, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】3-1、借钱-借钱首页-创建订单的接口成功率-30min内同比下降20%' // 规则标题
                    }
                }
            ]
        },
        // 创单结果轮询的接口成功率
        {
            molecular: 'QUERY_ORDER_STATE_SUCCESS', // 分子
            molecularSuffix: '',
            denominator: 'QUERY_ORDER_STATE_START', //分母
            denominatorSuffix: '',
            minimumAbsoluteValue: 2270, // 最小绝对值
            thresholdList: [
                {
                    threshold: 0.2, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】3-2、借钱-借钱首页-创单结果轮询的接口成功率-30min内同比下降20%' // 规则标题
                    }
                }
            ]
        },
        // 订单信息反查的接口成功率
        {
            molecular: 'GET_PAGE_INFO_SUCCESS', // 分子
            molecularSuffix: '',
            denominator: 'GET_PAGE_INFO_START', //分母
            denominatorSuffix: '',
            minimumAbsoluteValue: 380, // 最小绝对值
            thresholdList: [
                {
                    threshold: 0.2, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】3-3、借钱-借钱首页-订单信息反查的接口成功率-30min内同比下降20%' // 规则标题
                    }
                }
            ]
        },
        // 协议查询接口成功率
        {
            molecular: 'PROTOCOL_LIST_BOTTOM', // 分子
            molecularSuffix: '',
            denominator: 'QUERY_PERSONAL_AUTH_INFO_START', //分母
            denominatorSuffix: '',
            minimumAbsoluteValue: 960, // 最小绝对值
            thresholdList: [
                {
                    threshold: 0.2, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】4-1、借钱-借钱首页-协议查询接口成功率-30min内同比下降20%' // 规则标题
                    }
                }
            ]
        },
        // 初始化协议组件成功率
        {
            molecular: 'SHOW_SHARE_PROTOCOL_SUCCESS', // 分子
            molecularSuffix: '',
            denominator: 'NEED_SHOW_SHARE_PROTOCOL', //分母
            denominatorSuffix: '',
            minimumAbsoluteValue: 350, // 最小绝对值
            thresholdList: [
                {
                    threshold: 0.2, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】4-2、借钱-借钱首页-初始化协议组件成功率-30min内同比下降20%' // 规则标题
                    }
                }
            ]
        },
        // 授信协议签署接口成功率
        {
            molecular: 'SUBMIT_SHARE_AUTH_SUCCESS', // 分子
            molecularSuffix: '',
            denominator: 'SUBMIT_SHARE_AUTH_START', //分母
            denominatorSuffix: '',
            minimumAbsoluteValue: 350, // 最小绝对值
            thresholdList: [
                {
                    threshold: 0.2, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】4-3、借钱-借钱首页-授信协议签署接口成功率-30min内同比下降20%' // 规则标题
                    }
                }
            ]
        },
        // 金融策略查询的接口成功率
        {
            molecular: 'FINANCE_STRATEGY_REPORT', // 分子
            molecularSuffix: '',
            denominator: 'FINANCE_STRATEGY_REPORT_START', //分母
            denominatorSuffix: '',
            minimumAbsoluteValue: 2120, // 最小绝对值
            thresholdList: [
                {
                    threshold: 0.2, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】4-4、借钱-借钱首页-金融策略查询的接口成功率-30min内同比下降20%' // 规则标题
                    }
                }
            ]
        },
        // 鉴权查询接口成功率
        {
            molecular: 'COMPOSE_AUTH_RETURN_SUCCESS', // 分子
            molecularSuffix: '',
            denominator: 'QUERY_COMPOSE_AUTH', //分母
            denominatorSuffix: '',
            minimumAbsoluteValue: 1800, // 最小绝对值
            thresholdList: [
                {
                    threshold: 0.2, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】4-5、借钱-借钱首页-鉴权查询接口成功率-30min内同比下降20%' // 规则标题
                    }
                }
            ]
        },
        // 创建支付单的接口成功率
        {
            molecular: 'SUBMIT_PAY_ORDER_RETCODE_SUCCESS', // 分子
            molecularSuffix: '',
            denominator: 'SUBMIT_PAY_ORDER', //分母
            denominatorSuffix: '',
            minimumAbsoluteValue: 820, // 最小绝对值
            thresholdList: [
                {
                    threshold: 0.2, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】5-1、借钱-借钱首页-创建支付单的接口成功率-30min内同比下降20%' // 规则标题
                    }
                }
            ]
        },
        // 支付结果轮询的接口成功率
        {
            molecular: 'QUERY_PYAMENT_STATE_SUCCESS', // 分子
            molecularSuffix: '',
            denominator: 'QUERY_PYAMENT_STATE_START', //分母
            denominatorSuffix: '',
            minimumAbsoluteValue: 2190, // 最小绝对值
            thresholdList: [
                {
                    threshold: 0.2, // 阈值
                    // 用于覆盖 defaultPayload
                    replacePayload: {
                        severity: 3, // 告警级别 普通告警：3，  紧急告警：2， 致命告警：1
                        name: '【2.0】5-2、借钱-借钱首页-支付结果轮询的接口成功率-30min内同比下降20%' // 规则标题
                    }
                }
            ]
        }
    ]
}

module.exports = config
