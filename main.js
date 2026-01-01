const fs = require('fs');

const file = (path, on) => {
    fs.readFile(`./${path}`, 'UTF8', (error, content) => {
        if (!error && on) {
            on(content);
        }
    });
};

const getStringResource = (id, content) => {
    const headPat = '<string ';
    const paraPat = `id="${id}"`;
    const tailPat = '</string>';
    let headFound = false;
    let tailFound = false;
    let headStart = 0;
    let tailStart = 0;
    let result = null;
    for (let i = 0; i < content.length; i++) {
        if (content[i] === '<') {
            if (!headFound) {
                headFound = true;
                for (let j = 0; j < headPat.length; j++) {
                    headStart = i + j + 1;
                    if (content[i + j] !== headPat[j]) {
                        headFound = false;
                        break;
                    }
                }
                if (headFound) {
                    let paraFoundFinal = false;
                    for (let t = headStart; content[t] !== '>'; t++) {
                        let paraFound = true;
                        if (content[t] === 'i') {
                            for (let j = 0; j < paraPat.length; j++) {
                                headStart = t + j + 1;
                                if (content[t + j] !== paraPat[j]) {
                                    paraFound = false;
                                    break;
                                }
                            }
                            if (paraFound) {
                                while (content[headStart - 1] !== '>') {
                                    headStart++;
                                }
                                paraFoundFinal = true;
                                break;
                            }
                        }
                    }
                    if (!paraFoundFinal) {
                        headFound = false;
                        headStart = 0;
                    }
                }
            } else if (!tailFound) {
                tailStart = i;
                tailFound = true;
                for (let j = 0; j < tailPat.length; j++) {
                    if (content[i + j] !== tailPat[j]) {
                        tailFound = false;
                        break;
                    }
                }
            }
            if (headFound && tailFound) {
                for (let j = headStart; j < tailStart; j++) {
                    result = result ? result + content[j] : content[j];
                }
                break;
            }
        }
    }
    return result;
};

const populateVariables = (string, values) => {
    for (const key in values) {
        string = string.replace(
            new RegExp(`\\{${key}\\}`, 'g'),
            values[key]
        );
    }
    return string;
};

const getFinalString = (content, template) => {
    return populateVariables(
        getStringResource(template.id, content),
        template.values
    );
};

// execution starts here
file('strings.xml', (content) => {
    
    console.log(getFinalString(content, {
        id: 'origin_country',
        values: ['India', 2026]
    }));
    
});