let css = `
  .foo {
    color: red;
    left: 10px;
  }
  
  body {
    background: orange;
  }

  @media screen and (max-width: 300px) {
    body {
        background-color:lightblue;
    }
    10% {
      background-color:lightblue;
    }
  }

  @keyframes mymove { from {top:0px;} to {top:200px;} } 
  
  @-webkit-keyframes mymove { from {top:0px;} to {top:200px;} } 

  @font-face{font-family:"Roboto";src:url("//i.alicdn.com/artascope-font/20160419204543/font/roboto-thin.eot");} 
`


css = css.replace(/[\n\s]{2,}/g, "");

function getMatchedSpecialRules(_rule, type, cssTxt) {
  let cssGramaRule = _rule;
  let matchRule = {};
  let rules = [];
  while ((matchRule = cssGramaRule.exec(cssTxt))) {
    if (matchRule[1].match("@")) {
      let styleTxt = matchRule[2].trim();
      rule = {
        selectorText: matchRule[1],
        type: type,
        subStyles: getMatchedRules(styleTxt)
      };
      rules.push(rule);
    } else {
      rules.push({
        selector: matchRule[1],
        style: parseProperty(matchRule[2]),
        cssText: matchRule[0]
      })
    }
  }
  return rules
}

function getMatchedRules(cssTxt) {
  let cssGramaRule = /([\s\S]+?)\{([\s\S]*?)\s*?\}/gi
  let matchRule = {};
  let rules = [];
  while ((matchRule = cssGramaRule.exec(cssTxt))) {

    rules.push({
      selector: matchRule[1],
      style: parseProperty(matchRule[2]),
      cssText: matchRule[0]
    })

  }
  return rules
}

function parseProperty(expr) {
  let exprList = expr.split(";")
  let result = {}
  exprList.forEach(function (item) {
    if (item.match(":")) {
      let kv = item.split(":");
      result[kv[0].trim()] = kv[1].trim();
    }
  })
  return result;
}

let mediaRule = /(@media[\s\S]*?){([\s\S]*?}\s*?)}/gi;
let keyframesRule = /(@[a-z\-]*?keyframes[\s\S]*?){([\s\S]*?}\s*?)}/gi;

let rules = [];
rules = rules.concat(getMatchedSpecialRules(mediaRule, "media", css))
css = css.replace(mediaRule, "")
rules = rules.concat(getMatchedSpecialRules(keyframesRule, "keyframes", css))
css = css.replace(keyframesRule, "")
rules = rules.concat(getMatchedRules(css))
