// imagine this content is taken from a file io read

content = `
<!-- Dummy strings.xml parser test file -->
<string id="app_name">My Awesome App</string>

dsgfdfgdfg invalid text here

<string if="user_logged_in" any="ff" id="welcome_message" readonly priority="high">Welcome back, {0}! You have {1} new notifications.

This spans multiple lines
and includes <special> chars & entities.
</string>

fgdfgdfgdfg
filler text

            <string id="hello">Simple Hello</string>

<string id="hello">Hello Duplicate 1</string>
<string id="hello">Hello Duplicate 2</string>



<string>Hello</string> <!-- no id, ignore -->

<bogus>Invalid tag, parser should skip</bogus>

<string id="error_title" type="error" visible="false">Error Occurred</string>
<string id="error_message">Something went wrong: {0}. Please try again later.

Details:
- Network issue
- Server down
- {1} timeout
</string>

more garbage dfgdfgdfgdfgdfg

  <string id="button_ok">OK</string>
<string id="button_cancel" disabled>Cancel</string>
<string id="button_save" class="primary">Save Changes</string>

<string id="user_profile">
Name: {0}
Email: {1}
Country: {2}
Bio:
{3}
</string>

fillerfillerfiller

<string id="settings_title">App Settings</string>
<string id="theme_dark">Dark Mode</string>
<string id="theme_light">Light Mode</string>
<string id="language_en">English</string>
<string id="language_hi">हिंदी</string>

<!-- nested lookalike but invalid -->
<string id="menu_home">
Home
<sub>Sub item</sub> <!-- ignore sub -->
More text here
</string>

dfgdfgdfgdfgdfgdfgdfgdfgdfg

<string id="long_text" multiline="true">This is a very long string resource that spans many lines for testing multiline extraction.

Line 1: Normal text
Line 2: With numbers 12345
Line 3: Special chars !@#$%^&*()
Line 4: Unicode: café naïve naïve
Line 5: Empty-ish line

Line 6: Ends here.
</string>

// <!--string id="hello_4">Hello 4 with extra space   </string>

<string id="hello_24">This works</string>

final <string id="footer">© 2026 All Rights Reserved</string>

trailing garbage garbage garbage 

<string id="hello_4">But if i remove the above and only keep this it does not work???</string>

`

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
            } else {
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

//console.log(`"${getPSVR('origin_country', ['India'])}"`, loop_count)

//console.log(`"${getPSVR('hello', [])}"`)
//
console.log(`"${getPSVR('hello_4', [])}"`, loop_count)
