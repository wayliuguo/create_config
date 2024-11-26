const fs = require('fs')
const path = require('path')

function getTemplateConfig(file) {
    const templatePath = path.join(__dirname, file)
    return fs.readFileSync(templatePath, 'utf-8')
}

function generateTemplate() {
    fs.writeFile('createcfg.js', getTemplateConfig('createcfg.template.js'), err => {
        if (err) {
            console.error('生成错误:', err)
        } else {
            console.log(`createcfg.js 已生成，此配置文件是用于生成hippo的配置文件`)
        }
    })
}

function generateRegisterTemplate() {
    fs.writeFile('register.js', getTemplateConfig('register.template.js'), err => {
        if (err) {
            console.error('生成错误:', err)
        } else {
            console.log(`register.js 已生成,此配置文件是生成的是注册指标的配置文件`)
        }
    })
}

function generateSqlTemplate() {
    fs.writeFile('sql.js', getTemplateConfig('sql.template.js'), err => {
        if (err) {
            console.error('生成错误:', err)
        } else {
            console.log(`sql.js 已生成，此配置文件是用于生成sql的配置文件`)
        }
    })
}

module.exports = {
    generateTemplate,
    generateRegisterTemplate,
    generateSqlTemplate
}