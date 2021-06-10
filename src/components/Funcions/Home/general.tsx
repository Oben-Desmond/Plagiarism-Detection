export function removeOccurence(str: string | undefined, litarray: string[]) {
    if (!str) {
        return ``
    }
    for (let i = 0; i < litarray.length; i++) {
        const lit = litarray[i]
        while (str.indexOf(lit) >= 0) {
            str = str.replace(lit, ``)
        }
    }
    return str
}