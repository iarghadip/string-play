strings = `
dsgfdfgdfg
 <string id="origin_country">Made in {0}</string> 
fg
fgdfgdfgdfg

f
            <string id="hello">Hello</string>
<string>Hello</string>
`

const getStringResource = (id) => {
    return strings.match(new RegExp(
        `<string\\s+id="${id}">(.*?)<\\/string>`
    ))?.[1] ?? null;
};

const populateStringVariables = (string, values) => {
    values.forEach((v, i) => {
        string = string.replace(new RegExp(`\\{${i}\\}`), v);
    });
    return string;
};

const getPSVR = (id, values) => {
    const value = getStringResource(id);
    return populateStringVariables(value, values);
};

console.log(
    getPSVR('origin_country', ['India'])
)