export const capitalizeFirstLetter = str => str.toString()[0].toUpperCase() + str.substring(1);

export const objectifyForm = (inp) => {
    const rObject = {};
    for (const item of inp) {
        const name = item.name;
        const value = item.value;
        if (name.endsWith('[]')) {
            const key = name.slice(0, -2);
            if (Array.isArray(rObject[key])) {
                rObject[key].push(value);
            } else {
                rObject[key] = [value];
            }
        } else {
            rObject[name] = value;
        }
    }
    return rObject;
};