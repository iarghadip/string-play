// imagine this content is taken from a file io read

content = `
<string>Hello</string>
dsgfdfgdfg
 <string id="origin_country">Made in {0} under < an hour

and does support multi line
</string> 
fg
fgdfgdfgdfg

f
            <string id="hello">Hello</string>
<string>Hello</string>
`

// this is my strings.xml parser
// this is not an actual xml parser
// i just wrote the logic as i was bored
// it does not support xml element hirearchy
// but it does not break on xml syntax error
// TODO: ignore multiple spaces before id arg

const getStringResource = (id, content) => {
    const headPat = `<string id="${id}">`;
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
            } else if (!tailFound) {
                tailStart = i;
                tailFound = true;
                for (let j = 0; j < tailPat.length; j++) {
                    if (content[i + j] !== tailPat[j]) {
                        tailFound = false;
                        break;
                    }
                }
            } else {
                for (let i = headStart; i < tailStart; i++) {
                    result = result ? result + content[i] : content[i];
                }
                break;
            }
        }
    }
    return result;
};

const populateStringVariables = (string, values) => {
    values.forEach((v, i) => {
        string = string.replace(new RegExp(`\\{${i}\\}`), v);
    });
    return string;
};

const getPSVR = (id, values) => {
    const value = getStringResource(id, content);
    //console.log(value)
    return populateStringVariables(value, values);
};

console.log(
    getPSVR('origin_country', ['India'])
)
