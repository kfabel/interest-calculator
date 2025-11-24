export default class EnvLoader {
    constructor(){}

    
    get<T>(varname: string, defaultValue?: T): T|null {
        const realVar = `VITE_${varname}`
        return import.meta.env[realVar] ?? defaultValue;
    }

    getReplace<T>(varname: string, defaultValue?: T): T|null {
        let value = this.get<string|null>(varname, null);

        if(value === null) return defaultValue || null;

        return this.replaceEnv<T>(value);
    }

    replaceEnv<T>(source: string): T|null {
        const matches = source.matchAll(/\%env\(['"](.*)['"]\)\%/g);

        [...matches].forEach(match => {
            console.log(match);
        })
        return null;
    }
}