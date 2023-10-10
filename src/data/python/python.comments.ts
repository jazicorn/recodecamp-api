import { Q_Type } from  '../../types/types.question';
import { faker } from '@faker-js/faker';
import { getRandomInt } from '../../utils/index';
import { nanoid } from 'nanoid';

export const objSingle = (): Q_Type => {
    const personName = faker.person.firstName();
    const keyword = "SingleLine";
    const data = {
        _QUESTION_LANGUAGE: "Python",
        _QUESTION_ID: `py-5DQ00B9N6qWv`,
        _QUESTION_LEVEL: 1,
        _QUESTION_POINTS: 1,
        _QUESTION_TASK: `Using \"${keyword}\" comments, comment the statement: \'prints greeting to console\'.`,
        _QUESTION_DATA: { keyword: keyword, value: personName, returnValue: `print('Hello ${personName})` },
        _QUESTION_ANSWER_REGEX: ``,
        _QUESTION_ANSWER: (userAnswer: string, answer: string) => {
            const regex =  new RegExp(answer);
            const result = userAnswer.match(regex);
            if(result) {
                return true
            } else {
                return false
            }
        },
        _QUESTION_RESULT: {
            0: {
                all:true
            },
            1 : {
                answer:
                `
                def greeting():
                    # ⬇️ Only change code bellow this line
                    # prints greeting to console
                    print("Hello  ${personName}")
                    # ⬆️ Only change code abouve this line

                greeting()`,
                optional: false
            }
        },
        _QUESTION_HINTS: {},
        _QUESTION_BOILERPLATE: `def greeting(): \n\t# ⬇️ Only change code bellow this line \n\t prints greeting to console\n\tprint(\"Hello ${personName}\")\n\t# ⬆️ Only change code abouve this line\n\ngreeting()\n`,
        _QUESTION_CONDITIONS: {},
        _QUESTION_CONSTRAINTS: {},
        _QUESTION_CATEGORY: 'Comments',
        _QUESTION_CATEGORY_SUB: '',
        _QUESTION_TAGS: [],
        _QUESTION_REFS: {
            "python/comments": "https://www.w3schools.com/python/python_comments.asp",
        }
    }
    return data;
};

export const objMulti = (): Q_Type => {
    const personName = faker.person.firstName();
    const keyword = "MultiLine";
    const data = {
        _QUESTION_LANGUAGE: "Python",
        _QUESTION_ID: `py-eOwVGzeqEYaR`,
        _QUESTION_LEVEL: 1,
        _QUESTION_POINTS: 1,
        _QUESTION_TASK: `Using "${keyword}" comments, comment the statement: 'Program Purpose | Executes function that prints user greeting to console'`,
        _QUESTION_DATA: { keyword: keyword, value: personName},
        _QUESTION_ANSWER_REGEX: ``,
        _QUESTION_ANSWER: (userAnswer: string, answer: string) => {
            const regex =  new RegExp(answer);
            const result = userAnswer.match(regex);
            if(result) {
                return true
            } else {
                return false
            }
        },
        _QUESTION_RESULT: {
            0: {
                all:true
            },
            1 : {
                answer:
                `
                # ⬇️ Only change code bellow this line
                """
                    Program Purpose | Executes function that prints user greeting to console
                """
                # ⬆️ Only change code abouve this line
                def greeting():
                    print("Hello ${personName}")

                greeting()`,
                optional: false
            }
        },
        _QUESTION_HINTS: {},
        _QUESTION_BOILERPLATE: `# ⬇️ Only change code bellow this line\n\nProgram Purpose | Executes function that prints user greeting to console\n\n# ⬆️ Only change code abouve this line\ndef greeting(): \n\tprint(\"Hello ${personName}\")\n\ngreeting()`,
        _QUESTION_CONDITIONS: {},
        _QUESTION_CONSTRAINTS: {},
        _QUESTION_CATEGORY: 'Comments',
        _QUESTION_CATEGORY_SUB: '',
        _QUESTION_TAGS: [],
        _QUESTION_REFS: {
            "python/comments": "https://www.w3schools.com/python/python_comments.asp",
        }
    }
    return data;
};
