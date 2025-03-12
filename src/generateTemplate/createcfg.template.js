module.exports = {
    lsMetricPrefix: 'fql_xj_cash_index_',
    eventPosPrefix: 'CM_M.CASH_HOME.INDEX.',
    descPrefix: '消金借钱业务下单页',
    eventPosSuffixes: [
        {
            eventPosSuffixes: 'PAGE_EXPOSE',
            desc: '用户进入下单页'
        },
        {
            eventPosSuffixes: 'ENTER_SCENE_LOGIC',
            desc: '用户正常停留下单页'
        },
        {
            eventPosSuffixes: 'CONFIRM_INIT_FINISHED',
            desc: '页面初始化完成'
        },
        {
            eventPosSuffixes: 'CONFIRM_AMOUNT_INPUT',
            desc: '确认输入金额'
        },
        {
            eventPosSuffixes: 'SHOW_HAND',
            desc: ' 一键输入金额'
        },
        {
            eventPosSuffixes: 'PAGE_BTN_SHOW',
            desc: '下单按钮曝光'
        },
        {
            eventPosSuffixes: 'ORDER_CONFIRM_CLICK',
            desc: '确认下单按钮点击'
        },
        {
            eventPosSuffixes: 'ORDER_STATE_QUERY_RESULT_SUCCESS',
            desc: '创建订单成功'
        },
        {
            eventPosSuffixes: 'PRE_MATCH',
            desc: '进入补资料环节'
        },
        {
            eventPosSuffixes: 'PASS_MATERIAL',
            desc: '通过补资料环节'
        },
        {
            eventPosSuffixes: 'PASS_CONTRACT',
            desc: '通过强制阅读协议环节'
        },
        {
            eventPosSuffixes: 'IDENTITY_AUTH_START',
            desc: '交易鉴权开始'
        },
        {
            eventPosSuffixes: 'IDENTITY_AUTH_END',
            desc: '交易鉴权结束'
        },
        {
            eventPosSuffixes: 'SUBMIT_ORDER',
            desc: '提交订单'
        },
        {
            eventPosSuffixes: 'PAYMENT_STATE_QUERY_RESULT_SUCCESS',
            desc: '支付单查询成功'
        },
        {
            eventPosSuffixes: 'PAYMENT_STATE_QUERY_RESULT_WAIT',
            desc: '支付单查询结果等待'
        },
        {
            eventPosSuffixes: 'HOME_START',
            desc: '调用查询首页路由接口'
        },
        {
            eventPosSuffixes: 'HOME_SUCCESS',
            desc: '调用查询首页路由接口正常'
        },
        {
            eventPosSuffixes: 'ATTR_START',
            desc: '调用子产品接口'
        },
        {
            eventPosSuffixes: 'ATTR_SUCCESS',
            desc: '调用子产品接口成功'
        },
        {
            eventPosSuffixes: 'QUERY_RESERVATION_LIMIT_START',
            desc: '调用查询用户限额预约状态接口'
        },
        {
            eventPosSuffixes: 'QUERY_RESERVATION_LIMIT_SUCCESS',
            desc: '调用查询用户限额预约状态接口正常'
        },
        {
            eventPosSuffixes: 'BASE_FEE_INFO_START',
            desc: '调用查询基础费率接口'
        },
        {
            eventPosSuffixes: 'BASE_FEE_INFO',
            desc: '调用查询基础费率成功'
        },
        {
            eventPosSuffixes: 'SHOW_KEYBOARD_POPUP',
            desc: '触发键盘唤起'
        },
        {
            eventPosSuffixes: 'SHOW_KEYBOARD_POPUP_SUCCESS',
            desc: '键盘成功唤起'
        },
        {
            eventPosSuffixes: 'CREATE_ORDER_START',
            desc: '调用创建订单接口'
        },
        {
            eventPosSuffixes: 'CREATE_ORDER_RETCODE_SUCCESS',
            desc: '调用创建订单接口正常'
        },
        {
            eventPosSuffixes: 'QUERY_ORDER_STATE_START',
            desc: '调用查询创建订单结果接口'
        },
        {
            eventPosSuffixes: 'QUERY_ORDER_STATE_SUCCESS',
            desc: '调用查询创建订单结果接口正常'
        },
        {
            eventPosSuffixes: 'GET_PAGE_INFO_START',
            desc: '调用查询订单信息结果接口'
        },
        {
            eventPosSuffixes: 'GET_PAGE_INFO_SUCCESS',
            desc: '调用查询订单信息结果接口正常'
        },
        {
            eventPosSuffixes: 'QUERY_PERSONAL_AUTH_INFO_START',
            desc: '调用查询个人授权信息接口'
        },
        {
            eventPosSuffixes: 'PROTOCOL_LIST_BOTTOM',
            desc: '调用查询个人授权信息接口正常'
        },
        {
            eventPosSuffixes: 'NEED_SHOW_SHARE_PROTOCOL',
            desc: '协议-个保法组件初始化'
        },
        {
            eventPosSuffixes: 'SHOW_SHARE_PROTOCOL_SUCCESS',
            desc: '协议-个保法组件初始化成功'
        },
        {
            eventPosSuffixes: 'SUBMIT_SHARE_AUTH_START',
            desc: '调用平台个人信息共享授权接口'
        },
        {
            eventPosSuffixes: 'SUBMIT_SHARE_AUTH_SUCCESS',
            desc: '调用查询个人授权信息接口正常'
        },
        {
            eventPosSuffixes: 'FINANCE_STRATEGY_REPORT_START',
            desc: '调用金融策略上报接口'
        },
        {
            eventPosSuffixes: 'FINANCE_STRATEGY_REPORT',
            desc: '查询金融策略成功'
        },
        {
            eventPosSuffixes: 'QUERY_COMPOSE_AUTH',
            desc: '查询鉴权方式'
        },
        {
            eventPosSuffixes: 'COMPOSE_AUTH_RETURN_SUCCESS',
            desc: '查询鉴权接口成功返回信息'
        },
        {
            eventPosSuffixes: 'SUBMIT_PAY_ORDER',
            desc: '提交支付订单'
        },
        {
            eventPosSuffixes: 'SUBMIT_PAY_ORDER_RETCODE_SUCCESS',
            desc: '调用提交订单接口正常'
        },
        {
            eventPosSuffixes: 'QUERY_PYAMENT_STATE_START',
            desc: '轮询提交订单结果'
        },
        {
            eventPosSuffixes: 'QUERY_PYAMENT_STATE_SUCCESS',
            desc: '调用提交订单结果接口正常'
        }
    ],
    hippoConfigName: 'hippoConfig.json',
    registerConfigName: 'registerConfig.json'
}
