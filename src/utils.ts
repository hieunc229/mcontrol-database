
export function to16Chars(number: number): string {
    let str = `000000000000000${number}`
    return str.substr(str.length - 16, 16)
}

export function deepMerge(target: { [prop: string]: any }, source: { [prop: string]: any }) {
    // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            if (source[key] instanceof Object)
                Object.assign(source[key] || {}, deepMerge(target[key] || {}, source[key]));
        }
    }

    // Join `target` and modified `source`
    return Object.assign(target || {}, source)

}