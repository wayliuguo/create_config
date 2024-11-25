const fs = require('fs')
const path = require('path')

function getTemplateConfig() {
    const templatePath = path.join(__dirname, 'createcfg.template.js')
    return fs.readFileSync(templatePath, 'utf-8')
}

function getRegisterTemplateConfig() {
    const templatePath = path.join(__dirname, 'register.template.js')
    return fs.readFileSync(templatePath, 'utf-8')
}

function generateTemplate() {
    fs.writeFile('createcfg.js', getTemplateConfig(), err => {
        if (err) {
            console.error('生成错误:', err)
        } else {
            console.log(`createcfg.js 已生成`)
        }
    })
}

function generateRegisterTemplate() {
    fs.writeFile('register.js', getRegisterTemplateConfig(), err => {
        if (err) {
            console.error('生成错误:', err)
        } else {
            console.log(`register.js 已生成`)
        }
    })
}

module.exports = {
    generateTemplate,
    generateRegisterTemplate
}
