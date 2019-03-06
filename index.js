
let cssMathRule = /([\s\S]+?)\{([\s\S]*?)\s*\}/gi
css = css.replace(/[\s\n]/g,'')

let match
let rules = []
while( (match = cssMathRule.exec(css))) {
    rules.push({
        selector:match[1],
        style:parseProperty(match[2]),
        cssText:match[0]
    })
}

function parseProperty(expr){
    let exprList = expr.split(';')
    let result = {}
    exprList.forEach(expr => {
        if(expr.match(':')){
            let rule = expr.split(':')
            result[rule[0]] = rule[1]
        }
    })
    return result
}

