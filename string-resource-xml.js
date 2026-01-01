// imagine this content is taken from a file io read

content = `
random header noise !!! ### $$$
<!-- fake strings.xml playground -->

<string id="app_title">Garbage App</string>
unrelated text 123 abc xyz
<string id="login_text">Login</string> #### ####

<string idx="wrong_attr">Should be ignored</string>
<string id="welcome_user">Welcome, {0}</string>

@@@@ random symbols &&& %%^^
<string id="dup">First</string>
<string id="dup">Second</string>

<string>no id at all</string>
<invalidTag id="x">broken</invalidTag>

<string id="multiline_test">
Line one
Line two with junk $$$
Line three <notatag> & stuff
</string>

trailing trash trailing trash trailing trash
<string id="footer_ok">Footer OK</string>

final noise final noise
<string 9id="broken_footer">© Broken Footer</string>
garbage garbage garbage garbage

// commented out but still text
// <string id="ghost">Ghost</string>



end junk end junk end junk
<string 2id="foot2er">© 2027 All Rights Reserved</string>
more garbage more garbage more <string id="hello">Hello {0} - {0} is good {PERSON_NAME}</string> garbage

this line belongs to {PERSON_NAME}


`;


// this is my strings.xml parser
// this is not an actual xml parser
// i just wrote the logic as i was bored
// it does not support xml element hirearchy
// but it ignores invalid xml lines

let loop_count = 0;

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
        loop_count++;
        if (content[i] === '<') {
            if (!headFound) {
                headFound = true;
                for (let j = 0; j < headPat.length; j++) {
                    loop_count++;
                    headStart = i + j + 1;
                    if (content[i + j] !== headPat[j]) {
                        headFound = false;
                        break;
                    }
                }
                if (headFound) {
                    let paraFoundFinal = false;
                    for (let t = headStart; content[t] !== '>'; t++) {
                        loop_count++;
                        let paraFound = true;
                        if (content[t] === 'i') {
                            for (let j = 0; j < paraPat.length; j++) {
                                loop_count++;
                                headStart = t + j + 1;
                                if (content[t + j] !== paraPat[j]) {
                                    paraFound = false;
                                    break;
                                }
                            }
                            if (paraFound) {
                                while (content[headStart - 1] !== '>') {
                                    loop_count++;
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
                    loop_count++;
                    if (content[i + j] !== tailPat[j]) {
                        tailFound = false;
                        break;
                    }
                }
            }
            if (headFound && tailFound) {
                for (let j = headStart; j < tailStart; j++) {
                    loop_count++;
                    result = result ? result + content[j] : content[j];
                }
                break;
            }
        }
    }
    return result;
};

const populateStringVariables = (string, values) => {
    for (const key in values) {
        string = string.replace(
            new RegExp(`\\{${key}\\}`, 'g'),
            values[key]
        );
    }
    return string;
};

const getPSVR = (id, values) => {
//  const value = content;
    const value = getStringResource(id, content);
    //console.log(value)
    return populateStringVariables(value, values);
};

//console.log(`"${getPSVR('origin_country', ['India'])}"`, loop_count)

//console.log(`"${getPSVR('hello', [])}"`)
//
console.log(`"${getPSVR('hello', [2026])}"`, loop_count)

console.log(`"${getPSVR('hello', { 0: 2026, PERSON_NAME: 'Arghadip' })}"`, loop_count)
