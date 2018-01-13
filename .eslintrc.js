module.exports = {
    "parserOptions": {
        "ecmaVersion": 2017
    },
    "env": {
        "node": true,
        "es6": true,
        "mocha": true
    },
    "extends": [
        "eslint:recommended",
        "google"
    ],
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": "error",
        "strict": "error",
        "prefer-const": "error",
        "no-var": "error",
        "space-before-function-paren": "error",
        "space-before-blocks": "error",
        "keyword-spacing": "error",
        "no-lonely-if": "error",
        "no-multi-spaces": "error",
        "no-multiple-empty-lines": [
            "error",
            {
                "max": 1
            }
        ],
        "no-unexpected-multiline": "error",
        "no-trailing-spaces": "error",
        "max-len": ["error",{"code":121,ignoreRegExpLiterals:true}]
    }
};
