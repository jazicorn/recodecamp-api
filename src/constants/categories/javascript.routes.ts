export const _ROUTES_JAVASCRIPT = [
    {
        "id": 1,
        "category": ["comments", "comments/all"],
        "subCategories": {
            "singleLine": ['comments/single/all'],
            "multiLine": ['comments/multi/all'],
        },
        "info": {
            "sources": [
                {"w3schools": "https://www.w3schools.com/js/js_comments.asp"}
            ],
            "desc": [
                { "paragraph": "JavaScript comments can be used to explain JavaScript code, and to make it more readable. JavaScript comments can also be used to prevent execution, when testing alternative code."},
            ],
        },
        "tags": ["Javascript", "comments", "singleline", "multiline", "documentation"]
    },
    {
        "id": 2,
        "category": ["variables", "var/all"],
        "subCategories": {
            "declare": ['var/declare/all','var/declare/var','var/declare/const','var/declare/let'],
            "scope": ['var/scope/all','var/scope/block','var/scope/func','var/scope/global'],
        },
        "info": {
            "sources": [
                {"w3schools":"https://www.w3schools.com/js/js_variables.asp"}
            ],
            "desc": [
                { "line" : "Variables are Containers for Storing Data."},
                { "unorderedList" : "JavaScript Variables can be declared in 4 ways:"},
                { "listItem" : ["Automatically", "Using var", "Using let", "Using const"]},
            ],
        }
        "tags": ["Javascript", "var", "const", "let", "declare", "scope", "reassign", "global", "block"]
    },
]
