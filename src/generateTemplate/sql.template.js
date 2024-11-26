module.exports = {
    lsMetricPrefix: 'fql_xj_cash_index_',
    list: [
        {
            molecular: 'ENTER_SCENE_LOGIC', // 分子
            molecularSuffix: '_UID', // 分子后缀
            denominator: 'PAGE_EXPOSE', //分母
            denominatorSuffix: '_UID', // 分母后缀
            minimumAbsoluteValue: 10000 // 最小绝对值
        },
        {
            molecular: 'ORDER_CONFIRM_CLICK', // 分子
            molecularSuffix: '_UID', // 分子后缀
            denominator: 'PAGE_BTN_SHOW', //分母
            denominatorSuffix: '_UID', // 分母后缀,
            minimumAbsoluteValue: 10000 // 最小绝对值
        }
    ]
}
